import test from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import handler from '../src/index.js';

globalThis.crypto = webcrypto;
class Store {
  values = new Map();
  async get(key, mode) {
    const raw = this.values.get(key) ?? null;
    return mode === 'json' && raw !== null ? JSON.parse(raw) : raw;
  }
  async put(key, value) { this.values.set(key, value); }
  async delete(key) { this.values.delete(key); }
}
function createEnvironment() {
  return {
    ADMIN_KV: new Store(),
    GITHUB_TOKEN: 'test-secret-not-for-browser',
    BOOTSTRAP_ADMIN_PASSWORD: 'a-private-test-only-initial-secret',
    GITHUB_OWNER: 'sample',
    GITHUB_REPO: 'sample',
    GITHUB_BRANCH: 'develop'
  };
}
function req(path, method = 'GET', body, cookie) {
  const headers = {};
  if (body) {
    headers.origin = 'https://admin.example';
    headers['content-type'] = 'application/json';
  }
  if (cookie) headers.cookie = cookie;
  return new Request('https://admin.example' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
}
test('private password bootstrap, forced change and guarded editing', async () => {
  const env = createEnvironment();
  let out = await handler.fetch(req('/api/auth/me'), env);
  assert.deepEqual(await out.json(), { authenticated: false, mustChange: false });
  out = await handler.fetch(req('/api/auth/login', 'POST', { password: 'incorrect' }), env);
  assert.equal(out.status, 401);
  out = await handler.fetch(req('/api/auth/login', 'POST', { password: env.BOOTSTRAP_ADMIN_PASSWORD }), env);
  assert.equal(out.status, 200);
  let data = await out.json();
  assert.equal(data.mustChange, true);
  const cookie = out.headers.get('set-cookie').split(';')[0];
  assert.match(out.headers.get('set-cookie'), /HttpOnly/);
  assert.match(out.headers.get('set-cookie'), /SameSite=Strict/);
  out = await handler.fetch(req('/api/content/site', 'GET', undefined, cookie), env);
  assert.equal(out.status, 403);
  out = await handler.fetch(req('/api/auth/change-password', 'POST', {
    currentPassword: env.BOOTSTRAP_ADMIN_PASSWORD,
    newPassword: 'short'
  }, cookie), env);
  assert.equal(out.status, 400);
  out = await handler.fetch(req('/api/auth/change-password', 'POST', {
    currentPassword: env.BOOTSTRAP_ADMIN_PASSWORD,
    newPassword: 'a-new-unique-password-for-test-only'
  }, cookie), env);
  assert.equal(out.status, 200);
  data = await out.json();
  assert.equal(data.passwordChanged, true);
  const newCookie = out.headers.get('set-cookie').split(';')[0];
  out = await handler.fetch(req('/api/auth/me', 'GET', undefined, cookie), env);
  assert.equal((await out.json()).authenticated, false);
  out = await handler.fetch(req('/api/auth/me', 'GET', undefined, newCookie), env);
  assert.equal((await out.json()).authenticated, true);
  out = await handler.fetch(req('/api/auth/login', 'POST', { password: env.BOOTSTRAP_ADMIN_PASSWORD }), env);
  assert.equal(out.status, 401);
  out = await handler.fetch(req('/api/auth/logout', 'POST', {}, newCookie), env);
  assert.equal(out.status, 200);
});
test('no API edit without a valid login', async () => {
  const env = createEnvironment();
  const result = await handler.fetch(req('/api/content/team', 'PUT', { sha: '0'.repeat(40), data: { people: [] } }), env);
  assert.equal(result.status, 401);
});
test('password login rejects cross-site JSON requests', async () => {
  const env = createEnvironment();
  const result = await handler.fetch(new Request('https://admin.example/api/auth/login', {
    method: 'POST',
    headers: { origin: 'https://other.example', 'content-type': 'application/json' },
    body: JSON.stringify({ password: 'wrong' })
  }), env);
  assert.equal(result.status, 403);
});
test('admin UI is served with restrictive headers', async () => {
  const env = createEnvironment();
  const result = await handler.fetch(req('/admin'), env);
  assert.equal(result.status, 200);
  assert.match(result.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  const html = await result.text();
  assert.match(html, /Administrator sign in/);
  assert.doesNotMatch(html, /GITHUB_TOKEN/);
});
