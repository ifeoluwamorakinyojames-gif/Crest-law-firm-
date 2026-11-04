'use strict';
const status = document.getElementById('status');
const checks = document.getElementById('checks');
const keywords = document.getElementById('keywords');
const el = (tag, value, className) => {
  const node = document.createElement(tag);
  if (value !== undefined) node.textContent = String(value);
  if (className) node.className = className;
  return node;
};
function showCheck(label, passed, detail) {
  const item = el('div', undefined, 'item');
  item.appendChild(el('div', (passed ? '✓ ' : '● ') + label, 'label ' + (passed ? 'good' : 'warn')));
  item.appendChild(el('div', detail, 'note'));
  checks.appendChild(item);
  return passed ? 1 : 0;
}
async function audit() {
  status.textContent = 'Checking the current website files…';
  checks.replaceChildren();
  keywords.replaceChildren();
  try {
    const paths = ['../content/site.json', '../content/practices.json', '../content/articles.json', '../seo/keyword-map.json', '../index.html'];
    const responses = await Promise.all(paths.map(path => fetch(path, {cache:'no-store'})));
    if (responses.some(r => !r.ok)) throw new Error('A website source file could not be loaded.');
    const [site, practices, articles, map, html] = await Promise.all(responses.map((r, i) => i === 4 ? r.text() : r.json()));
    const count = { total: 0, passed: 0 };
    const check = (label, passed, detail) => { count.total += 1; count.passed += showCheck(label, passed, detail); };
    check('Location and contact details', Boolean(site.contact.address && site.contact.phone && site.contact.email), 'Office address, phone and email should be accurate and consistent across all channels.');
    check('Primary keyword and supporting phrases', Boolean(site.seo.primaryKeyword && site.seo.secondaryKeywords?.length >= 3), 'Choose one focus phrase per page. Avoid repetition that makes copy unnatural.');
    check('Homepage title and description', site.seo.title.length >= 35 && site.seo.title.length <= 70 && site.seo.description.length >= 70 && site.seo.description.length <= 180, 'Use a distinct, clear title and helpful description. Search engines may rewrite these.');
    check('Service information and internal links', practices.services.filter(s => s.url?.startsWith('./areas/')).length >= 4 && html.includes('seo-area-links'), 'Dedicated practice pages and descriptive links help visitors find the appropriate service.');
    check('Visible questions and structured information', html.includes('id="faq"') && html.includes('application/ld+json'), 'Answer common questions visibly and keep structured data consistent with the page.');
    check('Counsel-reviewed legal articles', articles.articles.filter(a => a.status === 'published').length > 0, 'No articles are published yet. Publish only reviewed, original legal education with a responsible author.');
    check('Staging remains out of search', site.seo.noindex === true && html.includes('noindex,nofollow'), 'Keep this protection for review; turn on indexing only after counsel approval and a verified canonical domain.');
    for (const item of map.keywords) {
      const row = el('div', undefined, 'keyword');
      row.appendChild(el('div', item.keyword, 'label'));
      row.appendChild(el('div', item.page + ' · ' + item.intent, 'note'));
      keywords.appendChild(row);
    }
    status.textContent = count.passed + ' of ' + count.total + ' editorial checks passed. This is not a Google ranking score.';
  } catch (error) {
    status.textContent = 'Unable to complete the audit: ' + (error.message || 'Unknown error');
  }
}
document.getElementById('run').addEventListener('click', audit);
audit();

