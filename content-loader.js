/* GitHub-backed content renderer for the Crest Crown single-page website.
   Admin edits JSON in the repo; approved changes are deployed by GitHub Actions.
   No secrets, browser-side GitHub tokens or visitor data storage. */
'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function element(name, value, className = '') {
  const node = document.createElement(name);
  if (className) node.className = className;
  if (value !== undefined && value !== null) node.textContent = String(value);
  return node;
}
function setText(selector, value, root = document) {
  const node = $(selector, root);
  if (node) node.textContent = String(value || '');
}
function safeImage(value) {
  const url = String(value || '').trim();
  if (url.startsWith('https://')) return url;
  // Decap's GitHub Pages project URL includes /Crest-law-firm-/.
  const localMedia = url.replace(/^\/Crest-law-firm\//, '/').replace(/^\//, '');
  if (/^media\/uploads\/[a-zA-Z0-9/_\-.]+$/.test(localMedia) && !localMedia.includes('..')) {
    return './' + localMedia;
  }
  return '';
}
function digits(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}
function addLineBreakHeading(node, source, highlightLine = 2) {
  if (!node) return;
  const lines = String(source || '').split('\n').filter(Boolean);
  node.replaceChildren();
  lines.forEach((line, index) => {
    if (index) node.appendChild(document.createElement('br'));
    node.appendChild(element(index + 1 === highlightLine ? 'em' : 'span', line));
  });
}
function renderHome(site) {
  setText('.hero .overline', site.hero.eyebrow);
  addLineBreakHeading($('.hero h1'), site.hero.headline, Number(site.hero.highlightLine));
  setText('.hero-lead', site.hero.description);
  const links = all('.hero .buttons a');
  if (links[0]) links[0].replaceChildren(document.createTextNode(site.hero.primaryButton + ' ↗'));
  if (links[1]) links[1].replaceChildren(document.createTextNode(site.hero.secondaryButton + ' →'));
}
function renderAbout(site) {
  setText('.about-text .overline', site.about.eyebrow);
  setText('.about-text h2', site.about.heading);
  const container = $('.about-text');
  if (!container) return;
  all('p:not(.overline)', container).forEach(node => node.remove());
  const before = $('.checks', container);
  (site.about.body || []).forEach(paragraph => container.insertBefore(element('p', paragraph), before));
  if (before) before.replaceChildren(...(site.about.values || []).map(value => element('span', '✓ ' + value)));
}
function renderPractices(data) {
  setText('.practice .section-title h2', data.heading);
  setText('.practice .section-title p:last-child', data.intro);
  const grid = $('.practice-grid');
  if (!grid) return;
  grid.replaceChildren();
  (data.services || []).forEach((service, index) => {
    const card = element('article', null, 'practice-card');
    card.appendChild(element('span', String(index + 1).padStart(2, '0'), 'num'));
    card.appendChild(element('h3', service.title));
    card.appendChild(element('p', service.description));
    grid.appendChild(card);
  });
  setText('.service-footnote', data.note);
}
function addQualificationList(section, heading, entries, format) {
  section.appendChild(element('h4', heading));
  if (!entries || !entries.length) {
    section.appendChild(element('p', 'Details awaiting confirmation for publication.'));
    return;
  }
  if (format === 'degrees') {
    const dl = element('dl');
    entries.forEach(item => {
      const row = element('div');
      row.appendChild(element('dt', item.degree));
      row.appendChild(element('dd', item.institution));
      dl.appendChild(row);
    });
    section.appendChild(dl);
  } else {
    section.appendChild(element('p', entries.join('; ')));
  }
}
function renderTeam(data) {
  setText('.team .section-title h2', data.heading);
  setText('.team .section-title p:last-child', data.intro);
  const grid = $('.team-grid');
  if (!grid) return;
  grid.replaceChildren();
  (data.people || []).forEach(person => {
    const card = element('article', null, 'team-card');
    const photoBox = element('div', null, 'portrait');
    const source = safeImage(person.photo);
    if (source) {
      const img = element('img');
      img.src = source; img.alt = 'Professional portrait of ' + person.name;
      img.loading = 'lazy'; photoBox.appendChild(img);
    }
    card.appendChild(photoBox);
    const body = element('div', null, 'team-body');
    body.appendChild(element('p', person.role, 'overline'));
    body.appendChild(element('h3', person.name));
    body.appendChild(element('p', person.bio));
    const tags = element('div', null, 'tags');
    (person.specialisations || []).slice(0, 4).forEach(s => tags.appendChild(element('span', s)));
    body.appendChild(tags);
    const details = element('details');
    const summary = element('summary', 'Qualifications & Professional Profile +');
    details.appendChild(summary);
    const inner = element('div', null, 'details-inner');
    addQualificationList(inner, 'Academic Qualifications', person.education, 'degrees');
    addQualificationList(inner, 'Professional Memberships', person.memberships);
    if (person.accreditations && person.accreditations.length) {
      addQualificationList(inner, 'Accreditations', person.accreditations);
    }
    addQualificationList(inner, 'Areas of Specialisation', person.specialisations);
    if (person.professionalBackground) {
      inner.appendChild(element('h4', 'Professional Background'));
      inner.appendChild(element('p', person.professionalBackground));
    }
    if (person.initiatives) {
      inner.appendChild(element('h4', 'Legal Education and Community Initiatives'));
      inner.appendChild(element('p', person.initiatives));
    }
    details.appendChild(inner); body.appendChild(details);
    card.appendChild(body); grid.appendChild(card);
  });
}
function renderInsights(site, data) {
  setText('.insight .overline', site.insights.eyebrow);
  setText('.insight h2', site.insights.heading);
  setText('.insight .insight-grid > div:first-child p:not(.overline):not(.disclaimer)', site.insights.body);
  setText('.insight .disclaimer', site.insights.disclaimer);
  setText('.insight-box p', site.insights.quote);
  const parent = $('#insights .shell');
  if (!parent) return;
  const old = $('.landing-articles-grid', parent);
  if (old) old.remove();
  const approved = (data.articles || []).filter(a => a.status === 'published').slice(0, 3);
  if (!approved.length) return;
  const grid = element('div', null, 'landing-articles-grid');
  approved.forEach(article => {
    const box = element('article', null, 'landing-article');
    box.appendChild(element('small', article.date || ''));
    box.appendChild(element('h3', article.title));
    box.appendChild(element('p', article.summary));
    box.appendChild(element('span', 'By ' + (article.author || 'Crest Crown Attorneys')));
    grid.appendChild(box);
  });
  parent.appendChild(grid);
}
function renderContact(site) {
  const c = site.contact, phone = digits(c.phone), wa = digits(c.whatsapp);
  if (phone.length < 7 || wa.length < 7 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) return;
  const blocks = $('.contact-details');
  if (blocks) {
    blocks.replaceChildren();
    [
      ['PHONE & WHATSAPP', c.phone, 'tel:+' + phone],
      ['OFFICIAL EMAIL', c.email, 'mailto:' + c.email],
      ['OFFICE ADDRESS', c.address, null],
      ['WORKING HOURS', c.hoursWeekdays + ' | ' + c.hoursSaturday, null]
    ].forEach(([label, value, href]) => {
      const box = element('div');
      box.appendChild(element('small', label));
      const item = element(href ? 'a' : 'strong', value);
      if (href) item.href = href;
      box.appendChild(item); blocks.appendChild(box);
    });
  }
  const panel = $('.contact-panel');
  if (panel) {
    const links = all('a', panel);
    const msg = encodeURIComponent('Good day, Crest Crown Attorneys. I would like to request a consultation.');
    if (links[0]) links[0].href = 'https://wa.me/' + wa + '?text=' + msg;
    if (links[1]) links[1].href = 'mailto:' + c.email + '?subject=Consultation%20Enquiry';
    if (links[2]) links[2].href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.address);
  }
  const topline = $('.topline a');
  if (topline) { topline.href = 'tel:+' + phone; topline.textContent = c.phone + ' ↗'; }
  const floating = $('.wa-floating');
  if (floating) floating.href = 'https://wa.me/' + wa;
  const footerContact = $('.footer-grid > div:last-child');
  if (footerContact) {
    all('a', footerContact).forEach((a, i) => {
      a.textContent = i === 0 ? c.phone : c.email;
      a.href = i === 0 ? 'tel:+' + phone : 'mailto:' + c.email;
    });
    setText('p', c.address, footerContact);
  }
}
function renderSEO(site, team) {
  document.title = site.seo.title || site.name;
  const description = $('meta[name="description"]');
  if (description) description.content = site.seo.description;
  // GitHub Pages staging remains intentionally noindex regardless of editor input.
  const robots = $('meta[name="robots"]');
  if (robots) robots.content = 'noindex,nofollow';
  const schema = $('script[type="application/ld+json"]');
  if (schema) {
    const structured = { '@context': 'https://schema.org', '@type': 'LegalService',
      name: site.name, telephone: '+' + digits(site.contact.whatsapp),
      email: site.contact.email,
      address: { '@type': 'PostalAddress', streetAddress: site.contact.address,
        addressLocality: 'Effurun', addressRegion: 'Delta State', addressCountry: 'NG' },
      employee: (team.people || []).map(p => ({
        '@type': 'Person', name: p.name, jobTitle: p.role,
        knowsAbout: p.specialisations || []
      })) };
    schema.textContent = JSON.stringify(structured);
  }
}
async function hydrate() {
  const names = ['site', 'practices', 'team', 'articles'];
  const response = await Promise.all(names.map(name => fetch('./content/' + name + '.json', { cache: 'no-cache' })));
  if (response.some(r => !r.ok)) throw new Error('Website content files are not yet available');
  const [site, practices, team, articles] = await Promise.all(response.map(r => r.json()));
  renderHome(site); renderAbout(site); renderPractices(practices); renderTeam(team);
  renderInsights(site, articles); renderContact(site); renderSEO(site, team);
  const logo = safeImage(site.logo);
  if (logo) {
    all('.brand-logo img, .about-logo img').forEach(img => { img.src = logo; });
  }
  setText('.brand-words strong', site.name.toUpperCase().replace(' ATTORNEYS', ''));
  setText('.footer-grid > div:first-child strong', site.name);
  setText('.footer-grid > div:first-child p', site.tagline);
}
hydrate().catch(err => console.warn('Using verified fallback website content:', err.message));
