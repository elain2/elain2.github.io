// Shared by the main page (main.js) and project pages (project.js):
// data helpers, the depth/water-colour engine, and bubbles.

/* ---------- Data helpers ---------- */

// Projects shown as large rows on the main page, in this order.
// Everything else goes to the archive list.
const FEATURED = [
  'clipreef',
  'shortform-poc',
  'line-ai-dev2',
  'line-vision-pro',
  'line-voom-camera',
  'line-avatar',
  'line-yuki-framework',
];

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));


const isLocal = (url) => typeof url === 'string' && url.startsWith('images/');

// Only use images that live in this repo; remote stock photos are skipped.
function projectImage(p) {
  if (isLocal(p.thumbnail)) return p.thumbnail;
  const local = (p.images || []).find((img) => isLocal(img.url));
  return local ? local.url : null;
}

function detailLink(p) {
  return `project.html?id=${encodeURIComponent(p.id)}`;
}

// Featured projects first, then the archive, same as the main page.
function orderProjects(projects) {
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  const featured = FEATURED.map((id) => byId[id]).filter(Boolean);
  const rest = projects.filter((p) => !FEATURED.includes(p.id));
  return [...featured, ...rest];
}

async function loadJSON(name) {
  const r = await fetch(`data/${name}.json`, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${name}.json: ${r.status}`);
  return r.json();
}

/* ---------- Depth + water colour ---------- */

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const luminance = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

// Water colour by depth in metres. Same stops the main page uses.
const WATER = [
  [0, '#f4f6f7'], [2, '#dbe9ee'], [5, '#a9cfdc'], [12, '#1f5f7d'],
  [20, '#0f3550'], [24, '#0b2a40'], [32, '#06192a'], [40, '#000000'],
];

function waterColor(depth) {
  let i = 0;
  while (i < WATER.length - 2 && WATER[i + 1][0] <= depth) i++;
  const [d0, c0] = WATER[i];
  const [d1, c1] = WATER[i + 1];
  const t = Math.min(Math.max((depth - d0) / (d1 - d0), 0), 1);
  return `#${mix(hex(c0), hex(c1), t).map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const MAX_DEPTH = 40;
let stops = [];
// Share of each section that keeps its own colour before blending into the next.
let hold = 0;

function measure() {
  stops = [...document.querySelectorAll('main > section')].map((el) => ({
    top: el.offsetTop,
    depth: Number(el.dataset.depth),
    color: hex(el.dataset.bg),
  }));
  update();
}

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
  const h = Math.min(Math.max((raw - hold) / (1 - hold), 0), 1);
  const t = h * h * (3 - 2 * h);

  const depth = a.depth + (b.depth - a.depth) * raw;
  const color = mix(a.color, b.color, t);

  document.body.style.setProperty('--bg', `rgb(${color.join(',')})`);
  document.body.classList.toggle('is-dark', luminance(color) < 0.42);
  document.body.classList.toggle('is-under', depth > 4);

  document.getElementById('depth').textContent = depth < 0.5 ? '0' : `-${Math.round(depth)}`;
  document.getElementById('gauge-dot').style.top = `${(depth / MAX_DEPTH) * 100}%`;
}

function makeBubbles(n = 16) {
  const layer = document.querySelector('.bubbles');
  if (!layer) return;
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

// Call once per page, after the static markup is in place.
function startWater(options = {}) {
  hold = options.hold || 0;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  // Images, videos and diagrams that load late change section offsets.
  if ('ResizeObserver' in window) {
    let pending = false;
    new ResizeObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { measure(); pending = false; });
    }).observe(document.querySelector('main'));
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('.ascend')) window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  makeBubbles();
  measure();
}

// Content loaded after the first paint can move a #hash target, so jump again.
function scrollToHash() {
  if (!location.hash) return;
  const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
}
