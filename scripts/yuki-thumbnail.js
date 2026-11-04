// Generates images/projects/line-yuki-framework/thumbnail.svg
// Usage: node scripts/yuki-thumbnail.js images/projects/line-yuki-framework/thumbnail.svg
const fs = require('fs');

const W = 1600, H = 1000;
const cx = 800, cy = 500;
const R = 210;        // aperture ring
const HEX = 74;       // aperture opening
const f = (n) => n.toFixed(1);
const pt = (r, deg, ox = cx, oy = cy) => {
  const a = (deg - 90) * Math.PI / 180;
  return [ox + r * Math.cos(a), oy + r * Math.sin(a)];
};

// Aperture blades: each runs from one hexagon edge out to an arc of the ring.
const blades = [];
for (let i = 0; i < 6; i++) {
  const a = i * 60;
  const [x1, y1] = pt(HEX, a);
  const [x2, y2] = pt(R - 6, a + 38);
  const [x3, y3] = pt(R - 6, a + 104);
  const [x4, y4] = pt(HEX, a + 60);
  const op = (0.10 + 0.05 * ((i * 2) % 6) / 2).toFixed(3);
  blades.push(`<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${R - 6} ${R - 6} 0 0 1 ${f(x3)} ${f(y3)} L${f(x4)} ${f(y4)} Z" fill="url(#blade)" fill-opacity="${op}" stroke="#cfeaf4" stroke-opacity="0.35" stroke-width="1.2"/>`);
}

