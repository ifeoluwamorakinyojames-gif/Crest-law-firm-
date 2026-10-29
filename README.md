# Crest Crown Attorneys — Static Landing Page

**Project:** Crest Crown Attorneys, Effurun, Delta State, Nigeria.

This is a **single-page static website**, built with semantic HTML, responsive CSS and minimal vanilla JavaScript. **No Sanity or application database.** A branded Decap CMS editor at `/admin/` proposes GitHub-backed content changes; GitHub OAuth setup is still required.

## Landing page sections
Home/hero → About the Firm → Legal Practice Areas → Legal Team → Legal Education → Contact.

## Local preview
Clone the repository and switch to `feature/github-admin-decap` for the pending admin feature branch, then run:
```bash
python3 -m http.server 8000
```
Visit http://localhost:8000/ in your browser. Or open `index.html` directly.

## Official content and assets
- Official business name: Crest Crown Attorneys
- Founder and Principal Counsel: Eloho Avwaruroro-Okoye, Esq.
- Legal Associate: Glory Toritseju Kunu
- Phone and WhatsApp: 08063914606
- Email: crestcrownattorneys@gmail.com
- Office: Urhumarho Junction, Off Effurun-Sapele Road, Effurun, Delta State
- Hours: Monday–Friday 8am–6pm; Saturday 10am–4pm

**Media note:** For this public development branch, the logo and professional portraits are linked to the existing publicly accessible staging-site media URLs, and not embedded as assets. Once the repository has been made private and the firm authorizes it, copy the assets into a local `assets/` folder and replace those temporary links.

## Architecture and accessibility
- Every website section is a same-page anchor, not a separate route.
- Direct contact through WhatsApp, email or phone; no data is stored.
- JSON-LD LegalService structured data with supplied firm details.
- Keyboard accessible mobile navigation and disclosures.
- SEO-oriented HTML headings and page copy.
- `noindex,nofollow` remains active until Counsel approves publication.

## GitHub-first development and staging
**GitHub is the only source of truth for website changes.** Every change is committed on a `feature/*` branch, checked in a pull request, then integrated into `develop`. A GitHub Pages Actions workflow will publish the staging preview from `develop` when GitHub Pages is configured in repository settings.

- No direct code changes in AppDeploy or any hosting dashboard.
- No automatic deployment of `main` or the firm's official domain.
- Preview uses static `index.html`, `styles.css`, `script.js`, `content-loader.js`, `content/*.json`, and `admin/` from GitHub.
- The preview is still `noindex,nofollow` until Counsel authorizes publication.

See `docs/GITHUB_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `docs/GSTACK_CODEX_SETUP.md` for instructions.

## Run checks
```bash
python3 scripts/check_site.py
python3 scripts/check_admin.py
node --check script.js
node --check content-loader.js
```

**Approval required:** Counsel should verify all legal service descriptions, lawyer titles and qualifications, regulatory terminology, and public content before launch.

## Editing website content

The landing page reads editable JSON from `content/`. Authorized lawyers will be able to propose changes through Decap CMS at `/admin/` once a secure GitHub OAuth provider has been configured. Editorial workflow sends drafts for review before merging to `develop`. See [Admin setup](docs/ADMIN_SETUP.md). Do not place a GitHub access token in the public site.
