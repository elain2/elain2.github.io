// Project detail page: project.html?id=<project id>
// One project, laid out as a dive: overview at the surface, role at -5m,
// media at -12m, technical notes at -24m, and the next project at the bottom.

// projects/*.md files, matched to a project by id.
// A new project needs an entry here (and in getProjectFiles() in js/app.js).
const PROJECT_FILES = [
  '01-shortform-poc.md',
  '02-line-ai-dev2.md',
  '03-line-vision-pro.md',
  '04-line-voom-camera.md',
  '05-line-avatar.md',
  '06-hand-gesture-ar.md',
  '07-unity-2-5d-game.md',
  '08-roller-coaster-simulation.md',
  '09-theme-park-iot.md',
  '10-cats-in-your-street.md',
  '11-line-yuki-framework.md',
];

const MERMAID_URL = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.esm.min.mjs';

const section = (cls, depth, inner) =>
  `<section id="${cls.split(' ')[0]}" class="${cls}" data-bg="${waterColor(depth)}" data-depth="${depth}">${inner}</section>`;

/* ---------- Markdown ---------- */

async function loadMarkdown(id) {
  const file = PROJECT_FILES.find((f) => f.replace(/^\d+-|\.md$/g, '') === id);
  if (!file) return '';
  try {
    const r = await fetch(`projects/${file}`, { cache: 'no-cache' });
    return r.ok ? r.text() : '';
  } catch {
    return '';
  }
}

// Keeps the Korean parts of the markdown body and drops the sections that
// repeat projects.json (Responsibilities / About). Returns '' when nothing is left.
function technicalMarkdown(text) {
  let md = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  md = md
    .replace(/<!-- lang:en -->[\s\S]*?<!-- \/lang:en -->/g, '')
    .replace(/<!-- \/?lang:ko -->/g, '');

  const diagrams = [];
  md = md.replace(/```mermaid(-en|-ko)?\n([\s\S]*?)```/g, (_, lang, code) => {
    if (lang === '-en') return '';
    diagrams.push(code.trim());
    return `\n<div class="diagram" data-i="${diagrams.length - 1}"></div>\n`;
  });

  const kept = md
    .split(/^(?=## )/m)
    .filter((part) => !/^## (Responsibilities|About)( \(한국어\))?\s*$/m.test(part.split('\n')[0]))
    .join('')
    .replace(/^---\s*$/gm, '')
    .trim();

  return kept ? { md: kept, diagrams } : { md: '', diagrams: [] };
}

async function drawDiagrams(root, diagrams) {
  const slots = root.querySelectorAll('.diagram');
  if (!slots.length) return;
  slots.forEach((slot) => {
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = diagrams[Number(slot.dataset.i)] || '';
    slot.appendChild(pre);
  });
  try {
    const { default: mermaid } = await import(MERMAID_URL);
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: 'transparent',
        fontFamily: 'Pretendard Variable, Pretendard, sans-serif',
        primaryColor: '#123f59',
        primaryTextColor: '#e8f1f5',
        primaryBorderColor: '#7fd0ec',
        secondaryColor: '#0f3550',
        tertiaryColor: '#0b2a40',
        lineColor: '#7fd0ec',
        textColor: '#e8f1f5',
        clusterBkg: 'rgba(127, 208, 236, 0.06)',
        clusterBorder: 'rgba(127, 208, 236, 0.4)',
        edgeLabelBackground: '#0b2a40',
      },
    });
    await mermaid.run({ nodes: root.querySelectorAll('pre.mermaid') });
  } catch (err) {
    // Leave the diagram source visible as plain text if mermaid fails.
    root.querySelectorAll('.diagram').forEach((slot) => slot.classList.add('is-raw'));
  }
  measure();
}

/* ---------- Sections ---------- */

function heroSection(p, index, total) {
  const img = projectImage(p);
  const media = img
    ? `<img src="${esc(img)}" alt="">`
    : `<div class="placeholder">${esc(p.category)}</div>`;
  const english = p.title_ko && p.title_ko !== p.title ? `<p class="serif-sub">${esc(p.title)}</p>` : '';

  const facts = [
    ['기간', esc(p.period)],
    ['역할', esc(p.role)],
    p.contribution ? ['기여도', `${esc(p.contribution)}%`] : null,
    p.publication || p.event
      ? ['발표', p.publicationUrl
        ? `<a href="${esc(p.publicationUrl)}" target="_blank" rel="noopener">${esc(p.publication || p.event)} ↗</a>`
        : esc(p.publication || p.event)]
      : null,
  ].filter((f) => f && f[1]);

  const tags = (p.tags || []).map((t) => `<li>${esc(t)}</li>`).join('');

  return section('p-hero', 0, `
    <div class="p-hero-text">
      <p class="eyebrow">Project ${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} · ${esc(p.category)}</p>
      <h1>${esc(ko(p, 'title'))}</h1>
      ${english}
      <p class="lede">${esc(ko(p, 'description'))}</p>
      <dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <ul class="tags">${tags}</ul>
    </div>
    <figure class="project-media p-hero-media">${media}</figure>`);
}

// Keeps the hero at surface colour; the water starts below this line.
const waterlineSection = () =>
  section('p-waterline', 0, '<a href="#p-role" class="dive-hint">아래로 잠수하기 <span>↓</span></a>');

function roleSection(p) {
  const about = ko(p, 'detailedDescription');
  const resp = ko(p, 'responsibilities') || [];
  if (!about && !resp.length) return '';
  return section('p-role', 5, `
    <div class="p-about">
      <p class="eyebrow">-5m · 프로젝트 소개</p>
      ${about ? `<p>${esc(about)}</p>` : ''}
    </div>
    ${resp.length ? `
    <div class="p-resp">
      <p class="eyebrow">맡은 일</p>
      <ol class="resp">${resp.map((r) => `<li>${esc(r)}</li>`).join('')}</ol>
    </div>` : ''}`);
}

