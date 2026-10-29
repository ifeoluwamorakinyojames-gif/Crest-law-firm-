# GitHub as the single source of truth — Crest Crown Attorneys

## Confirmed architecture
- Repository: `ifeoluwamorakinyojames-gif/Crest-law-firm-`
- Website: static one-page HTML + CSS + JavaScript.
- No Sanity or separate database. An optional branded `/admin/` Decap CMS editor saves structured content to GitHub.
- All changes, including text, layout, images, SEO, and links, must be made and tracked in GitHub.
- Current branches: `main` (release baseline), `develop` (integration and staging), `feature/*` (new work).

## The change-to-preview path
1. Make changes on `feature/*` based on the latest `develop`.
2. Open a pull request into `develop`.
3. Run the static website checks (Python site validation and JavaScript syntax).
4. Review and merge the PR into `develop`.
5. `.github/workflows/pages-preview.yml` packages and publishes **only** to GitHub Pages staging after GitHub Pages is configured.
6. Obtain the real preview URL from the successful GitHub Actions run, then review on desktop and mobile.
7. Keep production deployment a separate, explicitly approved step. Never auto-deploy the official domain.

## One-time owner setup
GitHub repository → Settings → Pages → Build and deployment → Source → **GitHub Actions**.
No `CNAME` or custom-domain setting is required for the GitHub Pages preview.

If the Pages pipeline is not enabled, the code remains available through GitHub and local preview, but there is **not yet a live GitHub Pages URL**.

## Local development
```bash
git clone https://github.com/ifeoluwamorakinyojames-gif/Crest-law-firm-.git
cd Crest-law-firm-
git switch develop
git pull
git switch -c feature/my-website-change
python3 -m http.server 8000
```
Use `http://localhost:8000` to review the local site.
Validate with:
```bash
python3 scripts/check_site.py
python3 scripts/check_admin.py
node --check script.js
node --check content-loader.js
```

## Images, security, and go-live
The original lawyer photographs should not be committed to this currently public repository without authorization. The temporary staging image URLs are external to GitHub and should be migrated to approved repo assets when privacy and rights are confirmed. The site is configured `noindex,nofollow` during development.

Never edit the hosted deployment directly, upload secrets to GitHub, merge to `main`, change DNS, or connect the official production domain without explicit authorization from the firm.

## GitHub-backed content administration
The `/admin/` interface edits `content/*.json` directly in GitHub through Decap CMS; publishing follows GitHub pull request review. OAuth login requires an approved separate provider and is not yet live. Instructions: `docs/ADMIN_SETUP.md`.
