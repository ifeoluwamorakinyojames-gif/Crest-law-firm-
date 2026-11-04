from html.parser import HTMLParser
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
site = json.loads((root / 'content/site.json').read_text())
services = json.loads((root / 'content/practices.json').read_text())['services']
map_ = json.loads((root / 'seo/keyword-map.json').read_text())
html = (root / 'index.html').read_text()
assert site['seo']['noindex'] is True, 'Staging must remain noindex'
assert '<meta name="robots" content="noindex,nofollow">' in html
assert 'og:title' in html and 'og:description' in html
assert 'id="faq"' in html and 'id="blog"' in html
assert 'Crest Crown Attorneys' in site['seo']['title']
assert 'Effurun' in site['seo']['title']
assert len(map_['keywords']) >= 8
linked = [p for p in services if p.get('url')]
assert len(linked) >= 4
for item in linked:
    path = root / item['url'].removeprefix('./')
    assert path.is_file(), f"Missing SEO landing page: {path}"
    text = path.read_text()
    assert '<h1>' in text and '<meta name="description"' in text
    assert 'noindex,nofollow' in text, 'Do not index unapproved service content'
    assert 'application/ld+json' in text, 'Service markup missing'
assert (root / 'admin/seo-advisor.html').is_file()
assert (root / 'admin/seo-advisor.js').is_file()
print('PASS: SEO/GEO local service pages, internal links, metadata, advisor and staging safety')
