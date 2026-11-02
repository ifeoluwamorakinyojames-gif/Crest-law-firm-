# Crest Crown Attorneys — GitHub audit remediation
Date: 2026-11-02

## GitHub staging changes (this feature branch)
- Third team profile: Ejeremedoghene Ejiroghene (Family Law), using the public image on the separate AppDeploy preview; **do not upload original photo/credentials into this public repository without the firm's authorization**.
- Three-column team layout with mobile breakpoints and accessible photograph fallback.
- Working enquiries from each service card; no pretend detail links.
- Privacy and legal disclaimer **review drafts**, linked from the footer, not represented as legally approved.
- Preview favicon (abstract brand-colored mark, **not claimed to be the official approved logo**), social title and descriptions.
- Counsel-review status added to GitHub article content, with a site renderer filter and CI assertion to prevent accidental publishing of drafts.
- Static checking extended for the new links, pages, staff data and publication guards.
- Lighthouse CI workflow with local report artifacts and initial warning-only budgets; Lighthouse has NOT been run by this document alone.
- Existing GitHub Pages staging workflow updated to package linked pages/assets.

## Not complete / requires owner or counsel
1. **Source-of-truth decision**: The AppDeploy React preview uses a different CMS and codebase. This branch improves GitHub's existing static/Decap implementation; it **does not sync AppDeploy**.
2. **Admin sign-in**: Decap GitHub OAuth requires an approved secure OAuth service and verified repository permissions. No credentials or secrets are included.
3. **Legal approval**: Counsel must approve policies, biography credentials, practice claims and any legal articles; checkbox alone is insufficient for an independent sign-off. Use reviewed PRs and branch protection.
4. **Domain and SEO launch**: Keep staging `noindex,nofollow`. On an approved production deployment, establish canonical clean URLs, per-page SEO, official domain, sitemap/robots policy, local business data, verified logo and analytics.
5. **Image ownership**: Photos and logo currently point to a separately hosted preview; migrate to consented repository/production assets after permissions are confirmed.
6. **GitHub Pages and CI**: Pages must be enabled by repository owner; audit metrics and CI status must be checked after the PR workflow runs.

## PR QA checklist
- [ ] Static checks run successfully
- [ ] All three team cards render on mobile/desktop
- [ ] External media URLs respond and fallback remains usable
- [ ] Service links lead to contact section
- [ ] Privacy/terms pages open and visibly require Counsel review
- [ ] Admin OAuth is either configured and tested or prominently documented as inactive
- [ ] Published content has legalReviewed=true and PR sign-off
- [ ] Lighthouse report reviewed after the workflow runs
- [ ] No production or custom domain changes
