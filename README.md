# Crest Crown Attorneys — Static Landing Page

**Project:** Crest Crown Attorneys, Effurun, Delta State, Nigeria.

This is a **single-page static website**, built with semantic HTML, responsive CSS and minimal vanilla JavaScript. **No Sanity, CMS, database, login or backend.**

## Landing page sections
Home/hero → About the Firm → Legal Practice Areas → Legal Team → Legal Education → Contact.

## Local preview
Clone the repository, switch to `feature/one-page-landing-site`, then run:
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
- Preview uses static `index.html`, `styles.css`, and `script.js` from this GitHub repository.
- The preview is still `noindex,nofollow` until Counsel authorizes publication.

See `docs/GITHUB_SOURCE_OF_TRUTH.md`, `AGENTS.md`, and `docs/GSTACK_CODEX_SETUP.md` for instructions.

## Run checks
```bash
python3 scripts/check_site.py
node --check script.js
```

**Approval required:** Counsel should verify all legal service descriptions, lawyer titles and qualifications, regulatory terminology, and public content before launch.
