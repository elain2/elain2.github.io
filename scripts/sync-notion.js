/**
 * Notion → Portfolio JSON Sync Script
 *
 * Usage:
 *   NOTION_API_KEY=xxx NOTION_PROJECTS_DB=xxx node scripts/sync-notion.js
 *
 * Notion Database Properties (Projects):
 *   - title (Title): Project name
 *   - id (Rich Text): Unique ID (e.g., "line-ai-dev2")
 *   - category (Select): iOS Development, AR/VR, Research, etc.
 *   - tags (Multi-select): iOS, Swift, etc.
 *   - description (Rich Text): Short description
 *   - role (Rich Text): Your role
 *   - period (Rich Text): e.g., "2023 - 2026"
 *   - detailedDescription (Rich Text): Long description
 *   - responsibilities (Rich Text): One per line
 *   - thumbnail (URL): Image URL
 *   - contribution (Number): 0-100
 *   - publication (Rich Text): Optional
 *   - publicationUrl (URL): Optional
 *   - demoVideo (URL): Optional
 *   - order (Number): Display order (lower = first)
 */

const fs = require('fs');
const path = require('path');

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_PROJECTS_DB = process.env.NOTION_PROJECTS_DB;
const NOTION_COMPANIES_DB = process.env.NOTION_COMPANIES_DB;
const NOTION_PROFILE_PAGE = process.env.NOTION_PROFILE_PAGE;

const NOTION_VERSION = '2022-06-28';

async function notionRequest(endpoint, method = 'GET', body = null) {
  const url = `https://api.notion.com/v1${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Notion API error: ${response.status} - ${error}`);
  }
  return response.json();
}

function extractRichText(property) {
  if (!property?.rich_text) return '';
  return property.rich_text.map(t => t.plain_text).join('');
}

function extractTitle(property) {
  if (!property?.title) return '';
  return property.title.map(t => t.plain_text).join('');
}

function extractSelect(property) {
  return property?.select?.name || '';
}

function extractMultiSelect(property) {
  if (!property?.multi_select) return [];
  return property.multi_select.map(s => s.name);
}

function extractNumber(property) {
  return property?.number ?? null;
}

function extractUrl(property) {
  return property?.url || '';
}

async function syncProjects() {
  if (!NOTION_PROJECTS_DB) {
    console.log('NOTION_PROJECTS_DB not set, skipping projects sync');
    return null;
  }

  console.log('Fetching projects from Notion...');

  const response = await notionRequest(`/databases/${NOTION_PROJECTS_DB}/query`, 'POST', {
    sorts: [{ property: 'order', direction: 'ascending' }],
  });

  const projects = response.results.map(page => {
    const props = page.properties;

    const responsibilities = extractRichText(props.responsibilities)
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    const project = {
      id: extractRichText(props.id) || page.id,
      title: extractTitle(props.title),
      category: extractSelect(props.category),
      thumbnail: extractUrl(props.thumbnail),
      tags: extractMultiSelect(props.tags),
      description: extractRichText(props.description),
      role: extractRichText(props.role),
      responsibilities,
      period: extractRichText(props.period),
      detailedDescription: extractRichText(props.detailedDescription),
    };

    // Optional fields
    const contribution = extractNumber(props.contribution);
    if (contribution !== null) project.contribution = contribution;

    const publication = extractRichText(props.publication);
    if (publication) project.publication = publication;

    const publicationUrl = extractUrl(props.publicationUrl);
    if (publicationUrl) project.publicationUrl = publicationUrl;

    const demoVideo = extractUrl(props.demoVideo);
    if (demoVideo) project.demoVideo = demoVideo;

    const event = extractRichText(props.event);
    if (event) project.event = event;

    return project;
  });

  console.log(`Synced ${projects.length} projects`);
  return projects;
}

async function syncCompanies() {
  if (!NOTION_COMPANIES_DB) {
    console.log('NOTION_COMPANIES_DB not set, skipping companies sync');
    return null;
  }

  console.log('Fetching companies from Notion...');

  const response = await notionRequest(`/databases/${NOTION_COMPANIES_DB}/query`, 'POST', {});

  const companies = {};

  for (const page of response.results) {
    const props = page.properties;
    const key = extractRichText(props.key) || 'default';

    companies[key] = {
      greeting: extractRichText(props.greeting),
      greetingKo: extractRichText(props.greetingKo),
      highlightSkills: extractMultiSelect(props.highlightSkills),
      featuredProjectIds: extractRichText(props.featuredProjectIds)
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0),
      hideTimeline: props.hideTimeline?.checkbox || false,
      customMessage: extractRichText(props.customMessage) || null,
    };
  }

  console.log(`Synced ${Object.keys(companies).length} company configs`);
  return companies;
}

async function main() {
  if (!NOTION_API_KEY) {
    console.error('Error: NOTION_API_KEY environment variable is required');
    process.exit(1);
  }

  const dataDir = path.join(__dirname, '..', 'data');

  // Sync projects
  const projects = await syncProjects();
  if (projects) {
    fs.writeFileSync(
      path.join(dataDir, 'projects.json'),
      JSON.stringify(projects, null, 2)
    );
    console.log('Written data/projects.json');
  }

  // Sync companies
  const companies = await syncCompanies();
  if (companies) {
    fs.writeFileSync(
      path.join(dataDir, 'companies.json'),
      JSON.stringify(companies, null, 2)
    );
    console.log('Written data/companies.json');
  }

  console.log('Sync complete!');
}

main().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
