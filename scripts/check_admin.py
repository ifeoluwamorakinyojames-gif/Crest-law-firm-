from html.parser import HTMLParser
from pathlib import Path
import json

root=Path(__file__).resolve().parents[1]

def read(file):
    return (root/file).read_text(encoding='utf8')

def data(file):
    return json.loads(read(file))

site=data('content/site.json')
services=data('content/practices.json')
team=data('content/team.json')
posts=data('content/articles.json')
html=read('index.html')
loader=read('content-loader.js')
admin=read('admin/config.yml')
workflow=read('.github/workflows/pages-preview.yml')

assert site['name']=='Crest Crown Attorneys'
assert site['contact']['email']=='crestcrownattorneys@gmail.com'
assert 'wa.me' in html and 'wa.me' in loader
assert len(services['services']) >= 5, 'Required legal practice areas missing'
assert len(team['people'])>=2, 'Both confirmed practitioners are required'
assert team['people'][0]['role']=='Founder & Principal Counsel'
assert team['people'][1]['role'].startswith('Legal Associate')
assert any(e['degree']=='B.L' for e in team['people'][1]['education'])
assert any(e['degree']=='LL.B' for e in team['people'][1]['education'])
assert not team['people'][0]['education'], 'Do not invent Eloho academic credentials'
assert all('title' in p and 'description' in p for p in services['services'])
assert all('name' in p and 'bio' in p for p in team['people'])
assert all(p.get('status') in ('draft','review','published') for p in posts['articles'])
assert 'content-loader.js' in html
assert "fetch('./content/'" in loader, 'Landing page must read GitHub-managed content'
assert 'scripts/check_admin.py' not in admin
assert 'name: github' in admin and 'branch: develop' in admin
assert 'publish_mode: editorial_workflow' in admin
assert 'repo: ifeoluwamorakinyojames-gif/Crest-law-firm-' in admin
assert 'OAuth' in read('admin/index.html')
assert 'cp -R content admin _site/' in workflow
assert "github.ref == 'refs/heads/develop'" in workflow
assert 'noindex,nofollow' in html and "noindex,nofollow" in loader
assert 'base_url: https://YOUR-' in admin, 'OAuth provider must be explicitly configured'
assert 'SECRET' not in loader and 'GITHUB_TOKEN' not in loader

class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids=set()
        self.anchors=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):
            assert a['id'] not in self.ids
            self.ids.add(a['id'])
        if tag=='a' and a.get('href','').startswith('#'):
            self.anchors.append(a['href'][1:])
p=Parser()
p.feed(html)
assert all(a in p.ids for a in p.anchors), 'Broken in-page navigation'
print('PASS: GitHub-backed admin fields, lawyer credentials, SEO, publication workflow and asset packaging')
