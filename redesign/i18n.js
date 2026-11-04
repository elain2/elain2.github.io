// KO / EN for the redesign (index.html + project.html).
// Korean copy lives in the HTML. English copy for the static markup is in PAGE_EN,
// matched by data-i18n (innerHTML), data-i18n-alt and data-i18n-label (aria-label).
// Strings built in JS (main.js, project.js) come from UI via ui(key).
//
// Language order: ?lang= in the URL, then the saved choice (shared with classic.html),
// then the browser language (Korean browsers get Korean, everyone else English).

const LANGS = ['ko', 'en'];
const LANG_KEY = 'lang';

function readSavedLang() {
  try { return localStorage.getItem(LANG_KEY); } catch { return null; }
}

function saveLang(value) {
  try { localStorage.setItem(LANG_KEY, value); } catch { /* private mode: keep it for this page only */ }
}

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(fromUrl)) {
    saveLang(fromUrl);
    return fromUrl;
  }
  const saved = readSavedLang();
  if (LANGS.includes(saved)) return saved;
  return (navigator.language || '').toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

let lang = detectLang();
document.documentElement.lang = lang;

const UI = {
  ko: {
    readMore: '자세히 보기 →',
    loadFailed: '프로젝트를 불러오지 못했습니다',
    loading: '불러오는 중…',
    allProjects: '← 전체 프로젝트',
    period: '기간',
    role: '역할',
    contribution: '기여도',
    published: '발표',
    diveHint: '아래로 잠수하기',
    aboutProject: '-5m · 프로젝트 소개',
    whatIDid: '맡은 일',
    media: '-12m · 영상과 이미지',
    demoVideo: '데모 영상',
    youTubeDemo: 'YouTube 데모 영상',
    details: '-24m · 기술 상세',
    deeper: '조금 더 깊이',
    bottom: '-40m · 바닥에 닿았습니다',
    otherProjects: '다른 프로젝트',
    prev: '← 이전 프로젝트',
    next: '다음 프로젝트 →',
    viewAll: '전체 프로젝트 보기',
    ascend: '↑ 수면으로 올라가기',
    notFoundEyebrow: '404 · 물 밖',
    notFoundTitle: '이 프로젝트를 찾지 못했습니다.',
    notFoundId: (id) => `“${id}”라는 프로젝트는 없습니다.`,
    noId: '프로젝트가 지정되지 않았습니다.',
    toggleLabel: 'View in English',
  },
  en: {
    readMore: 'Read more →',
    loadFailed: 'Could not load the projects',
    loading: 'Loading…',
    allProjects: '← All projects',
    period: 'Period',
    role: 'Role',
    contribution: 'Contribution',
    published: 'Published',
    diveHint: 'Dive in',
    aboutProject: '-5m · About the project',
    whatIDid: 'What I did',
    media: '-12m · Video and images',
    demoVideo: 'demo video',
    youTubeDemo: 'Demo video on YouTube',
    details: '-24m · Technical notes',
    deeper: 'A little deeper',
    bottom: '-40m · You reached the bottom',
    otherProjects: 'Other projects',
    prev: '← Previous project',
    next: 'Next project →',
    viewAll: 'See all projects',
    ascend: '↑ Back to the surface',
    notFoundEyebrow: '404 · Out of the water',
    notFoundTitle: 'Could not find this project.',
    notFoundId: (id) => `There is no project called “${id}”.`,
    noId: 'No project was given.',
    toggleLabel: '한국어로 보기',
  },
};

const ui = (key, ...args) => {
  const value = UI[lang][key] ?? UI.ko[key];
  return typeof value === 'function' ? value(...args) : value;
};