function youTubeId(url) {
  const m = String(url).match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function mediaSection(p, heroImage) {
  const items = [];
  (p.demoVideos || []).forEach((v) => items.push(`
    <figure class="clip"><video src="${esc(v.url)}" controls playsinline preload="metadata"></video>
      ${v.caption ? `<figcaption>${esc(ko(v, 'caption'))}</figcaption>` : ''}</figure>`));
  if (p.localVideo) {
    const poster = p.localVideoPoster ? ` poster="${esc(p.localVideoPoster)}"` : '';
    items.push(`<figure class="clip"><video src="${esc(p.localVideo)}"${poster} controls playsinline preload="metadata"></video></figure>`);
  }
  const yt = p.demoVideo && youTubeId(p.demoVideo);
  if (yt) {
    items.push(`
      <figure class="wide"><iframe class="yt" src="https://www.youtube-nocookie.com/embed/${yt}"
        title="${esc(p.title)} 데모 영상" loading="lazy" allowfullscreen
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
      <figcaption>YouTube 데모 영상</figcaption></figure>`);
  }
  (p.images || [])
    .filter((img) => isLocal(img.url) && img.url !== heroImage)
    .forEach((img) => items.push(`
      <figure><img loading="lazy" src="${esc(img.url)}" alt="${esc(ko(img, 'caption') || '')}">
        ${img.caption ? `<figcaption>${esc(ko(img, 'caption'))}</figcaption>` : ''}</figure>`));

  if (!items.length) return '';
  const single = items.length === 1 ? ' is-single' : '';
  return section('p-media', 12, `
    <div class="section-head"><p class="eyebrow">-12m · 영상과 이미지</p></div>
    <div class="gallery${single}">${items.join('')}</div>`);
}

function detailsSection(html) {
  if (!html) return '';
  return section('p-details', 24, `
    <div class="section-head">
      <p class="eyebrow">-24m · 기술 상세</p>
      <h2>조금 더 깊이</h2>
    </div>
    <article class="md">${html}</article>`);
}

function endSection(ordered, index) {
  const prev = ordered[(index - 1 + ordered.length) % ordered.length];
  const next = ordered[(index + 1) % ordered.length];
  const link = (p, dir, cls) => `
    <a class="${cls}" href="${detailLink(p)}">
      <span class="dir">${dir}</span>
      <span class="ttl">${esc(ko(p, 'title'))}</span>
      <span class="dsc">${esc(ko(p, 'description'))}</span>
    </a>`;
  return section('p-end', 40, `
    <p class="eyebrow">-40m · 바닥에 닿았습니다</p>
    <nav class="pager" aria-label="다른 프로젝트">
      ${link(prev, '← 이전 프로젝트', 'prev')}
      ${link(next, '다음 프로젝트 →', 'next')}
    </nav>
    <div class="end-links">
      <a href="${esc(document.getElementById('back-link').getAttribute('href'))}">전체 프로젝트 보기</a>
      <button class="ascend" type="button">↑ 수면으로 올라가기</button>
    </div>`);
}

/* ---------- Page ---------- */

// Videos that are not in the repo (large demo files are kept out of git) are removed.
function dropMissingVideos(root) {
  root.querySelectorAll('.gallery video').forEach((video) => {
    const drop = () => {
      const gallery = video.closest('.gallery');
      video.closest('figure').remove();
      if (gallery && !gallery.children.length) gallery.closest('section').remove();
      else if (gallery) gallery.classList.toggle('is-single', gallery.children.length === 1);
      measure();
    };
    if (video.error) drop();
    else video.addEventListener('error', drop, { once: true });
  });
}

function renderNotFound(id) {
  document.getElementById('project').innerHTML = section('p-hero p-missing', 0, `
    <div class="p-hero-text">
      <p class="eyebrow">404 · 물 밖</p>
      <h1>이 프로젝트를 찾지 못했습니다.</h1>
      <p class="lede">${id ? `“${esc(id)}”라는 프로젝트는 없습니다.` : '프로젝트가 지정되지 않았습니다.'}</p>
      <p class="links"><a href="index.html#work">전체 프로젝트 보기</a></p>
    </div>`);
  measure();
}

async function render() {
  const id = new URLSearchParams(location.search).get('id');
  let projects;
  try {
    projects = await loadJSON('projects');
  } catch (err) {
    document.querySelector('#project .eyebrow').textContent = `프로젝트를 불러오지 못했습니다 (${err.message})`;
    return;
  }

  const ordered = orderProjects(projects);
  const index = ordered.findIndex((p) => p.id === id);
  if (index < 0) return renderNotFound(id);
  const p = ordered[index];

  document.title = `${ko(p, 'title')} — Kayoung Lee`;
  document.getElementById('back-link').href = FEATURED.includes(p.id) ? 'index.html#work' : 'index.html#archive';

  const { md, diagrams } = technicalMarkdown(await loadMarkdown(p.id));
  const mdHtml = md && typeof marked !== 'undefined' ? marked.parse(md) : '';

  const main = document.getElementById('project');
  main.innerHTML = [
    heroSection(p, index, ordered.length),
    waterlineSection(),
    roleSection(p),
    mediaSection(p, projectImage(p)),
    detailsSection(mdHtml),
    endSection(ordered, index),
  ].join('');

  dropMissingVideos(main);
  measure();
  drawDiagrams(main, diagrams);
}

startWater({ hold: 0.6 });
render();
