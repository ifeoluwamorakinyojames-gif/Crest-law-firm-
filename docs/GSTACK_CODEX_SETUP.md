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
