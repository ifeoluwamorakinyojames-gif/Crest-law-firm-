# Codex + gStack for the static Crest Crown landing page

This project has one public landing-page route. There is **no Sanity or CMS** and no production deployment integration.

## 1. Branch workflow
```bash
git clone https://github.com/ifeoluwamorakinyojames-gif/Crest-law-firm-.git
cd Crest-law-firm-
git fetch origin
git switch develop
git switch -c feature/my-change
```

## 2. Local preview and QA
```bash
python3 -m http.server 8000
python3 scripts/check_site.py
node --check script.js
```

## 3. Codex + gStack
Install Codex and prerequisite Git/Node/Bun as required by the current gStack README. On Windows use Git Bash for shell scripts.

```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/gstack
cd ~/gstack
./setup --host codex
```
Source: https://github.com/garrytan/gstack

Run only the relevant available specialist skills for planning, design review, review, security and QA. Do not run production release commands.

## 4. Pull requests
Push changes to your feature branch and open a PR targeting `develop`. No automatic production deployment exists. Review the release gates before any eventual launch.

## 5. Security
The repository was publicly visible during initialization. Do not commit sensitive client documents or original portrait images until it is private and approved.

## GitHub-only staging preview
The GitHub Pages preview workflow lives in `.github/workflows/pages-preview.yml`. It listens only to pushes to `develop`.

1. Open the repo's **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
2. Review PR changes and passing checks, then merge into `develop`.
3. GitHub Actions packages the three static site files and deploys the preview to GitHub Pages.
4. Find the actual staging URL from the successful workflow's `github-pages` environment. Do not assume a URL is live until GitHub confirms deployment.

Never put a `CNAME` file, custom domain, or production token in this workflow. Do not publish `main` automatically. Existing images are temporarily loaded from public staging media until authorized local assets are added.

See `docs/GITHUB_SOURCE_OF_TRUTH.md`.
