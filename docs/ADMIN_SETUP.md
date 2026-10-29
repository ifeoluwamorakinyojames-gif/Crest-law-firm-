# Crest Crown Attorneys — GitHub-backed Admin Setup

## What this implements

A branded **/admin/** content editor using Decap CMS and the repository's own JSON content files. The public website stays a single landing page, with no Sanity, SQL database or application backend. Authorized editors use their GitHub accounts to propose content updates. The Decap editorial workflow creates a change branch / pull request, and only approved changes merged into `develop` reach the GitHub Pages staging preview.

### Editable content
- `content/site.json`: homepage hero, About, brand logo, legal education intro, contact information and SEO.
- `content/practices.json`: descriptions and ordering of legal services.
- `content/team.json`: lawyer portraits, qualifications, specialisations, professional memberships and biography.
- `content/articles.json`: summaries of approved Legal Insights to display on the landing page. Draft and review articles are **not** shown.

The existing `index.html` includes a fallback static page. `content-loader.js` reads the JSON files and replaces the displayed content when the site is loaded. The GitHub Pages workflow copies the editor and JSON content to staging. Avoid changing index.html content without also maintaining the JSON sources.

## Important: Admin login is not active until OAuth is configured

Decap's GitHub backend requires an OAuth authentication service. GitHub Pages **does not provide one**. Do not place a GitHub Client Secret, OAuth token, or personal access token in GitHub source code or in browser JavaScript.

Before using /admin:

1. Confirm whether the repository should stay **public**. It is currently public; obtain approval before uploading private lawyer documents, client files or internal material. Use repository permissions carefully.
2. Choose a trusted GitHub OAuth provider: a properly configured external OAuth proxy (for example, a small Cloudflare Worker), or a hosted Decap-compatible OAuth service.
3. Register the required GitHub OAuth application; configure its callback URL to the chosen OAuth service, not to an invented URL. Store the client secret **only** in the service's protected secret settings.
4. Edit `admin/config.yml` in a new GitHub feature branch: uncomment `backend.base_url` and set it to the verified HTTPS URL of that OAuth service. Keep `auth_endpoint: auth`.
5. Verify login with a GitHub account that has **write access** to `ifeoluwamorakinyojames-gif/Crest-law-firm-`. Remove write permissions for people who should not edit.
6. Open a test edit (such as changing a harmless headline) from the CMS, save a draft, confirm that GitHub creates a draft branch/PR, then approve and merge the edit into `develop`. Verify the staging website updates.

Do not approve or publish unreviewed Nigerian legal guidance or unverifiable lawyer credentials.

Official Decap documentation:
- https://decapcms.org/docs/github-backend/
- https://decapcms.org/docs/backends-overview/
- https://decapcms.org/docs/editorial-workflows/

## GitHub Pages setup

From repository Settings → Pages, choose **GitHub Actions** as the build/deployment source. The workflow `.github/workflows/pages-preview.yml` publishes only from `develop`. It includes `admin/index.html`, `admin/config.yml`, `admin/admin.css`, `content/*.json`, `content-loader.js`, the original index/styles/script and uploaded media.

The staging URL is provided by GitHub Actions after successful deployment. Do not invent or use the official law-firm domain as a test URL.

## Admin URLs

After GitHub Pages is enabled, open the verified staging URL with `/admin/` appended. A login page can render before OAuth is connected, but authentication and editing **cannot work** until the OAuth provider is configured and tested.

## Privacy, content approval and security

- GitHub controls **all** website edits. Do not edit the hosting system directly.
- Decap is a static editor. The /admin URL is publicly discoverable; **GitHub permissions and OAuth**, not URL secrecy, secure edits.
- Editors should use their own GitHub identities, not shared accounts.
- GitHub provides commit history; require pull requests for legal-content approval.
- The public landing page remains `noindex,nofollow` on staging.
- Content fields are rendered with DOM `textContent` to avoid inserting arbitrary HTML.
- Do not collect client files or confidential case material through this landing page.
- Images uploaded through Decap are committed into `media/uploads/` in GitHub. Obtain consent before publishing portraits or internal images.

## Release status

As of this setup: admin UI, collections, data files, review workflow and staging packaging are committed on `feature/github-admin-decap`. GitHub OAuth is **not configured**; no authorized editor login or end-to-end CMS publishing has been verified. No official domain or `main` branch has been modified.