// English for the static markup in index.html and project.html.
const PAGE_EN = {
  'surface.title': 'I carry a camera,<br>so I build them.',
  'surface.sub': 'Everywhere I go, and at work.',
  'surface.lede': 'iOS engineer at LINE. I built camera and avatar features used by more than 10 million people. Now I\'m an <strong>AI Evangelist</strong>, in charge of AX for the LINE Domain Product Development 4 organization.',
  'surface.dive': 'Dive in <span>↓</span>',
  'surface.alt': 'Self-portrait holding a camera in front of a mirror',
  'surface.caption': '<span>FR 06</span> Okinawa, in front of a mirror',

  'shore.eyebrow': 'Above the surface',
  'shore.note': 'Photos I took and edited myself. I like the angles other people skip.',
  'shore.label': 'Photo strip, scrolls sideways',
  'shore.taxis.alt': 'Yellow taxis in Okinawa',
  'shore.taxis': '<span>FR 03</span> Naha, waiting at the light',
  'shore.window.alt': 'A restaurant with the sea through the window',
  'shore.window': '<span>FR 07</span> Window seat',
  'shore.cat.alt': 'A white cat against the light',
  'shore.cat': '<span>FR 13</span> The supervisor at home',
  'shore.boat.alt': 'Glass boat pier on the beach',
  'shore.hill.alt': 'A town below the hill at dusk',
  'shore.hill': '<span>FR 11</span> Through the car window',
  'shore.parade.alt': 'A street festival parade',
  'shore.parade': '<span>FR 02</span> Kokusai-dori parade',
  'shore.traffic.alt': 'A line of cars downtown',
  'shore.traffic': '<span>FR 01</span> The car ahead',

  'waterline.alt': 'Wooden poles rising out of the sea',
  'waterline.text': 'This is where we go in.<span>Now for the deeper part.</span>',

  'about.alt': 'Freediving with long fins over a coral reef',
  'about.caption': '<span>DIVE</span> Over the reef · Photo by Leeknow',
  'about.eyebrow': '-5m · About me',
  'about.quote': 'When I care about something,<br>I <em>hold my breath and go all the way down.</em>',
  'about.body': 'I love work with results you can see, like a camera pipeline. I stay with a problem until every camera frame and every line of a streaming response comes out smooth.',
  'about.wwdc': 'WWDC 2023 coverage',
  'about.hackday': 'LY HACK DAY award',

  'work.title': 'Things I have built',

  'break.alt': 'Light rippling over mossy rocks under the water',

  'play.eyebrow': '-20m · Made just for fun',
  'play.title': 'Cat Lounge',
  'play.body': 'Answer 13 questions and you get <strong>yourself as a cat</strong>. The ear shape comes from how you listen to other people, and the tail from how much your mood shows. The questions alone can make about 370,000 different cats.',
  'play.quote': '“Make something cute, useless, and fun for me.”',
  'play.try': 'Try it ↗',
  'play.alt': 'Cat Lounge preview',

  'archive.eyebrow': '-24m · Deeper records',
  'archive.title': 'Research and school projects',

  'log.title': 'Dive log',

  'deep.title': 'You came all the way down.<br>Thank you.',
  'deep.ascend': '↑ Back to the surface',

  // project.html
  'project.back': '← All projects',
  'project.loading': 'Loading…',
};

// Korean originals, kept so the toggle can switch back without a reload.
const originals = new WeakMap();

function swap(el, attr, key) {
  const store = originals.get(el) || {};
  if (!(attr in store)) store[attr] = attr === 'html' ? el.innerHTML : el.getAttribute(attr);
  originals.set(el, store);
  const value = lang === 'en' && PAGE_EN[key] !== undefined ? PAGE_EN[key] : store[attr];
  if (attr === 'html') el.innerHTML = value;
  else el.setAttribute(attr, value);
}

function applyStaticText() {
  document.querySelectorAll('[data-i18n]').forEach((el) => swap(el, 'html', el.dataset.i18n));
  document.querySelectorAll('[data-i18n-alt]').forEach((el) => swap(el, 'alt', el.dataset.i18nAlt));
  document.querySelectorAll('[data-i18n-label]').forEach((el) => swap(el, 'aria-label', el.dataset.i18nLabel));

  document.querySelectorAll('.lang-toggle').forEach((btn) => {
    btn.querySelectorAll('[data-l]').forEach((s) => s.classList.toggle('is-on', s.dataset.l === lang));
    btn.setAttribute('aria-label', ui('toggleLabel'));
  });
}

// Each page passes a callback that re-renders its JS-built content.
function startLang(rerender) {
  applyStaticText();
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lang-toggle')) return;
    lang = lang === 'ko' ? 'en' : 'ko';
    document.documentElement.lang = lang;
    saveLang(lang);
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
    applyStaticText();
    rerender();
  });
}

// Project fields: Korean uses *_ko when it exists; English uses the base field.
const field = (obj, key) => (lang === 'ko' && obj[`${key}_ko`]) || obj[key];
