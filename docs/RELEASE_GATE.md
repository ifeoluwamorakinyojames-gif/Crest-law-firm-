# Production release gate — do not merge or deploy without owner approval
## Build and quality
- GitHub Actions npm install, source check, and Vite build green.
- Cloudflare Pages preview build verified for all deep links, mobile layout, 404, sitemap, metadata, headers and accessibility.
- Cloudflare Pages Functions work with D1 and R2 bindings; migrations 0001 and 0002 applied.
- Cloudflare Access protects /admin/*; admin JWT audience, issuer and two verified allowlisted email addresses configured.
- Confirm unauthorized API writes fail, authorized draft creation works, publishing appears on site, unpublishing removes content.
- Test file upload type and size validation and media delivery.
- Verify general enquiry works; apply Cloudflare WAF rate limits and bot protection, and test data handling.
## Legal and marketing
- Firm verifies exact office address, phone, email, logo, portraits, lawyer qualifications, practice descriptions.
- Legal counsel approves privacy, terms, disclaimers, cookie/analytics consent and data retention.
- Google Ads / Meta Ads campaigns, tags and conversions require separate account setup, consent design and test events. No tracking is active by default.
- Remove development robots block only on approved launch.
- Obtain explicit production merge and deployment approval.