// Focus-ring ticks
const ticks = [];
for (let i = 0; i < 72; i++) {
  const long = i % 6 === 0;
  const [x1, y1] = pt(R + 14, i * 5);
  const [x2, y2] = pt(R + (long ? 30 : 21), i * 5);
  ticks.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-opacity="${long ? 0.55 : 0.22}"/>`);
}

// Snow crystal in the opening
const crystal = [];
for (let i = 0; i < 6; i++) {
  const a = i * 60;
  const [ex, ey] = pt(52, a);
  crystal.push(`<line x1="${cx}" y1="${cy}" x2="${f(ex)}" y2="${f(ey)}"/>`);
  for (const [d, len] of [[22, 13], [36, 9]]) {
    const [bx, by] = pt(d, a);
    const [l1x, l1y] = pt(len, a - 50, bx, by);
    const [l2x, l2y] = pt(len, a + 50, bx, by);
    crystal.push(`<polyline points="${f(l1x)},${f(l1y)} ${f(bx)},${f(by)} ${f(l2x)},${f(l2y)}"/>`);
  }
}

// Incoming frame layers (left), drawn as slanted planes
const layers = ['RAW', 'FILTER', 'COMPOSITE'].map((label, i) => {
  const x = 150 + i * 70, y = 330 + i * 34;
  const w = 250, h = 300, skew = 46;
  const pts = `${x},${y + skew} ${x + w},${y} ${x + w},${y + h - skew} ${x},${y + h}`;
  return `
    <polygon points="${pts}" fill="#7fd0ec" fill-opacity="${(0.035 + i * 0.03).toFixed(3)}" stroke="#cfeaf4" stroke-opacity="${(0.25 + i * 0.15).toFixed(2)}" stroke-width="1.2"/>
    <text x="${x + 14}" y="${y + h - 16}" class="mono" font-size="15" fill-opacity="${(0.45 + i * 0.2).toFixed(2)}" transform="rotate(-10.4 ${x + 14} ${y + h - 16})">${label}</text>`;
}).join('');

// Product outputs (right)
const outputs = [['AVATAR', 300], ['VOOM', 500], ['MESSENGER', 700]];
const outPaths = outputs.map(([label, y], i) => {
  const [sx, sy] = pt(R + 34, 90 + (i - 1) * 28);
  const d = `M${f(sx)} ${f(sy)} C ${f(sx + 140)} ${f(sy)}, ${1130} ${y}, ${1250} ${y}`;
  return `
    <path id="out${i}" d="${d}" fill="none" stroke="#7fd0ec" stroke-opacity="0.5" stroke-width="1.4"/>
    <circle r="4" fill="#bfe9f7"><animateMotion dur="${4 + i * 0.7}s" repeatCount="indefinite" begin="${i * 0.9}s"><mpath href="#out${i}"/></animateMotion></circle>
    <rect x="1250" y="${y - 30}" width="210" height="60" rx="30" fill="#0b2a40" fill-opacity="0.6" stroke="#cfeaf4" stroke-opacity="0.45"/>
    <circle cx="1280" cy="${y}" r="5" fill="#7fd0ec"/>
    <text x="1300" y="${y + 6}" class="mono" font-size="17" fill-opacity="0.9">${label}</text>`;
}).join('');

// Input path from layers to the ring
const [ix, iy] = pt(R + 34, 270);
const inPath = `M 470 ${cy} L ${f(ix)} ${f(iy)}`;

// Drifting particles: half snow, half bubbles
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const particles = Array.from({ length: 38 }, () => {
  const x = rand() * W, y = rand() * H, r = 1 + rand() * 3.2;
  const dur = 14 + rand() * 16;
  return `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#e8f1f5" fill-opacity="${(0.12 + rand() * 0.3).toFixed(2)}"><animate attributeName="cy" values="${f(y)};${f(y - 120)};${f(y)}" dur="${f(dur)}s" repeatCount="indefinite"/></circle>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Yuki camera and graphics framework: frame layers pass through a snowflake-shaped aperture and feed Avatar, Voom and Messenger">
  <defs>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1b5676"/>
      <stop offset="0.55" stop-color="#0f3550"/>
      <stop offset="1" stop-color="#071a2a"/>
    </linearGradient>
    <radialGradient id="light" cx="0.22" cy="-0.05" r="0.75">
      <stop offset="0" stop-color="#bfe9f7" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#bfe9f7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#7fd0ec" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#7fd0ec" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="blade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e8f1f5"/>
      <stop offset="1" stop-color="#7fd0ec"/>
    </linearGradient>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#e8f1f5" fill-opacity="0.09"/>
    </pattern>
    <style>
      .mono { font-family: "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace; letter-spacing: 0.12em; fill: #e8f1f5; }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#sea)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#light)"/>

  ${layers}
  <path d="${inPath}" stroke="#7fd0ec" stroke-opacity="0.5" stroke-width="1.4" stroke-dasharray="6 8" fill="none">
    <animate attributeName="stroke-dashoffset" from="28" to="0" dur="1.6s" repeatCount="indefinite"/>
  </path>

  <circle cx="${cx}" cy="${cy}" r="${R + 120}" fill="url(#glow)"/>
  <g stroke="#e8f1f5" stroke-width="1.2">${ticks.join('')}</g>
  <circle cx="${cx}" cy="${cy}" r="${R + 34}" fill="none" stroke="#cfeaf4" stroke-opacity="0.3"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="#0b2a40" fill-opacity="0.55" stroke="#7fd0ec" stroke-opacity="0.7" stroke-width="1.6"/>
  <g>
    ${blades.join('\n    ')}
    <animateTransform attributeName="transform" type="rotate" values="0 ${cx} ${cy};8 ${cx} ${cy};0 ${cx} ${cy}" dur="9s" repeatCount="indefinite"/>
  </g>
  <g stroke="#e8f6fb" stroke-width="2.4" stroke-linecap="round" fill="none">${crystal.join('')}</g>
  <circle cx="${cx}" cy="${cy}" r="4.5" fill="#ffffff"/>

  ${outPaths}

  ${particles}

  <text x="72" y="96" class="mono" font-size="16" fill-opacity="0.6">FIG. YUKI  ·  2019–2022</text>
  <text x="72" y="924" class="mono" font-size="18" fill-opacity="0.85">CAPTURE → FILTER → RENDER</text>
  <text x="1528" y="924" class="mono" font-size="15" fill-opacity="0.55" text-anchor="end">Obj-C ⇄ Swift  ·  CocoaPods  ·  Jenkins CI</text>
  <text x="${cx}" y="${cy + R + 78}" class="mono" font-size="15" fill-opacity="0.6" text-anchor="middle">雪 · YUKI</text>
</svg>
`;

fs.writeFileSync(process.argv[2], svg);
console.log('wrote', process.argv[2], svg.length, 'bytes');
