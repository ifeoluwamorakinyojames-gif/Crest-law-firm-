from html.parser import HTMLParser
from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
html=(root/'index.html').read_text(encoding='utf8')
css=(root/'styles.css').read_text(encoding='utf8')
js=(root/'script.js').read_text(encoding='utf8')
class Parse(HTMLParser):
 def __init__(self):
  super().__init__();self.ids=set();self.refs=[];self.h1=0;self.images=[];self.json=False;self.ldjson=''
 def handle_starttag(self,tag,attrs):
  x=dict(attrs)
  if x.get('id'):
   assert x['id'] not in self.ids,'Duplicate HTML id: '+x['id'];self.ids.add(x['id'])
  if tag=='a':self.refs.append(x.get('href',''))
  if tag=='img':self.images.append(x)
  if tag=='h1':self.h1+=1
  if tag=='script' and x.get('type')=='application/ld+json':self.json=True
 def handle_data(self,data):
  if self.json:self.ldjson+=data
 def handle_endtag(self,tag):
  if tag=='script':self.json=False
p=Parse();p.feed(html)
assert p.h1==1,'Exactly one H1 is required'
def valid_link(h):
 return (h.startswith(('https://','mailto:','tel:')) or
         (h.startswith('#') and h[1:] in p.ids) or
         (h in ('./privacy.html','./terms.html') and (root/h[2:]).exists()))
assert all(valid_link(h) for h in p.refs),'Broken or unsafe href'
assert all('alt' in im for im in p.images),'Missing image alt'
assert 'aria-expanded' in html and 'aria-expanded' in js,'Accessible mobile navigation missing'
assert 'noindex,nofollow' in html,'Preview must not be indexed'
assert '@media' in css and 'prefers-reduced-motion' in css,'Responsive styling is required'
assert not any(x in html.lower() for x in ['sanity.io','firebase','supabase']),'Unexpected CMS or backend'
assert json.loads(p.ldjson)['@type']=='LegalService','Firm structured data invalid'
print(f'PASS: landing page, {len(p.ids)} ids, {len(p.refs)} links, {len(p.images)} accessible images')

for page in ['privacy.html','terms.html']:
    page_html=(root/page).read_text(encoding='utf8')
    assert 'noindex,nofollow' in page_html, 'Draft legal page must remain noindex'
    assert 'Counsel review' in page_html, 'Legal notice must be explicitly pending Counsel review'
    assert 'crestcrownattorneys@gmail.com' in page_html, 'Legal contact information required'
assert 'rel="icon"' in html, 'Site favicon missing'
assert 'property="og:title"' in html, 'Social metadata missing'
assert 'Enquire about this service' in (root/'content-loader.js').read_text(encoding='utf8'), 'Service link missing'
assert 'Ejeremedoghene Ejiroghene' in html, 'Third profile missing from no-JavaScript fallback'
print('PASS: new pages, metadata, legal review notes, service CTAs and lawyer fallback')

# The website's primary sections must remain discoverable at the top on small screens.
assert 'class="section-shortcuts"' in html, 'Top website-section bar missing'
for anchor in ('home','about','practice','team','insights','contact'):
    assert f'href="#{anchor}"' in html, f'Section link missing: {anchor}'
assert '.section-shortcuts-scroll' in css and 'overflow-x:auto' in css, 'Mobile quick navigation must scroll without overflow'
print('PASS: visible top website section navigation on tablet/mobile')
