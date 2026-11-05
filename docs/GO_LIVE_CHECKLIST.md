# Crest Crown Attorneys — go-live gate (not yet approved)
## Mandatory before public launch
1. Confirm the firm-approved legal name, physical address, verified email and telephone, logo, portraits, lawyer credentials and approved copy. Replace all visible "pending verification" text.
2. Obtain counsel-approved privacy policy, terms and disclaimer. Confirm NDPA-compliant personal-data handling and retention for enquiries. Do not collect confidential case information.
3. Cloudflare Pages: connect GitHub main, build command npm run build, output dist, production branch main. Configure Functions and verify deep-link routes.
4. Cloudflare D1: create DB binding named DB and apply migrations 0001_content.sql and 0002_content_entities.sql to production.
5. Cloudflare R2: create bucket binding named MEDIA and test authenticated uploads, public image delivery and image accessibility.
6. Cloudflare Access: protect /admin/* and configure CF_ACCESS_TEAM_DOMAIN, CF_ACCESS_AUD and ADMIN_EMAILS. Test both approved administrator emails and deny unauthorised users.
7. Cloudflare Turnstile: set TURNSTILE_SITE_KEY and secret TURNSTILE_SECRET_KEY, add production hostname, configure WAF rate limiting and test form valid/invalid submissions.
8. Confirm enquiry notifications or assign a responsible administrator to monitor enquiries; current implementation stores enquiries in D1 and does not send email.
9. Test production preview on mobile, desktop, keyboard and screen reader; check every route, CMS create/edit/publish, image upload, 404 behavior and legal page accuracy.
10. Verify SEO indexability only after all gates pass: remove robots.txt Disallow: / AND remove the temporary robots noindex meta tag from index.html. Submit verified sitemap to Google Search Console. No public indexing before content approval.
11. Configure analytics and advertising conversions only with appropriate privacy notices and consent.
12. Require a successful GitHub Actions build for this branch and a verified Cloudflare preview before merging.
## Current restrictions
The site remains intentionally noindex. No Cloudflare production deployment, browser integration test, approved legal text, or verified contact details are confirmed by GitHub CI. Do not call it production-ready until these are done.
