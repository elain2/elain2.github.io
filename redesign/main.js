// Surface → Deep prototype.
// Reads the existing data/*.json so content stays in one place.

const FEATURED = [
  'shortform-poc',
  'line-ai-dev2',
  'line-vision-pro',
  'line-voom-camera',
  'line-avatar',
  'line-yuki-framework',
];

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ko = (p, key) => p[`${key}_ko`] || p[key];

// Only use images that live in this repo; remote stock photos are skipped.
function projectImage(p) {
  if (p.thumbnail && p.thumbnail.startsWith('images/')) return p.thumbnail;
  const local = (p.images || []).find((img) => img.url.startsWith('images/'));
  return local ? local.url : null;
}

function detailLink(p) {
  return `classic.html#/projects/${p.id}`;
}

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
          <h3>${esc(ko(p, 'title'))}</h3>
          <p class="project-meta">${esc(p.period)} · ${esc(p.role || '')}</p>
          <p class="project-desc">${esc(ko(p, 'description'))}</p>
          <ul class="tags">${tags}</ul>
          <span class="more">자세히 보기 →</span>
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
      <span class="ttl">${esc(ko(p, 'title'))}</span>
      <span class="dsc">${esc(ko(p, 'description'))}</span>
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

async function loadContent() {
  try {
    const [projects, timeline, achievements, t] = await Promise.all(
      ['projects', 'timeline', 'achievements', 'i18n/ko'].map((f) =>
        fetch(`data/${f}.json`, { cache: 'no-cache' }).then((r) => {
          if (!r.ok) throw new Error(`${f}.json: ${r.status}`);
          return r.json();
        })
      )
    );
    renderFeatured(projects);
    renderArchive(projects);
    renderLog(timeline, achievements, t);
  } catch (err) {
    document.getElementById('featured').innerHTML =
      `<p class="eyebrow">프로젝트를 불러오지 못했습니다 (${esc(err.message)})</p>`;
  }
  measure();
}

/* ---------- Depth + water colour ---------- */

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

let stops = [];

function measure() {
  stops = [...document.querySelectorAll('main > section')].map((el) => ({
    top: el.offsetTop,
    depth: Number(el.dataset.depth),
    color: hex(el.dataset.bg),
  }));
  update();
}

const depthEl = document.getElementById('depth');
const dotEl = document.getElementById('gauge-dot');
const maxDepth = 40;

function update() {
  if (!stops.length) return;
  const y = window.scrollY + window.innerHeight * 0.5;

  let i = stops.length - 1;
  while (i > 0 && stops[i].top > y) i--;
  const a = stops[i];
  const b = stops[i + 1] || a;
  const span = b.top - a.top || 1;
  // ease the colour change into the last part of each section
  const raw = Math.min(Math.max((y - a.top) / span, 0), 1);
  const t = raw * raw * (3 - 2 * raw);

  const depth = a.depth + (b.depth - a.depth) * raw;
  const color = mix(a.color, b.color, t);

  document.body.style.setProperty('--bg', `rgb(${color.join(',')})`);
  document.body.classList.toggle('is-dark', luminance(color) < 0.42);
  document.body.classList.toggle('is-under', depth > 4);

  depthEl.textContent = depth < 0.5 ? '0' : `-${Math.round(depth)}`;
  dotEl.style.top = `${(depth / maxDepth) * 100}%`;
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { update(); ticking = false; });
}, { passive: true });
window.addEventListener('resize', measure);
window.addEventListener('load', measure);

/* ---------- Bubbles ---------- */

function makeBubbles(n = 16) {
  const layer = document.querySelector('.bubbles');
  for (let k = 0; k < n; k++) {
    const b = document.createElement('span');
    const size = 3 + Math.random() * 9;
    b.className = 'bubble';
    b.style.width = b.style.height = `${size}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${10 + Math.random() * 14}s`;
    b.style.animationDelay = `${-Math.random() * 20}s`;
    layer.appendChild(b);
  }
}

document.getElementById('ascend').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

makeBubbles();
loadContent();
