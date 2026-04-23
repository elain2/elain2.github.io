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
 * Parse YAML value to appropriate JS type
 */
function parseValue(value) {
  if (value === undefined || value === '') return '';
  const v = value.trim();
  if (v === 'null' || v === '~') return null;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === '[]') return [];
  if (v === '{}') return {};
  if (/^-?\d+$/.test(v)) return parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return parseFloat(v);
  // Remove quotes
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

/**
 * Get indentation level (number of spaces)
 */
function getIndent(line) {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length : 0;
}

/**
 * Parse YAML content to JS object
 */
function parseYaml(content) {
  const lines = content.split('\n');

  // Remove comments and handle multiline strings
  const cleanLines = [];
  let inMultiline = false;
  let multilineIndent = 0;
  let multilineContent = [];
  let multilineKey = '';
  let multilineBaseIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Handle multiline string continuation
    if (inMultiline) {
      const indent = getIndent(line);
      if (trimmed === '' || indent > multilineBaseIndent) {
        if (trimmed) multilineContent.push(trimmed);
        continue;
      } else {
        // End of multiline - emit the combined value
        cleanLines.push(' '.repeat(multilineBaseIndent) + multilineKey + ': "' + multilineContent.join(' ') + '"');
        inMultiline = false;
        multilineContent = [];
      }
    }

    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) continue;

    // Check for multiline indicator
    if (trimmed.endsWith('>-') || trimmed.endsWith('|')) {
      const match = trimmed.match(/^([^:]+):\s*[>|]-?$/);
      if (match) {
        multilineKey = match[1];
        multilineBaseIndent = getIndent(line);
        inMultiline = true;
        multilineContent = [];
        continue;
      }
    }

    cleanLines.push(line);
  }

  // Handle trailing multiline
  if (inMultiline && multilineContent.length > 0) {
    cleanLines.push(' '.repeat(multilineBaseIndent) + multilineKey + ': "' + multilineContent.join(' ') + '"');
  }

  return parseYamlLines(cleanLines, 0, cleanLines.length);
}

/**
 * Parse a range of YAML lines into an object or array
 */
function parseYamlLines(lines, start, end) {
  if (start >= end) return {};

  const firstLine = lines[start].trim();

  // If first line starts with -, it's an array
  if (firstLine.startsWith('- ')) {
    return parseYamlArray(lines, start, end);
  }

  return parseYamlObject(lines, start, end);
}

/**
 * Parse YAML lines as an object
 */
function parseYamlObject(lines, start, end) {
  const result = {};
  let i = start;

  while (i < end) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = getIndent(line);

    // Key-value pair
    const kvMatch = trimmed.match(/^([^:]+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();

      if (value === '' || value === '>-' || value === '|') {
        // Find the block of nested content
        const blockStart = i + 1;
        const baseIndent = indent;
        let blockEnd = blockStart;

        while (blockEnd < end) {
          const nextLine = lines[blockEnd];
          const nextTrimmed = nextLine.trim();
          if (nextTrimmed === '') {
            blockEnd++;
            continue;
          }
          const nextIndent = getIndent(nextLine);
          if (nextIndent <= baseIndent) break;
          blockEnd++;
        }

        if (blockStart < blockEnd) {
          result[key] = parseYamlLines(lines, blockStart, blockEnd);
        } else {
          result[key] = value === '' ? {} : '';
        }
        i = blockEnd;
      } else {
        result[key] = parseValue(value);
        i++;
      }
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Parse YAML lines as an array
 */
function parseYamlArray(lines, start, end) {
  const result = [];
  let i = start;

  while (i < end) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = getIndent(line);

    if (trimmed.startsWith('- ')) {
      const rest = trimmed.slice(2).trim();

      // Check if it's a simple value or start of object
      const kvMatch = rest.match(/^([^:]+):\s*(.*)$/);
      if (kvMatch) {
        // It's an object - find all properties at this level
        const obj = {};
        const key = kvMatch[1].trim();
        const value = kvMatch[2].trim();

        if (value === '') {
          // Nested block
          const blockStart = i + 1;
          let blockEnd = blockStart;
          const itemIndent = indent + 2;

          while (blockEnd < end) {
            const nextLine = lines[blockEnd];
            const nextTrimmed = nextLine.trim();
            if (nextTrimmed === '') {
              blockEnd++;
              continue;
            }
            const nextIndent = getIndent(nextLine);
            if (nextIndent < itemIndent || nextTrimmed.startsWith('- ')) {
              if (nextIndent <= indent) break;
            }
            blockEnd++;
          }

          obj[key] = parseYamlLines(lines, blockStart, blockEnd);
          i = blockEnd;
        } else {
          obj[key] = parseValue(value);
          i++;
        }

        // Continue reading properties of this object
        const itemIndent = indent + 2;
        while (i < end) {
          const nextLine = lines[i];
          const nextTrimmed = nextLine.trim();
          if (nextTrimmed === '') {
            i++;
            continue;
          }
          const nextIndent = getIndent(nextLine);

          // If we hit another array item or dedent, stop
          if (nextTrimmed.startsWith('- ') || nextIndent <= indent) break;

          // Parse this property
          const propMatch = nextTrimmed.match(/^([^:]+):\s*(.*)$/);
          if (propMatch) {
            const propKey = propMatch[1].trim();
            const propValue = propMatch[2].trim();

            if (propValue === '') {
              // Nested block
              const blockStart = i + 1;
              let blockEnd = blockStart;

              while (blockEnd < end) {
                const bl = lines[blockEnd];
                const bt = bl.trim();
                if (bt === '') {
                  blockEnd++;
                  continue;
                }
                const bi = getIndent(bl);
                if (bi <= nextIndent) break;
                blockEnd++;
              }

              obj[propKey] = parseYamlLines(lines, blockStart, blockEnd);
              i = blockEnd;
            } else {
              obj[propKey] = parseValue(propValue);
              i++;
            }
          } else {
            i++;
          }
        }

        result.push(obj);
      } else {
        // Simple value
        result.push(parseValue(rest));
        i++;
      }
    } else {
      i++;
    }
  }

  return result;
}

/**
 * Convert a single YAML file to JSON
 */
function convertYamlFile(yamlPath) {
  const content = fs.readFileSync(yamlPath, 'utf-8');
  const data = parseYaml(content);

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
