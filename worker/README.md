# Crest Crown Attorneys — Password-only admin Worker

## What it does

- A dedicated, password-only login at the Worker's `/admin` path (no username, GitHub OAuth or employee GitHub account required).
- Reads and saves the firm's four public JSON content documents directly to GitHub staging from the **server**, never exposing GitHub tokens to the browser.
- First login uses a privately provisioned bootstrap password, then requires an immediate password change.
- Later password changes require the current password and invalidate other existing sessions.
- Password hashes use PBKDF2-SHA-256 with a random salt and 210,000 iterations, persisted in a Cloudflare KV namespace; sessions are random short-lived opaque cookies.
- Restricts file updates to `content/site.json`, `content/practices.json`, `content/team.json` and `content/articles.json`; no client files or private lawyer documents belong in the public repository.

## Owner activation (required; not completed by this GitHub commit)

From the repository checkout:

1. Authenticate securely to your own Cloudflare account, then enter `worker/`:
   `cd worker` and `npx wrangler login`.
2. Copy `wrangler.example.toml` to **`wrangler.toml`** and keep the latter out of Git. Confirm the settings target this repository and the staging `develop` branch.
3. Run `npx wrangler kv namespace create ADMIN_KV` and paste the returned namespace **ID** into the `ADMIN_KV` binding in `wrangler.toml`.
4. Create a **fine-grained GitHub token** limited to this repository with **Contents: read/write** permission. Store it only as the Cloudflare secret:
   `npx wrangler secret put GITHUB_TOKEN`.
   Never include it in source files, a web page, a screenshot or a conversation.
5. Create a **strong temporary password** that is not previously shared or publicly known. Save it only as a Worker secret:
   `npx wrangler secret put BOOTSTRAP_ADMIN_PASSWORD`.
   The previously suggested simple password should not be used for an exposed administrator account.
6. Deploy the Worker to your account:
   `npx wrangler deploy`.
7. Open the actual HTTPS URL returned by Wrangler followed by `/admin`. Sign in using the bootstrap secret, then immediately set a private, unique password of at least 14 characters.
8. Edit `admin/password-admin.json` to put the **actual deployed** HTTPS `/admin` URL in `adminUrl`. This is a public link, **not** a secret. Review and merge that file with the development PR.
9. Confirm sign-in, first-use password change, logout, article guard, and a harmless test edit on staging. Do not merge to production without firm authorization.

Cloudflare dashboard secrets can also be used instead of CLI. The account owner must explicitly configure the Cloudflare account, token and KV binding; **this repository does not include credentials or trigger deployment**.

## Security limitations and future improvements

This is a single administrator password, not separate staff identities; it cannot attribute changes to individual staff. Password-only access lacks per-user audit logs and optional 2FA. The KV-based IP attempt counter is best-effort due to KV's eventual consistency; enable Cloudflare edge rate-limiting or WAF challenges before internet-facing release. Move to named accounts when the firm needs multiple administrators and accountable approvals.

The Worker and GitHub Pages staging site are on different domains, so the login is hosted at the Worker's own HTTPS URL. The GitHub Pages `admin/` page is **only a link**, not a browser-side password gate. Passwords and tokens must never appear in GitHub commit history, HTML, JavaScript, configuration, analytics or the public website.

The Worker updates the `develop` branch, and GitHub Pages staging deployment from `develop` requires the repository owner to enable GitHub Pages. The current AppDeploy preview is a separate application and is **not** updated by this Worker.

If an authorized administrator loses the password, the owner must perform a protected recovery process on Cloudflare/KV. Simply changing the bootstrap secret does **not** reset a changed password; avoid destructive KV resets without owner verification and backup.
