/**
 * Portfolio App with Company-specific Customization
 * URL: ?company=apple, ?company=google, ?c=meta
 */

// ===== Icons (Lucide) =====
const icons = {
  chevronDown: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  graduationCap: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  youtube: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>',
  award: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>',
  github: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  languages: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
  lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>'
};

// ===== Data Store =====
class DataStore {
  constructor() {
    this.cache = {};
    this.companyConfig = null;
    this.currentCompany = null;
  }

  async load(name) {
    if (this.cache[name]) return this.cache[name];
    try {
      const res = await fetch(`data/${name}.json`);
      this.cache[name] = await res.json();
      return this.cache[name];
    } catch (e) {
      console.error(`Load failed: ${name}`, e);
      return null;
    }
  }

  getCompanyFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('company') || params.get('c');
  }

  async loadCompanyConfig() {
    const companies = await this.load('companies');
    this.currentCompany = this.getCompanyFromUrl();
    this.companyConfig = companies?.[this.currentCompany] || companies?.['default'];
    return this.companyConfig;
  }

  async getProfile() { return this.load('profile'); }
  async getProjects() { return this.load('projects'); }
  async getTimeline() { return this.load('timeline'); }
  async getAchievements() { return this.load('achievements'); }

  async getFeaturedProjects(count = 6) {
    const projects = await this.getProjects();
    if (!projects) return [];

    // Reorder by company config
    if (this.companyConfig?.featuredProjectIds?.length) {
      const ordered = [];
      for (const id of this.companyConfig.featuredProjectIds) {
        const p = projects.find(x => x.id === id);
        if (p) ordered.push(p);
      }
      projects.forEach(p => { if (!ordered.includes(p)) ordered.push(p); });
      return ordered.slice(0, count);
    }
    return projects.slice(0, count);
  }

  async getProjectById(id) {
    const projects = await this.getProjects();
    return projects?.find(p => p.id === id);
  }

  getHighlightedSkills() {
    return this.companyConfig?.highlightSkills || [];
  }

  getCustomGreeting(lang) {
    if (!this.companyConfig) return null;
    return lang === 'ko' ? this.companyConfig.greetingKo : this.companyConfig.greeting;
  }

  getCustomMessage() {
    return this.companyConfig?.customMessage;
  }
}

// ===== i18n =====
class I18n {
  constructor() {
    this.lang = localStorage.getItem('lang') || 'en';
    this.translations = {};
  }

  async init() {
    const [en, ko] = await Promise.all([
      fetch('data/i18n/en.json').then(r => r.json()),
      fetch('data/i18n/ko.json').then(r => r.json())
    ]);
    this.translations = { en, ko };
  }

  t(key) { return this.translations[this.lang]?.[key] || key; }

  toggle() {
    this.lang = this.lang === 'en' ? 'ko' : 'en';
    localStorage.setItem('lang', this.lang);
    window.dispatchEvent(new Event('langchange'));
  }

  getToggleLabel() { return this.lang === 'en' ? '한국어' : 'English'; }
}

// ===== App =====
const data = new DataStore();
const i18n = new I18n();

class App {
  constructor() {
    this.el = document.getElementById('app');
  }

  async init() {
    await Promise.all([i18n.init(), data.loadCompanyConfig()]);
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('langchange', () => this.route());
    this.route();
  }

  async route() {
    const hash = location.hash || '#/';
    if (hash.startsWith('#/projects/')) {
      await this.renderDetail(hash.replace('#/projects/', ''));
    } else if (hash === '#/projects') {
      await this.renderProjects();
    } else {
      await this.renderHome();
    }
    window.scrollTo(0, 0);
  }

