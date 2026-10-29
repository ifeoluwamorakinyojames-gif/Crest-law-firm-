# Codex + gStack local setup

Repository: https://github.com/ifeoluwamorakinyojames-gif/Crest-law-firm-

## 1. Protect the repository first
The repository was publicly visible when this workflow was initialized. Before committing the full app or client media, in GitHub open **Settings → General → Danger Zone → Change repository visibility → Make private**. Verify that the new visibility says Private.

## 2. Clone and switch to the integration branch
```bash
git clone https://github.com/ifeoluwamorakinyojames-gif/Crest-law-firm-.git
cd Crest-law-firm-
git fetch origin
git switch develop
git switch -c feature/website-source-import
```

## 3. Install prerequisites
Install Git, Node.js LTS, Bun as required by your gStack release, and a signed-in Codex CLI. On Windows, use Git Bash for shell scripts. Verify installation against the current upstream README.

## 4. Install gStack into Codex
The gStack repository is a separate tool, not a copy of this app:
```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/gstack
cd ~/gstack
./setup --host codex
```
Source: https://github.com/garrytan/gstack

Restart Codex if necessary. Ask the assistant to use `gstack-office-hours` or its available gStack skill names in Codex. Invoke planning, engineering review, UI review, security, QA and ship steps according to the project's needs. Availability can change by gStack version.

## 5. Add website source safely
After private visibility has been verified, bring the existing website files into your feature branch. The AppDeploy preview source currently lives separately at:
https://crest-crown-attorneys-website-preview-kmw62k.v2.appdeploy.ai/

Do not blindly overwrite newer changes. Compare the most recent source snapshot (including the legal-team qualifications and specialisation refactor) against any starter package. Keep client images out of commits until the firm authorizes their repository use.

## 6. Validate and open pull request
```bash
npm ci
npm run build
npm test --if-present
git add .
git commit -m "feat: import Crest Crown development website"
git push -u origin feature/website-source-import
```
Open a PR into `develop`, not `main`.

## 7. Release policy
- GitHub Actions only tests builds and PRs.
- No Cloudflare API token, Vercel production token or AppDeploy production key should be added.
- Production release is a separate client-authorized milestone after passing `docs/RELEASE_GATES.md`.
