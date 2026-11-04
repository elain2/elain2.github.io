// Surface → Deep main page.
// Reads the existing data/*.json so content stays in one place.
// Helpers and the depth engine live in shared.js.

function renderFeatured(projects) {
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  const html = FEATURED.map((id, i) => {
    const p = byId[id];
    if (!p) return '';
    const img = projectImage(p);
    const media = img
      ? `<img loading="lazy" src="${esc(img)}" alt="">`
      : `<div class="placeholder">${esc(p.category)}</div>`;
    const tags = (p.tags || []).slice(0, 5).map((t) => `<li>${esc(t)}</li>`).join('');
    return `
      <a class="project" href="${detailLink(p)}">
        <div class="project-media">${media}</div>
        <div class="project-body">
          <p class="project-index">${String(i + 1).padStart(2, '0')} · ${esc(p.category)}</p>
          <h3>${esc(field(p, 'title'))}</h3>
          <p class="project-meta">${esc(p.period)} · ${esc(p.role || '')}</p>
          <p class="project-desc">${esc(field(p, 'description'))}</p>
          <ul class="tags">${tags}</ul>
          <span class="more">${esc(ui('readMore'))}</span>
        </div>
      </a>`;
  }).join('');
  document.getElementById('featured').innerHTML = html;
}

function renderArchive(projects) {
  const rest = projects.filter((p) => !FEATURED.includes(p.id));
  document.getElementById('archive-list').innerHTML = rest.map((p) => `
    <li><a href="${detailLink(p)}">
      <span class="yr">${esc(p.period)}</span>
      <span class="ttl">${esc(field(p, 'title'))}</span>
      <span class="dsc">${esc(field(p, 'description'))}</span>
      <span class="cat">${esc(p.category)}</span>
    </a></li>`).join('');
}

function renderLog(timeline, achievements, t) {
  document.getElementById('timeline').innerHTML = timeline.map((e) => `
    <li class="${e.type === 'highlight' ? 'is-highlight' : ''}">
      <span class="yr">${esc(e.year)}</span>
      <span class="ev">${esc(t[e.eventKey] || e.eventKey)}</span>
    </li>`).join('');

  document.getElementById('media').innerHTML = achievements.map((a) => {
    const links = (a.links || [])
      .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(t[l.labelKey] || 'Link')} ↗</a>`)
      .join(' ');
    return `
      <li>
        <span class="yr">${esc(a.year)}</span>
        <h4>${esc(t[a.titleKey])}</h4>
        <p>${esc(t[a.descKey])}</p>
        ${links}
      </li>`;
  }).join('');
}

// Loaded once; the language toggle re-renders from this without fetching again.
let content = null;

function renderContent() {
  if (!content) return;
  const { projects, timeline, achievements, strings } = content;
  renderFeatured(projects);
  renderArchive(projects);
  renderLog(timeline, achievements, strings[lang]);
  measure();
}

async function loadContent() {
  try {
    const [projects, timeline, achievements, ko, en] = await Promise.all(
      ['projects', 'timeline', 'achievements', 'i18n/ko', 'i18n/en'].map(loadJSON)
    );
    content = { projects, timeline, achievements, strings: { ko, en } };
    renderContent();
  } catch (err) {
    document.getElementById('featured').innerHTML =
      `<p class="eyebrow">${esc(ui('loadFailed'))} (${esc(err.message)})</p>`;
  }
  scrollToHash();
  measure();
}

startLang(renderContent);
startWater();
loadContent();