  // ===== Render Home =====
  async renderHome() {
    const [profile, projects, timeline, achievements] = await Promise.all([
      data.getProfile(), data.getFeaturedProjects(), data.getTimeline(), data.getAchievements()
    ]);
    const highlightSkills = data.getHighlightedSkills();
    const customGreeting = data.getCustomGreeting(i18n.lang);
    const customMessage = data.getCustomMessage();
    const company = data.currentCompany;

    const skillsHtml = profile.skills.map(s => {
      const isHighlight = highlightSkills.includes(s);
      return `<span class="badge ${isHighlight ? 'badge-highlight' : 'badge-default'}">${s}</span>`;
    }).join('');

    const featuredHtml = projects.map(p => `
      <a href="#/projects/${p.id}" class="featured-item">
        <div class="featured-img"><img src="${p.thumbnail}" alt="${p.title}" loading="lazy"></div>
        <div class="featured-title">${p.title}</div>
        <div class="featured-tags">${p.tags.slice(0,2).map(t => `<span class="featured-tag">${t}</span>`).join('')}</div>
      </a>
    `).join('');

    const timelineHtml = timeline.map(e => `
      <div class="timeline-item">
        <div class="timeline-dot"><span class="type-${e.type}">${icons[{work:'briefcase',highlight:'award',tech:'code',education:'graduationCap',research:'lightbulb'}[e.type]]}</span></div>
        <div class="timeline-content">
          <div class="timeline-year">${e.year}</div>
          <div class="timeline-text">${i18n.t(e.eventKey)}</div>
        </div>
      </div>
    `).join('');

    const achievementsHtml = achievements.map(a => `
      <div class="card">
        <div class="card-icon" style="background:${a.color}15"><span style="color:${a.color}">${icons[a.icon]}</span></div>
        <div class="card-title">${i18n.t(a.titleKey)}</div>
        <div class="card-subtitle">${i18n.t(a.descKey)}</div>
        ${a.links ? `<div class="mt-2 flex gap-1">${a.links.map(l => `<a href="${l.url}" target="_blank" class="btn btn-primary">${icons.youtube} ${i18n.t(l.labelKey)}</a>`).join('')}</div>` : ''}
      </div>
    `).join('');

    this.el.innerHTML = `
      ${this.renderNav()}
      <main>
        <section class="hero">
          <div class="hero-content">
            <p class="hero-greeting">${customGreeting || i18n.t('hero.greeting')}</p>
            <h1 class="hero-name">${profile.name}</h1>
            <p class="hero-title">${i18n.t('hero.title')}</p>
            ${customMessage ? `<div class="hero-custom-message">${customMessage}</div>` : ''}
            <div class="hero-skills">${skillsHtml}</div>
            <p class="hero-desc">${i18n.t('hero.description')}</p>
          </div>
        </section>

        <section class="container section">
          <div class="bento">
            <div class="card bento-main">
              <div class="flex gap-1 mb-2">${icons.sparkles}<span style="font-size:0.75rem;color:var(--text-secondary)">${i18n.t('featured.title')}</span></div>
              <div class="featured-grid">${featuredHtml}</div>
              <a href="#/projects" class="btn btn-primary btn-full mt-2">${i18n.t('featured.viewAll')}</a>
            </div>
            <div class="card">
              <div class="card-icon" style="background:rgba(0,122,255,0.1)"><span style="color:#007AFF">${icons.code}</span></div>
              <div class="card-title">${i18n.t('skills.title')}</div>
              <div class="card-subtitle">${i18n.t('skills.subtitle')}</div>
            </div>
            <div class="card">
              <div class="card-icon" style="background:rgba(88,86,214,0.1)"><span style="color:#5856D6">${icons.briefcase}</span></div>
              <div class="card-title">${i18n.t('career.title')}</div>
              <div class="card-subtitle">${i18n.t('career.subtitle')}</div>
            </div>
            <a href="#contact" class="card bento-wide">
              <div class="card-icon" style="background:rgba(255,149,0,0.1)"><span style="color:#FF9500">${icons.mail}</span></div>
              <div class="card-title">${i18n.t('contact.title')}</div>
              <div class="card-subtitle">${profile.email}</div>
            </a>
          </div>
        </section>

        <section class="section" style="background:linear-gradient(transparent,rgba(0,0,0,0.03))">
          <div class="container">
            <div class="section-header">
              <h2 class="section-title">${i18n.t('achievements.title')}</h2>
              <p class="section-subtitle">${i18n.t('achievements.subtitle')}</p>
            </div>
            <div class="grid grid-2">${achievementsHtml}</div>
          </div>
        </section>

        <section class="section">
          <div class="container">
            <div class="section-header">
              <h2 class="section-title">${i18n.t('timeline.title')}</h2>
              <p class="section-subtitle">${i18n.t('timeline.subtitle')}</p>
            </div>
            <div class="timeline">
              <div class="timeline-line"></div>
              ${timelineHtml}
            </div>
          </div>
        </section>
      </main>
      ${this.renderFooter(profile)}
    `;
    this.attachEvents();
  }

