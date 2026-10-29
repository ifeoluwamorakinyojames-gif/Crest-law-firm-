# Crest Crown Attorneys — Codex / gStack project instructions

## Confirmed scope
Build and maintain **one responsive static landing page**. Use Decap CMS exclusively for GitHub-backed content editing at `/admin/`. Do not introduce Sanity, a separate CMS database, public user accounts, or a bookings backend. Do not add additional public content routes without approval.

## Stack
Plain HTML5, CSS3 and minimal JavaScript. Source files: `index.html`, `styles.css`, `script.js`, `content-loader.js`, and `content/*.json`. Editor: `admin/`. QA: `scripts/check_site.py` and `scripts/check_admin.py`. Avoid unnecessary dependencies and packages.

## Workflow
- GitHub repository `ifeoluwamorakinyojames-gif/Crest-law-firm-` is the authoritative source for **all** website edits.
- Do not edit the source on AppDeploy or any hosting dashboard: all changes must be reviewed commits in this repository.
- Branch from `develop` to `feature/*`. PRs target `develop`.
- After PR review and CI, merges to `develop` can publish **GitHub Pages staging only**, once enabled in Settings → Pages.
- Do not merge to `main` or deploy to a production domain without separate authorization.
- Keep legal content supplied by Counsel distinct from editorial drafts.
- Eloho is Founder & Principal Counsel. Glory is a Legal Associate, not a partner unless specifically confirmed.
- Do not invent qualifications, regulatory registrations, litigation outcomes, awards, client reviews, bar memberships or experience.
- Preserve official brand identity, navy/gold styling, real business contact details and accessibility.
- Keep contact a direct WhatsApp/email/telephone handoff; never collect confidential case details through an insecure form.
- Any content updates require reviewing the in-page structured data, headings and SEO metadata.
- Maintain `noindex,nofollow` for the development preview until authorized to publish.

## gStack workflow
Where gStack is installed in Codex, use its planning, engineering review, design review, code review, security and QA workflows. Do not claim individual gStack specialist roles ran unless they actually did.

## Checks
Run `python3 scripts/check_site.py`, `python3 scripts/check_admin.py`, `node --check script.js` and `node --check content-loader.js`; inspect desktop and mobile layouts. Record any missing tests and limitations.

## Data handling
The GitHub repository was public at initial setup. Do not upload client-only documents or original portrait binaries until repo privacy is confirmed and the client permits their use.

## Admin security and publishing
Decap CMS must use GitHub OAuth through a trusted provider, with credentials held outside the repository. Do not claim the login works until an authenticated editor has created a GitHub PR. The admin edits content JSON; the GitHub Pages staging build packages these files. See `docs/ADMIN_SETUP.md`.
