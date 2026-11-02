import { PAGE, STYLE, CLIENT } from './ui.js';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const FILES = Object.freeze({
  site: 'content/site.json',
  practices: 'content/practices.json',
  team: 'content/team.json',
  articles: 'content/articles.json'
});
const AUTH_KEY = 'password-admin:credentials';
const COOKIE_NAME = '__Host-crest_admin';
const SESSION_SECONDS = 3600;
const ROUNDS = 210000;

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...extra
    }
  });
}
function b64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}
function unb64(value) {
  const raw = atob(value);
  return Uint8Array.from(raw, char => char.charCodeAt(0));
}
function randomString() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return b64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
async function digest(value) {
  const result = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));
  return Array.from(new Uint8Array(result), x => x.toString(16).padStart(2, '0')).join('');
}
function equalConstantTime(left, right) {
  const a = String(left), b = String(right);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
async function makeHash(password, saltB64) {
  const key = await crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: unb64(saltB64),
    iterations: ROUNDS
  }, key, 256);
  return b64(new Uint8Array(bits));
}
async function checkPassword(password, record, env) {
  if (!record) {
    if (!env.BOOTSTRAP_ADMIN_PASSWORD) return false;
    return equalConstantTime(await digest(password), await digest(env.BOOTSTRAP_ADMIN_PASSWORD));
  }
  return equalConstantTime(await makeHash(password, record.salt), record.hash);
}
function sessionCookie(value, maxAge) {
  return COOKIE_NAME + '=' + value + '; Secure; HttpOnly; Path=/; SameSite=Strict; Max-Age=' + maxAge;
}
function cookieValue(request) {
  const raw = request.headers.get('cookie') || '';
  const part = raw.split(';').map(s => s.trim()).find(s => s.startsWith(COOKIE_NAME + '='));
  const value = part ? part.slice(COOKIE_NAME.length + 1) : '';
  return /^[A-Za-z0-9_-]{20,100}$/.test(value) ? value : '';
}
async function credentials(env) {
  return env.ADMIN_KV.get(AUTH_KEY, 'json');
}
async function createSession(env, version) {
  const token = randomString();
  await env.ADMIN_KV.put('session:' + await digest(token), version, { expirationTtl: SESSION_SECONDS });
  return token;
}
async function currentSession(request, env) {
  const token = cookieValue(request);
  if (!token) return null;
  const record = await credentials(env);
  const version = record ? record.version : 'bootstrap';
  const active = await env.ADMIN_KV.get('session:' + await digest(token));
  if (!active || active !== version) return null;
  return { token, record, mustChange: !record };
}
async function attemptsKey(request) {
  const ip = request.headers.get('cf-connecting-ip') || 'unidentified';
  return 'login-attempts:' + await digest(ip);
}
async function failAttempt(key, env, count) {
  await env.ADMIN_KV.put(key, String(count + 1), { expirationTtl: 900 });
}
function sameOrigin(request) {
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  if (site === 'cross-site') return false;
  return origin === new URL(request.url).origin;
}
async function input(request) {
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) return null;
  const size = Number(request.headers.get('content-length') || 0);
  if (size > 120000) return null;
  try {
    const body = await request.text();
    if (body.length > 120000) return null;
    const value = JSON.parse(body);
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  } catch {
    return null;
  }
}
function validDocument(kind, data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || JSON.stringify(data).length > 100000) return false;
  if (kind === 'site') {
    return data.name === 'Crest Crown Attorneys' && !!data.hero && !!data.about && !!data.contact && !!data.seo;
  }
  if (kind === 'practices') {
    return Array.isArray(data.services) && data.services.length >= 1 &&
      data.services.every(item => typeof item.title === 'string' && typeof item.description === 'string');
  }
  if (kind === 'team') {
    return Array.isArray(data.people) && data.people.length >= 1 &&
      data.people.every(item => typeof item.name === 'string' && typeof item.bio === 'string' &&
        Array.isArray(item.specialisations));
  }
  if (kind === 'articles') {
    return Array.isArray(data.articles) && data.articles.every(item =>
      typeof item.title === 'string' && typeof item.summary === 'string' &&
      ['draft', 'review', 'published'].includes(item.status) &&
      (item.status !== 'published' || item.legalReviewed === true));
  }
  return false;
}
function githubUrl(kind, env) {
  const owner = encodeURIComponent(env.GITHUB_OWNER || '');
  const repository = encodeURIComponent(env.GITHUB_REPO || '');
  return 'https://api.github.com/repos/' + owner + '/' + repository + '/contents/' + FILES[kind] +
    '?ref=' + encodeURIComponent(env.GITHUB_BRANCH || 'develop');
}
async function githubDocument(kind, env) {
  const response = await fetch(githubUrl(kind, env), {
    headers: {
      authorization: 'Bearer ' + env.GITHUB_TOKEN,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'crest-crown-admin'
    }
  });
  if (!response.ok) return { error: 'GitHub content could not be loaded', status: 502 };
  const value = await response.json();
  if (!value.content || !value.sha) return { error: 'Unexpected GitHub response', status: 502 };
  try {
    return { sha: value.sha, data: JSON.parse(textDecoder.decode(unb64(value.content.replace(/\s/g, '')))) };
  } catch {
    return { error: 'Invalid stored content', status: 502 };
  }
}
async function saveDocument(kind, body, env) {
  if (!validDocument(kind, body.data) || !/^[a-f0-9]{40}$/.test(String(body.sha || ''))) {
    return json({ error: 'Invalid content or version. Review fields and retry.' }, 400);
  }
  const url = githubUrl(kind, env).split('?')[0];
  const document = JSON.stringify(body.data, null, 2) + '\n';
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      authorization: 'Bearer ' + env.GITHUB_TOKEN,
      accept: 'application/vnd.github+json',
      'content-type': 'application/json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'crest-crown-admin'
    },
    body: JSON.stringify({
      message: 'content(admin): update ' + kind + ' on staging',
      branch: env.GITHUB_BRANCH || 'develop',
      sha: body.sha,
      content: b64(textEncoder.encode(document))
    })
  });
  if (response.status === 409 || response.status === 422) return json({ error: 'The file changed since you opened it. Reload before saving.' }, 409);
  if (!response.ok) return json({ error: 'GitHub could not save this update. Check the token and branch permissions.' }, 502);
  const data = await response.json();
  return json({ saved: true, sha: data.content?.sha, branch: env.GITHUB_BRANCH || 'develop' });
}
function staticResponse(content, type) {
  return new Response(content, {
    headers: {
      'content-type': type,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY',
      'referrer-policy': 'no-referrer',
      'content-security-policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
    }
  });
}
export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, '') || '/';
      if (request.method === 'GET' && path === '/') return Response.redirect(url.origin + '/admin', 302);
      if (request.method === 'GET' && path === '/admin') return staticResponse(PAGE, 'text/html; charset=utf-8');
      if (request.method === 'GET' && path === '/admin/app.js') return staticResponse(CLIENT, 'application/javascript; charset=utf-8');
      if (request.method === 'GET' && path === '/admin/style.css') return staticResponse(STYLE, 'text/css; charset=utf-8');
      if (!path.startsWith('/api/')) return json({ error: 'Not found' }, 404);
      if (!env.ADMIN_KV || !env.GITHUB_TOKEN) return json({ error: 'Admin service has not been configured' }, 503);
      if (request.method !== 'GET' && (!sameOrigin(request) || !await inputIsJSON(request))) {
        return json({ error: 'Invalid request origin or content type' }, 403);
      }
      if (path === '/api/auth/login' && request.method === 'POST') {
        const body = await input(request);
        if (!body || typeof body.password !== 'string' || body.password.length > 256) return json({ error: 'Invalid password submission' }, 400);
        const key = await attemptsKey(request);
        const attempts = Number(await env.ADMIN_KV.get(key) || 0);
        if (attempts >= 8) return json({ error: 'Too many attempts. Try again later.' }, 429, { 'retry-after': '900' });
        const record = await credentials(env);
        if (!await checkPassword(body.password, record, env)) {
          await failAttempt(key, env, attempts);
          return json({ error: 'Incorrect password' }, 401);
        }
        await env.ADMIN_KV.delete(key);
        const token = await createSession(env, record ? record.version : 'bootstrap');
        return json({ authenticated: true, mustChange: !record }, 200, { 'set-cookie': sessionCookie(token, SESSION_SECONDS) });
      }
      const session = await currentSession(request, env);
      if (path === '/api/auth/me' && request.method === 'GET') return json({ authenticated: !!session, mustChange: !!session?.mustChange });
      if (!session) return json({ error: 'Sign in to continue' }, 401);
      if (path === '/api/auth/logout' && request.method === 'POST') {
        await env.ADMIN_KV.delete('session:' + await digest(session.token));
        return json({ loggedOut: true }, 200, { 'set-cookie': sessionCookie('', 0) });
      }
      if (path === '/api/auth/change-password' && request.method === 'POST') {
        const body = await input(request);
        if (!body || typeof body.currentPassword !== 'string' || typeof body.newPassword !== 'string') return json({ error: 'Both passwords are required' }, 400);
        if (body.newPassword.length < 14 || body.newPassword.length > 128 || body.newPassword === body.currentPassword) {
          return json({ error: 'Choose a different password with at least 14 characters.' }, 400);
        }
        const record = await credentials(env);
        if (!await checkPassword(body.currentPassword, record, env)) return json({ error: 'Current password is incorrect' }, 401);
        const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
        const next = { salt, hash: await makeHash(body.newPassword, salt), version: randomString(), changedAt: new Date().toISOString() };
        await env.ADMIN_KV.put(AUTH_KEY, JSON.stringify(next));
        const token = await createSession(env, next.version);
        return json({ passwordChanged: true }, 200, { 'set-cookie': sessionCookie(token, SESSION_SECONDS) });
      }
      if (session.mustChange) return json({ error: 'Change the initial password before editing.' }, 403);
      const match = path.match(/^\/api\/content\/(site|practices|team|articles)$/);
      if (match && request.method === 'GET') {
        const data = await githubDocument(match[1], env);
        return data.error ? json({ error: data.error }, data.status) : json(data);
      }
      if (match && request.method === 'PUT') {
        const body = await input(request);
        return body ? await saveDocument(match[1], body, env) : json({ error: 'Expected JSON content' }, 400);
      }
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      return json({ error: 'An unexpected server error occurred.' }, 500);
    }
  }
};
function inputIsJSON(request) {
  return (request.headers.get('content-type') || '').toLowerCase().startsWith('application/json');
}