  // ===== Render Projects =====
  async renderProjects() {
    const projects = await data.getProjects();
    const categories = ['All', 'iOS Development', 'AR/VR', 'Research', 'Game Design', 'Computer Graphics', 'IoT', 'Web Development'];

    const projectsHtml = projects.map(p => `
      <a href="#/projects/${p.id}" class="project-card">
        <div class="project-img">
          <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
          <div class="project-category"><span class="badge badge-primary">${p.category}</span></div>
        </div>
        <div class="project-info">
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.description}</div>
          <div class="project-tags">${p.tags.slice(0,3).map(t => `<span class="badge badge-default">${t}</span>`).join('')}</div>
        </div>
      </a>
    `).join('');

    this.el.innerHTML = `
      ${this.renderNav()}
      <main class="container section">
        <div class="projects-header">
          <h1 class="projects-title">${i18n.t('projects.title')}</h1>
          <p class="projects-subtitle">${i18n.t('projects.subtitle')}</p>
        </div>
        <div class="filter-tabs">
          ${categories.map((c, i) => `<button class="filter-tab ${i === 0 ? 'filter-tab-active' : 'filter-tab-inactive'}" data-cat="${c}">${c === 'All' ? i18n.t('projects.all') : c}</button>`).join('')}
        </div>
        <div class="grid grid-3" id="projects-grid">${projectsHtml}</div>
      </main>
      ${this.renderFooter(await data.getProfile())}
    `;
    this.attachEvents();
    this.attachFilterEvents();
  }

  // ===== Render Detail =====
  async renderDetail(id) {
    const project = await data.getProjectById(id);
    const profile = await data.getProfile();
    if (!project) {
      this.el.innerHTML = `${this.renderNav()}<main class="container section text-center"><h1>Project not found</h1><a href="#/projects" class="btn btn-primary">Back</a></main>`;
      return;
    }

    const tagsHtml = project.tags.map(t => `<span class="badge badge-default">${t}</span>`).join('');
    const respHtml = project.responsibilities?.map(r => `<li style="color:var(--text-secondary);margin-bottom:0.5rem">• ${r}</li>`).join('') || '';

    this.el.innerHTML = `
      ${this.renderNav()}
      <main class="container section">
        <a href="#/projects" class="back-link">${icons.chevronLeft} ${i18n.t('projects.back')}</a>
        <div class="detail-container">
          <div class="detail-img"><img src="${project.thumbnail}" alt="${project.title}"></div>
          <div class="flex gap-1 mb-1">
            <span class="badge badge-primary">${project.category}</span>
            <span class="badge badge-default">${project.period}</span>
          </div>
          <h1 class="detail-title">${project.title}</h1>
          <p class="detail-desc">${project.description}</p>

          <div class="detail-section">
            <h3 class="detail-section-title">${i18n.t('project.tech')}</h3>
            <div class="flex flex-wrap gap-1">${tagsHtml}</div>
          </div>

          <div class="detail-section">
            <h3 class="detail-section-title">${i18n.t('project.role')}</h3>
            <div class="detail-card">
              <strong>${project.role}</strong>
              ${project.contribution ? `<div style="margin:1rem 0"><div style="height:6px;background:rgba(0,0,0,0.05);border-radius:3px"><div style="height:100%;width:${project.contribution}%;background:linear-gradient(90deg,#007AFF,#5856D6);border-radius:3px"></div></div><small style="color:var(--text-secondary)">${project.contribution}% contribution</small></div>` : ''}
              <ul style="margin-top:1rem">${respHtml}</ul>
            </div>
          </div>

          <div class="detail-section">
            <h3 class="detail-section-title">${i18n.t('project.about')}</h3>
            <div class="detail-card"><p>${project.detailedDescription}</p></div>
          </div>
        </div>
      </main>
      ${this.renderFooter(profile)}
    `;
    this.attachEvents();
  }

