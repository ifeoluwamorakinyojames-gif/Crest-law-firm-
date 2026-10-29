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
assert all(h.startswith(('https://','mailto:','tel:')) or (h.startswith('#') and h[1:] in p.ids) for h in p.refs),'Broken or unsafe href'
assert all('alt' in im for im in p.images),'Missing image alt'
assert 'aria-expanded' in html and 'aria-expanded' in js,'Accessible mobile navigation missing'
assert 'noindex,nofollow' in html,'Preview must not be indexed'
assert '@media' in css and 'prefers-reduced-motion' in css,'Responsive styling is required'
assert not any(x in html.lower() for x in ['sanity.io','firebase','supabase']),'Unexpected CMS or backend'
assert json.loads(p.ldjson)['@type']=='LegalService','Firm structured data invalid'
print(f'PASS: landing page, {len(p.ids)} ids, {len(p.refs)} links, {len(p.images)} accessible images')
