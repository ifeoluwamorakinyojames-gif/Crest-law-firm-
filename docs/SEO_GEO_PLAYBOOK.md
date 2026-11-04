# Crest Crown Attorneys — SEO, Local Search & GEO Playbook

Updated 4 November 2026. Development and staging only. Counsel approval required.

## Indexing gate
The reviewed site and practice pages must remain `noindex,nofollow` on staging. Do not submit a sitemap or set canonical URLs to a placeholder domain. After approving an official domain, secure OAuth, contact data, practice descriptions and professional credentials, create absolute canonical URLs, remove `noindex` only from the production pages, create an XML sitemap for those production URLs, verify ownership in Google Search Console and submit the sitemap. Confirm HTTP 200, accessible server-rendered page copy, internal links, and mobile usability before submitting.

## Keyword framework
See `seo/keyword-map.json`. This is a keyword-to-page relevance map, not proof of search volume. Local Ubersuggest checks of three seed phrases returned zero measured volume; do not assert rankings or monthly search volumes without better evidence. Do not manufacture pages for every keyword variation.

## Content and GEO/AEO
Publish clear, useful, differentiated service pages, answer real visitor questions, identify the law firm and authorized lawyers, and provide accurate address, contact details and business hours. For legal explainers, use reviewed Nigerian legislation and cite official sources by name. Search engines and AI systems may quote or cite information that they can crawl, but no technique guarantees inclusion. Google's guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

## Ethics
Nigerian Rules of Professional Conduct for Legal Practitioners 2023, especially Rule 39: avoid inaccurate or misleading advertising, comparisons with lawyers, unverified success-rate/quality claims, pressure tactics, and content likely to bring the profession into disrepute. Counsel should review every legal claim and staff qualification before release. Source: https://www.judy.legal/legislation/akn/ng/act/si/2023/32

## Local visibility tasks
Claim and verify an official Google Business Profile for the real Effurun office; keep the business name, address, phone and hours consistent. Do not create a fictional Warri branch. Add genuine photos and business categories after verification. Verify and connect an approved official domain in Google Search Console, monitor indexing, queries and clicks, and respond to issues. The current AppDeploy and GitHub staging sites are intentionally not indexable.

## Advisor
`/admin/seo-advisor.html` offers a transparent rule-based content audit against the GitHub-managed JSON and static HTML. This is not an LLM API bot, live keyword tracking service, autonomous content publisher or substitute for lawyer review. GitHub CMS OAuth also remains pending. Run `python3 scripts/check_seo.py` as part of pull-request review.

## Editorial topics requiring lawyer approval
- How to prepare for a company registration consultation in Nigeria
- Questions to ask before purchasing property in Delta State
- What to bring to a family law consultation in Nigeria

Avoid publishing automatically generated legal guidance without fact-checking and a responsible attorney.
