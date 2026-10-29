# Codex and gStack — Crest Crown Attorneys

## Context and owner
Repository: `ifeoluwamorakinyojames-gif/Crest-law-firm-`
This is a Nigerian law-firm website. Development must protect client data and professional accuracy.
Active branches: `main` (release baseline), `develop` (integration), `feature/*` (work).

## Working rules
1. Work on `feature/*` branches from `develop`, then open pull requests back into `develop`.
2. Do not merge into `main` or change a production domain without explicit, separate authorization.
3. Never add deployment tokens, API keys, client documents, confidential enquiries or secrets to Git.
4. Before proposing publication, confirm every lawyer's identity, title, degree, affiliations, practice claims and photographs with the firm.
5. Preserve the official Crest Crown Attorneys logo, royal-navy/gold design, accessible typography, responsive layout, and consistent lawyer qualification format.
6. Treat Legal Insights as legal-editorial drafts until approved by Counsel. Do not invent decisions, case results, awards, guarantees or testimonials.
7. Any new public contact form must minimise personal information and avoid receiving confidential legal case details by default.
8. Make any CMS integration permission-based; separate author, legal reviewer and publisher roles.
9. Run: source review, TypeScript check, tests, accessibility and performance QA, security checks, PR review, and release checklist.
10. Keep this repo private before importing the existing full code or client media.

## gStack workflow
When installed locally, use the documented specialist review sequence:
`/office-hours` → `/plan-ceo-review` → `/plan-design-review` → `/plan-eng-review` → `/review` → `/qa` → `/cso` → `/benchmark` → `/ship`.
This is an instruction guide, **not evidence** the gStack CLI or individual roles have executed.
The terminal release/deploy skills must not run against production unless separately approved.

## Read before coding
- `README.md`
- `docs/GSTACK_CODEX_SETUP.md`
- `docs/RELEASE_GATES.md`

## User-facing acceptance
Every completed PR should state the change, impacted routes, commands/tests executed, remaining risks and whether the site was deployed. Do not claim a test passed without its result.
