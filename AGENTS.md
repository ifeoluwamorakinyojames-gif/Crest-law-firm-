# Crest Crown Attorneys — Codex / gStack project instructions

## Confirmed scope
Build and maintain **one responsive static landing page**. Do not introduce Sanity, another CMS, a database, user accounts, bookings backend, or additional page routes unless the user explicitly changes scope.

## Stack
Plain HTML5, CSS3 and minimal JavaScript. Source files: `index.html`, `styles.css`, `script.js`. QA: `scripts/check_site.py`. Avoid unnecessary dependencies and packages.

## Workflow
- Branch from `develop` to `feature/*`. PRs target `develop`.
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
Run `python3 scripts/check_site.py` and `node --check script.js`; inspect desktop and mobile layouts. Record any missing tests and limitations.

## Data handling
The GitHub repository was public at initial setup. Do not upload client-only documents or original portrait binaries until repo privacy is confirmed and the client permits their use.
