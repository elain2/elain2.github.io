/**
 * Markdown → JSON Build Script
 *
 * Usage:
 *   node scripts/build-projects.js
 *
 * Reads all .md files from /projects/ and generates data/projects.json
 */

const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'projects');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'projects.json');

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const yamlStr = match[1];
  const body = match[2];

  const meta = {};
  let currentKey = null;
  let inArray = false;
  let arrayItems = [];
  let currentObject = null;

  for (const line of yamlStr.split('\n')) {
    // Array item with object start (e.g., "  - url: value")
    const arrayObjectMatch = line.match(/^(\s+)-\s+(\w+):\s*(.*)$/);
    if (arrayObjectMatch) {
      // Save previous object if exists
      if (currentObject) {
        arrayItems.push(currentObject);
      }
      currentObject = {};
      const key = arrayObjectMatch[2];
      const value = arrayObjectMatch[3].trim();
      currentObject[key] = value;
      continue;
    }

    // Object property continuation (e.g., "    caption: value")
    const objectPropMatch = line.match(/^(\s{4,})(\w+):\s*(.*)$/);
    if (objectPropMatch && currentObject) {
      const key = objectPropMatch[2];
      const value = objectPropMatch[3].trim();
      currentObject[key] = value;
      continue;
    }

    // Simple array item (e.g., "  - value")
    const simpleArrayMatch = line.match(/^(\s+)-\s+(.+)$/);
    if (simpleArrayMatch && !arrayObjectMatch) {
      // Save previous object if exists
      if (currentObject) {
        arrayItems.push(currentObject);
        currentObject = null;
      }
      const value = simpleArrayMatch[2].trim();
      arrayItems.push(value);
      continue;
    }

    // Save previous array if exists (when we hit a new top-level key)
    if (inArray && currentKey && line.match(/^\w+:/)) {
      if (currentObject) {
        arrayItems.push(currentObject);
        currentObject = null;
      }
      meta[currentKey] = arrayItems;
      arrayItems = [];
      inArray = false;
    }

    // Key-value pair at root level
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const value = kvMatch[2].trim();

      if (value === '') {
        // Start of array
        currentKey = key;
        inArray = true;
        arrayItems = [];
      } else {
        // Simple value
        if (/^\d+$/.test(value)) {
          meta[key] = parseInt(value, 10);
        } else {
          meta[key] = value;
        }
      }
    }
  }

  // Save last array/object if exists
  if (inArray && currentKey) {
    if (currentObject) {
      arrayItems.push(currentObject);
    }
    meta[currentKey] = arrayItems;
  }

  return { meta, body };
}

function parseBody(body) {
  const sections = {};
  let currentSection = null;
  let currentContent = [];

  for (const line of body.split('\n')) {
    const sectionMatch = line.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      if (currentSection) {
        sections[currentSection] = currentContent;
      }
      currentSection = sectionMatch[1].toLowerCase();
      currentContent = [];
    } else if (currentSection) {
      // List item
      const listMatch = line.match(/^-\s+(.+)$/);
      if (listMatch) {
        currentContent.push(listMatch[1]);
      } else if (line.trim()) {
        currentContent.push(line.trim());
      }
    }
  }

  if (currentSection) {
    sections[currentSection] = currentContent;
  }

  return sections;
}

function buildProjects() {
  const files = fs.readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  const projects = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
    const { meta, body } = parseYamlFrontmatter(content);
    const sections = parseBody(body);

    const project = {
      id: meta.id,
      title: meta.title,
      category: meta.category,
      thumbnail: meta.thumbnail,
      tags: meta.tags || [],
      description: meta.description,
      role: meta.role,
      responsibilities: sections.responsibilities || [],
      period: meta.period,
      detailedDescription: (sections.about || []).join(' '),
    };

    // Optional fields
    if (meta.contribution) project.contribution = meta.contribution;
    if (meta.publication) project.publication = meta.publication;
    if (meta.publicationUrl) project.publicationUrl = meta.publicationUrl;
    if (meta.demoVideo) project.demoVideo = meta.demoVideo;
    if (meta.event) project.event = meta.event;
    if (meta.images) project.images = meta.images;

    projects.push(project);
    console.log(`Parsed: ${file}`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projects, null, 2));
  console.log(`\nGenerated ${OUTPUT_FILE} with ${projects.length} projects`);
}

buildProjects();
