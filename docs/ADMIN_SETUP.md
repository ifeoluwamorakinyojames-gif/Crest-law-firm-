# Crest Crown Attorneys — Password-only admin

**Current implementation:** A secure password-only administration application is implemented in `worker/src/`; the static GitHub Pages `admin/` page links to the Worker after the owner configures its actual HTTPS URL. Admin users do **not** need GitHub accounts.

**Deployment status:** Worker hosting, KV namespace and required secrets still need owner configuration. Until activated, no default password works on the staging site. The former Decap GitHub OAuth configuration is inactive and retained for reference only. Do not mistake it for the active login.

See [worker/README.md](../worker/README.md) for exact setup, first password and reset flow, Cloudflare KV binding, GitHub token, security and testing.

## Content editing

After signing in, staff can edit structured JSON documents for website settings, practice areas, lawyers and articles. They are saved using a **server-side GitHub API token** held as a Cloudflare Worker secret. The token is never sent to the browser.

- The initial password is set privately in Cloudflare as a Worker secret; it is not in this repository.
- The first login forces a change to a new password with at least 14 characters.
- Subsequent password changes are available from the admin dashboard.
- Session cookies are HttpOnly, Secure and SameSite=Strict.
- Attempts are rate-limited, and stale sessions are invalidated when the password changes.
- GitHub staging changes are committed to the **develop** branch, not directly to `main` or a production domain.
- Publishing of law firm articles requires `legalReviewed=true`, but legal oversight must still be performed by authorized Counsel before production publication.
- The static `admin/config.yml` remains a legacy Decap configuration and is not used by the new password-only dashboard.

## Remaining approval requirements

A publicly shared or easily guessed initial password must not be used to protect the site's admin account. Do not store client files, private case material, secrets or password data in this public repository. Confirm firm authorization, make the GitHub repository private if needed, and protect the development/production release branches. The Worker needs Cloudflare deployment and real secret configuration; this code change alone does not activate sign-in.
