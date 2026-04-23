/**
 * YAML → JSON Build Script
 *
 * Usage:
 *   node scripts/build-data.js
 *
 * Converts all .yaml files in /data/ to .json files
 * Also runs the projects build script
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Simple YAML parser (supports our use cases)
 * - Key-value pairs
 * - Nested objects
 * - Arrays (- item)
 * - Multi-line strings (>-)
 * - Comments (#)
 */
function parseYaml(content) {
  const lines = content.split('\n');
  const result = {};
  const stack = [{ obj: result, indent: -1 }];
  let currentKey = null;
  let inMultiline = false;
  let multilineValue = [];
  let arrayKey = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines and comments (unless in multiline)
    if (!inMultiline && (trimmed === '' || trimmed.startsWith('#'))) {
      continue;
    }

    // Handle multiline continuation
    if (inMultiline) {
      const lineIndent = line.search(/\S/);
      if (lineIndent > stack[stack.length - 1].indent && trimmed !== '') {
        multilineValue.push(trimmed);
        continue;
      } else {
        // End multiline
        const parent = stack[stack.length - 1].obj;
        parent[currentKey] = multilineValue.join(' ');
        inMultiline = false;
        multilineValue = [];
        if (trimmed === '') continue;
      }
    }

    const indent = line.search(/\S/);

    // Pop stack for dedented lines
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
      arrayKey = null;
    }

    const parent = stack[stack.length - 1].obj;

    // Array item
    if (trimmed.startsWith('- ')) {
      const value = trimmed.slice(2).trim();

      // Check if it's an object in array (- key: value)
      const kvMatch = value.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        const obj = {};
        obj[kvMatch[1]] = parseValue(kvMatch[2]);

        if (!Array.isArray(parent[arrayKey])) {
          parent[arrayKey] = [];
        }
        parent[arrayKey].push(obj);

        // Push this object for potential nested properties
        stack.push({ obj: obj, indent: indent });
      } else {
        // Simple array item
        if (arrayKey && Array.isArray(parent[arrayKey])) {
          parent[arrayKey].push(parseValue(value));
        } else if (Array.isArray(parent)) {
          parent.push(parseValue(value));
        }
      }
      continue;
    }

    // Key-value pair
    const kvMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();

      if (value === '' || value === '>-') {
        // Start of nested object, array, or multiline
        if (value === '>-') {
          inMultiline = true;
          currentKey = key;
          multilineValue = [];
        } else {
          // Check next line to determine if array or object
          const nextLine = lines[i + 1];
          if (nextLine && nextLine.trim().startsWith('-')) {
            parent[key] = [];
            arrayKey = key;
          } else {
            parent[key] = {};
            stack.push({ obj: parent[key], indent: indent });
          }
        }
      } else {
        parent[key] = parseValue(value);
        arrayKey = null;
      }
    }
  }

  // Handle trailing multiline
  if (inMultiline && currentKey) {
    const parent = stack[stack.length - 1].obj;
    parent[currentKey] = multilineValue.join(' ');
  }

  return result;
}

/**
 * Parse a YAML value to appropriate JS type
 */
function parseValue(value) {
  if (value === 'null' || value === '~') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === '[]') return [];
  if (value === '{}') return {};
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);

  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  return value;
}

/**
 * Parse YAML array file (starts with -)
 */
function parseYamlArray(content) {
  const lines = content.split('\n');
  const result = [];
  let currentItem = null;
  let currentIndent = 0;
  let inLinks = false;
  let linksArray = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    const indent = line.search(/\S/);

    // New array item
    if (trimmed.startsWith('- ') && indent === 0) {
      // Save previous item
      if (currentItem) {
        if (inLinks && linksArray.length > 0) {
          currentItem.links = linksArray;
        }
        result.push(currentItem);
      }

      currentItem = {};
      inLinks = false;
      linksArray = [];

      // Parse first property
      const rest = trimmed.slice(2);
      const kvMatch = rest.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        currentItem[kvMatch[1]] = parseValue(kvMatch[2]);
      }
      currentIndent = indent;
      continue;
    }

    // Nested array item (links)
    if (trimmed.startsWith('- ') && indent > 0 && inLinks) {
      const rest = trimmed.slice(2);
      const kvMatch = rest.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        const linkObj = {};
        linkObj[kvMatch[1]] = parseValue(kvMatch[2]);
        linksArray.push(linkObj);
      }
      continue;
    }

    // Property of current item
    if (currentItem) {
      const kvMatch = trimmed.match(/^(\w+):\s*(.*)$/);
      if (kvMatch) {
        const key = kvMatch[1];
        const value = kvMatch[2];

        if (key === 'links' && value === '') {
          inLinks = true;
        } else if (inLinks && indent > currentIndent + 2) {
          // This is a property of a link object
          const lastLink = linksArray[linksArray.length - 1];
          if (lastLink) {
            lastLink[key] = parseValue(value);
          }
        } else {
          currentItem[key] = parseValue(value);
          inLinks = false;
        }
      }
    }
  }

  // Save last item
  if (currentItem) {
    if (inLinks && linksArray.length > 0) {
      currentItem.links = linksArray;
    }
    result.push(currentItem);
  }

  return result;
}

/**
 * Detect if YAML content is an array (starts with -)
 */
function isYamlArray(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    return trimmed.startsWith('-');
  }
  return false;
}

/**
 * Convert a single YAML file to JSON
 */
function convertYamlFile(yamlPath) {
  const content = fs.readFileSync(yamlPath, 'utf-8');
  const data = isYamlArray(content) ? parseYamlArray(content) : parseYaml(content);

  const jsonPath = yamlPath.replace('.yaml', '.json');
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  const relativePath = path.relative(path.join(__dirname, '..'), yamlPath);
  console.log(`Converted: ${relativePath}`);
}

/**
 * Find all YAML files recursively
 */
function findYamlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findYamlFiles(fullPath));
    } else if (entry.name.endsWith('.yaml')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Main build function
 */
function build() {
  console.log('Building data files...\n');

  // Convert YAML files
  const yamlFiles = findYamlFiles(DATA_DIR);
  for (const file of yamlFiles) {
    convertYamlFile(file);
  }

  console.log(`\nConverted ${yamlFiles.length} YAML files to JSON`);

  // Run projects build
  console.log('\nBuilding projects...');
  require('./build-projects.js');
}

build();