  // ===== Common Components =====
  renderNav() {
    return `
      <nav class="nav">
        <div class="container nav-inner">
          <a href="#/" class="nav-logo">KL</a>
          <div class="nav-links">
            <a href="#/" class="nav-link">${i18n.t('nav.home')}</a>
            <a href="#/projects" class="nav-link">${i18n.t('nav.projects')}</a>
            <a href="#contact" class="nav-link">${i18n.t('nav.contact')}</a>
            <button class="lang-btn" id="lang-btn">${icons.languages} <span>${i18n.getToggleLabel()}</span></button>
          </div>
        </div>
      </nav>
    `;
  }

  renderFooter(profile) {
    return `
      <footer class="footer" id="contact">
        <div class="container footer-inner">
          <h2 class="footer-title">${i18n.t('footer.connect')}</h2>
          <p class="footer-subtitle">${i18n.t('contact.subtitle')}</p>
          <div class="footer-contacts">
            <a href="mailto:${profile.email}" class="footer-contact">
              <div class="footer-contact-icon" style="background:rgba(0,122,255,0.1)"><span style="color:#007AFF">${icons.mail}</span></div>
              <div><small style="color:var(--text-secondary)">Email</small><div>${profile.email}</div></div>
            </a>
            <div class="footer-contact">
              <div class="footer-contact-icon" style="background:rgba(52,199,89,0.1)"><span style="font-size:1.5rem">📱</span></div>
              <div><small style="color:var(--text-secondary)">Phone</small><div>${profile.phone}</div></div>
            </div>
          </div>
          <div class="footer-bottom">
            <small style="color:var(--text-secondary)">${i18n.t('footer.copyright')}</small>
            ${data.currentCompany ? `<small style="color:var(--text-secondary);opacity:0.6">Customized for ${data.currentCompany}</small>` : ''}
            <div class="footer-social">
              <a href="${profile.socialLinks.github}" target="_blank">${icons.github}</a>
              <a href="${profile.socialLinks.linkedin}" target="_blank">${icons.linkedin}</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  attachEvents() {
    document.getElementById('lang-btn')?.addEventListener('click', () => i18n.toggle());
  }

  attachFilterEvents() {
    document.querySelectorAll('.filter-tab').forEach(btn => {
      btn.addEventListener('click', async () => {
        document.querySelectorAll('.filter-tab').forEach(b => {
          b.classList.remove('filter-tab-active');
          b.classList.add('filter-tab-inactive');
        });
        btn.classList.add('filter-tab-active');
        btn.classList.remove('filter-tab-inactive');

        const cat = btn.dataset.cat;
        const projects = await data.getProjects();
        const filtered = cat === 'All' ? projects : projects.filter(p => p.category === cat);

        document.getElementById('projects-grid').innerHTML = filtered.map(p => `
          <a href="#/projects/${p.id}" class="project-card">
            <div class="project-img">
              <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
              <div class="project-category"><span class="badge badge-primary">${p.category}</span></div>
            </div>
            <div class="project-info">
              <div class="project-title">${p.title}</div>
              <div class="project-desc">${p.description}</div>
              <div class="project-tags">${p.tags.slice(0,3).map(t => `<span class="badge badge-default">${t}</span>`).join('')}</div>
            </div>
          </a>
        `).join('');
      });
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => new App().init());
