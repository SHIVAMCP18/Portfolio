// Ink & Amber — the channel's illustration library.
// Every function returns an SVG string drawn on a 1920x1080 canvas.
// Look: cut-paper shapes, dark ink outlines, offset paper shadows, limited palette.

export const P = {
  paper: '#EFE4CC', paper2: '#E4D5B5', paper3: '#D8C7A2',
  ink: '#2B1D14', ink2: '#5A4330', ink3: '#8A7258',
  amber: '#B8631A', amber2: '#D9892E', amber3: '#F0B35A',
  mol: '#3E1E0C', mol2: '#5C2D12', mol3: '#7A3E17',
  brick: '#A23B2A', brick2: '#C4583F', rose: '#C98A70',
  slate: '#4F6470', slate2: '#6F8792', slate3: '#9DB0B5',
  sky: '#E9DCC0', olive: '#7C7A4A', olive2: '#9A9862', snow: '#F7F1E3',
};

// ---------- tiny utilities ----------
export function rng(seed = 1) {
  return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const f = (n) => Math.round(n * 10) / 10;
export const g = (cls, inner, extra = '') => `<g class="${cls}" ${extra}>${inner}</g>`;
export const S = 'stroke="#2B1D14" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
export const Sthin = 'stroke="#2B1D14" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
export const shadow = 'filter="url(#cut)"';

// shared <defs>, placed once in the document
export function defs() {
  return `<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="cut" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="7" dy="9" stdDeviation="0" flood-color="#2B1D14" flood-opacity="0.22"/></filter>
  <filter id="cutsm" x="-10%" y="-10%" width="130%" height="130%"><feDropShadow dx="4" dy="5" stdDeviation="0" flood-color="#2B1D14" flood-opacity="0.22"/></filter>
  <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="#2B1D14" stroke-width="2.4" stroke-opacity="0.28"/></pattern>
  <pattern id="hatchL" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="9" stroke="#F7F1E3" stroke-width="2" stroke-opacity="0.35"/></pattern>
  <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.2" fill="#2B1D14" fill-opacity="0.18"/></pattern>
  <pattern id="bricks" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10H40M20 0V10M0 10V20M40 10V20" stroke="#2B1D14" stroke-opacity="0.18" stroke-width="2" fill="none"/></pattern>
  <linearGradient id="molg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A3E17"/><stop offset="0.45" stop-color="#4A230E"/><stop offset="1" stop-color="#2E1407"/></linearGradient>
  <linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6D6B4"/><stop offset="1" stop-color="#F2E8D2"/></linearGradient>
  <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A70"/><stop offset="1" stop-color="#EBCF9E"/></linearGradient>
  <linearGradient id="waterg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6F8792"/><stop offset="1" stop-color="#4F6470"/></linearGradient>
  <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F0B35A" stop-opacity="0.9"/><stop offset="1" stop-color="#F0B35A" stop-opacity="0"/></radialGradient>
  </defs></svg>`;
}

// ---------- backgrounds ----------
export const sky = (fill = 'url(#skyg)') => `<rect x="-200" y="-200" width="2320" height="1480" fill="${fill}"/>`;
export function sun(x, y, r = 70, cls = 'sun') {
  let rays = '';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; rays += `<line x1="${f(x + Math.cos(a) * (r + 18))}" y1="${f(y + Math.sin(a) * (r + 18))}" x2="${f(x + Math.cos(a) * (r + 46))}" y2="${f(y + Math.sin(a) * (r + 46))}" stroke="${P.amber2}" stroke-width="7" stroke-linecap="round"/>`; }
  return g(cls, `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${P.amber3}" ${S}/>`, ``);
}
export function cloud(x, y, s = 1, cls = 'cloud') {
  return g(cls, `<path d="M${x} ${y}c${-60 * s} 0 ${-70 * s} ${-60 * s} ${-10 * s} ${-62 * s}c${10 * s} ${-50 * s} ${90 * s} ${-55 * s} ${110 * s} ${-12 * s}c${30 * s} ${-35 * s} ${100 * s} ${-20 * s} ${95 * s} ${30 * s}c${55 * s} ${0} ${60 * s} ${44 * s} ${10 * s} ${44 * s}z" fill="${P.snow}" ${S} ${shadow}/>`);
}
export function ground(y, fill = P.paper3, cls = 'ground') {
  return g(cls, `<rect x="-200" y="${y}" width="2320" height="${1280 - y}" fill="${fill}" ${S}/><rect x="-200" y="${y}" width="2320" height="${1280 - y}" fill="url(#dots)"/>`);
}
export function snowbank(x, y, w, cls = 'snowbank') {
  return g(cls, `<path d="M${x} ${y}q${w * 0.15} ${-38} ${w * 0.3} ${-10}q${w * 0.2} ${-40} ${w * 0.4} ${-6}q${w * 0.2} ${-30} ${w * 0.3} ${16}z" fill="${P.snow}" ${Sthin}/>`);
}
export function water(y, h = 400, cls = 'water', fill = 'url(#waterg)') {
  let lines = '';
  for (let i = 0; i < 6; i++) {
    const yy = y + 30 + i * (h / 6); let d = `M-300 ${yy}`;
    for (let x = -300; x < 2300; x += 80) d += `q20 -12 40 0t40 0`;
    lines += `<path class="ripple r${i % 2}" d="${d}" stroke="${P.slate3}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
  }
  return g(cls, `<rect x="-200" y="${y}" width="2320" height="${h + 200}" fill="${fill}" ${S}/>${lines}`);
}

// ---------- city ----------
export function rowhouse(x, base, w, h, color, r, opts = {}) {
  const floors = Math.max(2, Math.round(h / 95));
  const cols = Math.max(2, Math.round(w / 70));
  let win = '';
  for (let fl = 0; fl < floors; fl++) for (let c = 0; c < cols; c++) {
    const wx = x + (w / cols) * c + (w / cols - 26) / 2, wy = base - h + 30 + fl * ((h - 40) / floors);
    if (fl === floors - 1 && c === Math.floor(cols / 2)) continue;
    const lit = r() < 0.15 ? P.amber3 : P.ink2;
    win += `<rect x="${f(wx)}" y="${f(wy)}" width="26" height="40" fill="${lit}" ${Sthin}/>`;
  }
  const dx = x + w / 2 - 18;
  const roof = opts.gable ? `<path d="M${x - 6} ${base - h}L${x + w / 2} ${base - h - w * 0.32}L${x + w + 6} ${base - h}z" fill="${P.ink2}" ${S}/>` : `<rect x="${x - 8}" y="${base - h - 14}" width="${w + 16}" height="16" fill="${P.ink2}" ${S}/>`;
  return `<g class="house"><rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${color}" ${S}/><rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="url(#bricks)"/>${roof}${win}<rect x="${f(dx)}" y="${base - 58}" width="36" height="58" fill="${P.ink}" ${Sthin}/></g>`;
}
export function skyline(x0, x1, base, seed = 3, opts = {}) {
  const r = rng(seed); let out = ''; let x = x0;
  const cols = opts.colors || [P.brick, P.brick2, P.rose, P.amber2, P.slate2, P.olive2];
  while (x < x1) {
    const w = 120 + r() * 110, h = (opts.minH || 190) + r() * (opts.varH || 170);
    out += rowhouse(x, base, w, h, cols[Math.floor(r() * cols.length)], r, { gable: r() < 0.35 });
    x += w + 6;
  }
  return g(opts.cls || 'skyline', out, shadow);
}
export function steeple(x, base, s = 1, cls = 'steeple') {
  return g(cls, `<rect x="${x - 50 * s}" y="${base - 260 * s}" width="${100 * s}" height="${260 * s}" fill="${P.brick}" ${S}/><rect x="${x - 50 * s}" y="${base - 260 * s}" width="${100 * s}" height="${260 * s}" fill="url(#bricks)"/>
  <rect x="${x - 34 * s}" y="${base - 340 * s}" width="${68 * s}" height="${80 * s}" fill="${P.snow}" ${S}/><rect x="${x - 26 * s}" y="${base - 410 * s}" width="${52 * s}" height="${70 * s}" fill="${P.snow}" ${S}/>
  <path d="M${x - 22 * s} ${base - 410 * s}L${x} ${base - 560 * s}L${x + 22 * s} ${base - 410 * s}z" fill="${P.ink2}" ${S}/><rect x="${x - 14 * s}" y="${base - 230 * s}" width="${28 * s}" height="${60 * s}" rx="${14 * s}" fill="${P.ink}" />`, shadow);
}

// the molasses tank
export function tank(cx, base, w = 420, h = 260, o = {}) {
  const x = cx - w / 2, ry = w * 0.09;
  const paint = o.paint || P.slate2;
  let rivets = '';
  const rows = 6;
  for (let i = 1; i < rows; i++) { const y = base - (h / rows) * i; rivets += `<path d="M${x} ${f(y)}Q${cx} ${f(y + ry * 0.9)} ${x + w} ${f(y)}" stroke="${P.ink}" stroke-width="2.5" fill="none" stroke-dasharray="2 9" stroke-linecap="round"/>`; }
  for (let i = 1; i < 6; i++) { const xx = x + (w / 6) * i; rivets += `<line x1="${f(xx)}" y1="${base - h + ry * 0.5}" x2="${f(xx)}" y2="${base + ry * 0.4}" stroke="${P.ink}" stroke-width="2" stroke-opacity="0.45"/>`; }
  let leaks = '';
  if (o.leaks) {
    const r = rng(o.seed || 5);
    for (let i = 0; i < (o.leaks === true ? 7 : o.leaks); i++) {
      const lx = x + w * (0.12 + r() * 0.76), ly = base - h * (0.25 + r() * 0.6), len = 40 + r() * 90;
      leaks += `<path class="leak" d="M${f(lx)} ${f(ly)}q4 ${f(len * 0.5)} 0 ${f(len)}q-3 8 3 10" stroke="${P.mol2}" stroke-width="7" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><circle class="drip" cx="${f(lx + 3)}" cy="${f(ly + len + 12)}" r="6" fill="${P.mol2}"/>`;
    }
  }
  let cracks = '';
  if (o.cracks) cracks = `<path class="crack" d="M${cx - 40} ${base}l18 -60l-22 -40l30 -50l-14 -40l26 -46" stroke="${P.ink}" stroke-width="5" fill="none" pathLength="1" stroke-dasharray="1 1" stroke-linecap="round"/><path class="crack" d="M${cx - 22} ${base - 100}l-46 -22l-30 18" stroke="${P.ink}" stroke-width="4" fill="none" pathLength="1" stroke-dasharray="1 1"/>`;
  return g(o.cls || 'tank', `
    <path d="M${x} ${base - h}V${base}A${w / 2} ${ry} 0 0 0 ${x + w} ${base}V${base - h}" fill="${paint}" ${S}/>
    <path d="M${x + w * 0.72} ${base - h}V${base + ry * 0.7}A${w / 2} ${ry} 0 0 0 ${x + w} ${base}V${base - h}z" fill="url(#hatch)"/>
    <rect x="${x + w * 0.1}" y="${base - h + ry}" width="${w * 0.06}" height="${h - ry * 1.2}" fill="#fff" opacity="0.18"/>
    ${rivets}${leaks}${cracks}
    <ellipse cx="${cx}" cy="${base - h}" rx="${w / 2}" ry="${ry}" fill="${o.top || P.slate3}" ${S}/>
    <ellipse cx="${cx}" cy="${base - h}" rx="${w / 2 - 18}" ry="${ry - 6}" fill="none" stroke="${P.ink}" stroke-width="2" stroke-dasharray="2 9"/>
    <rect x="${cx - 18}" y="${base - h - ry - 4}" width="36" height="10" fill="${P.ink2}" ${Sthin}/>
  `, `${shadow}`);
}

// elevated railway girders + optional train
export function elevated(x0, x1, deckY, groundY, cls = 'el') {
  let posts = '';
  for (let x = x0; x <= x1; x += 160) {
    posts += `<g class="post"><rect x="${x - 10}" y="${deckY}" width="20" height="${groundY - deckY}" fill="${P.ink2}" ${Sthin}/><path d="M${x - 10} ${deckY + 20}L${x + 150} ${deckY + 90}M${x + 170} ${deckY + 20}L${x + 10} ${deckY + 90}" stroke="${P.ink2}" stroke-width="6"/></g>`;
  }
  return g(cls, `${posts}<rect x="${x0 - 40}" y="${deckY - 34}" width="${x1 - x0 + 80}" height="40" fill="${P.ink2}" ${S}/><rect x="${x0 - 40}" y="${deckY - 34}" width="${x1 - x0 + 80}" height="40" fill="url(#hatch)"/>`, shadow);
}
export function trainCar(x, y, w = 360, cls = 'train', color = P.olive) {
  let win = '';
  for (let i = 0; i < Math.floor(w / 60); i++) win += `<rect x="${x + 22 + i * 60}" y="${y - 82}" width="38" height="34" fill="${P.amber3}" ${Sthin}/>`;
  return g(cls, `<rect x="${x}" y="${y - 110}" width="${w}" height="100" rx="10" fill="${color}" ${S}/>${win}<path d="M${x - 6} ${y - 110}h${w + 12}l-12 -18h${-w + 12}z" fill="${P.ink2}" ${S}/><circle cx="${x + 50}" cy="${y - 6}" r="12" fill="${P.ink}"/><circle cx="${x + w - 50}" cy="${y - 6}" r="12" fill="${P.ink}"/>`);
}

// ---------- people & things ----------
// pose: stand | walk | run | arms (raised) | sit
export function person(x, y, s = 1, o = {}) {
  const coat = o.coat || P.slate, skin = o.skin || '#E2B48C', hat = o.hat ?? 'cap', h = o.child ? 0.72 : 1;
  const k = s * h;
  const legs = o.pose === 'run'
    ? `<path d="M${x - 8 * k} ${y - 60 * k}L${x - 34 * k} ${y - 4 * k}M${x + 8 * k} ${y - 60 * k}L${x + 30 * k} ${y - 18 * k}L${x + 44 * k} ${y - 2 * k}" stroke="${P.ink}" stroke-width="${13 * k}" stroke-linecap="round" fill="none"/>`
    : o.pose === 'sit' ? `<path d="M${x - 10 * k} ${y - 46 * k}h${34 * k}v${40 * k}M${x + 4 * k} ${y - 46 * k}h${32 * k}v${40 * k}" stroke="${P.ink}" stroke-width="${12 * k}" stroke-linecap="round" fill="none"/>`
    : `<path d="M${x - 10 * k} ${y - 60 * k}L${x - 12 * k} ${y}M${x + 10 * k} ${y - 60 * k}L${x + 12 * k} ${y}" stroke="${P.ink}" stroke-width="${13 * k}" stroke-linecap="round" fill="none"/>`;
  const body = o.skirt
    ? `<path d="M${x - 26 * k} ${y - 112 * k}h${52 * k}l${12 * k} ${92 * k}h${-76 * k}z" fill="${coat}" ${S}/>`
    : `<path d="M${x - 28 * k} ${y - 120 * k}h${56 * k}l${4 * k} ${66 * k}h${-64 * k}z" fill="${coat}" ${S}/>`;
  const arms = o.pose === 'arms'
    ? `<path d="M${x - 24 * k} ${y - 112 * k}L${x - 52 * k} ${y - 170 * k}M${x + 24 * k} ${y - 112 * k}L${x + 52 * k} ${y - 170 * k}" stroke="${coat}" stroke-width="${15 * k}" stroke-linecap="round"/>`
    : o.pose === 'run' ? `<path d="M${x - 22 * k} ${y - 108 * k}L${x - 46 * k} ${y - 78 * k}M${x + 22 * k} ${y - 110 * k}L${x + 48 * k} ${y - 128 * k}" stroke="${coat}" stroke-width="${15 * k}" stroke-linecap="round"/>`
    : `<path d="M${x - 26 * k} ${y - 112 * k}L${x - 32 * k} ${y - 62 * k}M${x + 26 * k} ${y - 112 * k}L${x + 32 * k} ${y - 62 * k}" stroke="${coat}" stroke-width="${15 * k}" stroke-linecap="round"/>`;
  const hy = y - 146 * k;
  const hats = {
    cap: `<path d="M${x - 24 * k} ${hy - 6 * k}q${24 * k} ${-34 * k} ${48 * k} 0l${10 * k} ${4 * k}z" fill="${P.ink2}" ${Sthin}/>`,
    bowler: `<path d="M${x - 20 * k} ${hy - 8 * k}q${20 * k} ${-42 * k} ${40 * k} 0z" fill="${P.ink}" ${Sthin}/><rect x="${x - 30 * k}" y="${hy - 10 * k}" width="${60 * k}" height="${6 * k}" rx="3" fill="${P.ink}"/>`,
    sailor: `<rect x="${x - 26 * k}" y="${hy - 22 * k}" width="${52 * k}" height="${14 * k}" rx="4" fill="${P.snow}" ${Sthin}/>`,
    bonnet: `<path d="M${x - 28 * k} ${hy + 10 * k}q${-2 * k} ${-46 * k} ${28 * k} ${-46 * k}q${30 * k} 0 ${28 * k} ${46 * k}" fill="${o.hatColor || P.brick}" ${Sthin}/>`,
    helmet: `<path d="M${x - 30 * k} ${hy - 4 * k}q${30 * k} ${-50 * k} ${60 * k} 0z" fill="${P.brick}" ${Sthin}/>`,
    gcap: `<path d="M${x - 24 * k} ${hy - 4 * k}l${8 * k} ${-18 * k}h${32 * k}l${8 * k} ${18 * k}z" fill="${P.snow}" ${Sthin}/>`,
    turban: `<path d="M${x - 26 * k} ${hy - 2 * k}q${-4 * k} ${-30 * k} ${26 * k} ${-34 * k}q${30 * k} ${4 * k} ${26 * k} ${34 * k}z" fill="${o.hatColor || P.brick}" ${Sthin}/><path d="M${x - 20 * k} ${hy - 14 * k}q${20 * k} ${-12 * k} ${40 * k} 0" stroke="${P.ink}" stroke-width="2" fill="none" opacity="0.5"/>`,
    pith: `<path d="M${x - 34 * k} ${hy - 2 * k}q${34 * k} ${-56 * k} ${68 * k} 0z" fill="${P.paper2}" ${Sthin}/><rect x="${x - 38 * k}" y="${hy - 6 * k}" width="${76 * k}" height="${7 * k}" rx="3" fill="${P.paper2}" ${Sthin}/>`,
    sari: `<path d="M${x - 30 * k} ${hy + 22 * k}q${-4 * k} ${-58 * k} ${30 * k} ${-58 * k}q${34 * k} 0 ${30 * k} ${58 * k}" fill="${o.hatColor || P.amber2}" ${Sthin}/>`,
    none: '',
  };
  const head = `<circle cx="${x}" cy="${hy + 6 * k}" r="${22 * k}" fill="${skin}" ${S}/>`;
  const extra = o.glasses ? `<circle cx="${x - 8 * k}" cy="${hy + 6 * k}" r="${6 * k}" fill="none" ${Sthin}/><circle cx="${x + 8 * k}" cy="${hy + 6 * k}" r="${6 * k}" fill="none" ${Sthin}/>` : '';
  return g(o.cls || 'person', `${legs}${body}${arms}${head}${extra}${hats[hat] || ''}`, ``);
}
export function horseCart(x, y, s = 1, cls = 'cart') {
  return g(cls, `<path d="M${x} ${y - 70 * s}h${110 * s}l${30 * s} ${-40 * s}l${18 * s} ${8 * s}l${-14 * s} ${40 * s}v${10 * s}h${-12 * s}l${-6 * s} ${40 * s}M${x + 10 * s} ${y - 70 * s}v${70 * s}M${x + 96 * s} ${y - 66 * s}v${66 * s}" stroke="${P.ink}" stroke-width="${12 * s}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M${x - 10 * s} ${y - 92 * s}h${130 * s}v${30 * s}h${-130 * s}z" fill="${P.ink2}" ${Sthin}/>
  <rect x="${x - 230 * s}" y="${y - 120 * s}" width="${200 * s}" height="${70 * s}" fill="${P.amber2}" ${S}/><circle cx="${x - 180 * s}" cy="${y - 36 * s}" r="${34 * s}" fill="${P.paper}" ${S}/><circle cx="${x - 80 * s}" cy="${y - 36 * s}" r="${34 * s}" fill="${P.paper}" ${S}/>`, `${shadow}`);
}
export function barrel(x, y, s = 1, cls = 'barrel', fill = P.amber) {
  return g(cls, `<path d="M${x - 40 * s} ${y - 110 * s}q${-12 * s} ${55 * s} 0 ${110 * s}h${80 * s}q${12 * s} ${-55 * s} 0 ${-110 * s}z" fill="${fill}" ${S}/><path d="M${x - 46 * s} ${y - 80 * s}h${92 * s}M${x - 46 * s} ${y - 30 * s}h${92 * s}" stroke="${P.ink}" stroke-width="${6 * s}"/><ellipse cx="${x}" cy="${y - 110 * s}" rx="${40 * s}" ry="${10 * s}" fill="${P.amber2}" ${Sthin}/>`, `${shadow}`);
}
export function ship(x, y, s = 1, o = {}) {
  const hull = o.hull || P.ink2;
  const steam = `<rect x="${x - 20 * s}" y="${y - 190 * s}" width="${50 * s}" height="${110 * s}" fill="${P.brick}" ${S}/><rect x="${x - 20 * s}" y="${y - 190 * s}" width="${50 * s}" height="20" fill="${P.ink}"/><rect x="${x - 150 * s}" y="${y - 90 * s}" width="${260 * s}" height="${50 * s}" fill="${P.snow}" ${S}/>`;
  const sail = `<line x1="${x - 60 * s}" y1="${y - 40 * s}" x2="${x - 60 * s}" y2="${y - 330 * s}" ${S}/><line x1="${x + 70 * s}" y1="${y - 40 * s}" x2="${x + 70 * s}" y2="${y - 300 * s}" ${S}/><path d="M${x - 140 * s} ${y - 300 * s}h${160 * s}l-${10 * s} ${100 * s}h-${140 * s}zM${x - 130 * s} ${y - 190 * s}h${140 * s}l-${6 * s} ${90 * s}h-${128 * s}zM${x + 10 * s} ${y - 270 * s}h${120 * s}l-${8 * s} ${90 * s}h-${104 * s}zM${x + 18 * s} ${y - 170 * s}h${106 * s}l-${6 * s} ${70 * s}h-${94 * s}z" fill="${P.snow}" ${S}/>`;
  return g(o.cls || 'ship', `${o.sail ? sail : steam}<path d="M${x - 230 * s} ${y - 50 * s}h${460 * s}l${-50 * s} ${70 * s}h${-370 * s}z" fill="${hull}" ${S}/><path d="M${x - 220 * s} ${y - 36 * s}h${440 * s}" stroke="${o.stripe || P.amber2}" stroke-width="${8 * s}"/>`, `${shadow}`);
}
export function smoke(x, y, n = 5, cls = 'smoke', s = 1) {
  let out = '';
  for (let i = 0; i < n; i++) out += `<circle class="puff p${i}" cx="${x}" cy="${y}" r="${(22 + i * 6) * s}" fill="${P.paper3}" stroke="${P.ink2}" stroke-width="3" opacity="0"/>`;
  return g(cls, out);
}
export function factory(x, base, s = 1, cls = 'factory') {
  let teeth = '';
  for (let i = 0; i < 4; i++) teeth += `<path d="M${x + i * 110 * s} ${base - 220 * s}l${110 * s} ${-70 * s}v${70 * s}z" fill="${P.ink2}" ${S}/>`;
  let win = '';
  for (let i = 0; i < 6; i++) win += `<rect x="${x + 24 * s + i * 70 * s}" y="${base - 170 * s}" width="${40 * s}" height="${60 * s}" fill="${P.amber3}" ${Sthin}/>`;
  return g(cls, `<rect x="${x + 330 * s}" y="${base - 420 * s}" width="${50 * s}" height="${200 * s}" fill="${P.brick}" ${S}/><rect x="${x + 250 * s}" y="${base - 380 * s}" width="${44 * s}" height="${160 * s}" fill="${P.brick}" ${S}/>${teeth}<rect x="${x}" y="${base - 220 * s}" width="${440 * s}" height="${220 * s}" fill="${P.brick2}" ${S}/><rect x="${x}" y="${base - 220 * s}" width="${440 * s}" height="${220 * s}" fill="url(#bricks)"/>${win}<rect x="${x + 190 * s}" y="${base - 80 * s}" width="${60 * s}" height="${80 * s}" fill="${P.ink}"/>`, shadow);
}
export function shell(x, y, s = 1, cls = 'shell') {
  return g(cls, `<path d="M${x - 30 * s} ${y}v${-140 * s}q${0} ${-70 * s} ${30 * s} ${-110 * s}q${30 * s} ${40 * s} ${30 * s} ${110 * s}v${140 * s}z" fill="${P.amber2}" ${S}/><rect x="${x - 34 * s}" y="${y - 50 * s}" width="${68 * s}" height="${50 * s}" fill="${P.amber}" ${S}/><path d="M${x - 30 * s} ${y - 150 * s}h${60 * s}" stroke="${P.ink}" stroke-width="${5 * s}"/>`, `${shadow}`);
}
export function bottle(x, y, s = 1, cls = 'bottle') {
  return g(cls, `<path d="M${x - 14 * s} ${y - 170 * s}h${28 * s}v${40 * s}q${30 * s} ${16 * s} ${30 * s} ${50 * s}v${80 * s}h${-88 * s}v${-80 * s}q0 ${-34 * s} ${30 * s} ${-50 * s}z" fill="${P.mol3}" ${S}/><rect x="${x - 34 * s}" y="${y - 70 * s}" width="${68 * s}" height="${50 * s}" fill="${P.paper}" ${Sthin}/><rect x="${x - 16 * s}" y="${y - 186 * s}" width="${32 * s}" height="${18 * s}" fill="${P.ink2}" ${Sthin}/>`, `${shadow}`);
}
export function caneStalks(x, y, s = 1, cls = 'cane') {
  let out = '';
  for (let i = 0; i < 6; i++) { const xx = x + i * 36 * s; out += `<path d="M${xx} ${y}v${-220 * s - (i % 3) * 30 * s}" stroke="${P.olive}" stroke-width="${14 * s}" stroke-linecap="round"/><path d="M${xx} ${y - 120 * s}q${40 * s} ${-30 * s} ${70 * s} ${-10 * s}M${xx} ${y - 190 * s}q${-40 * s} ${-30 * s} ${-70 * s} ${-6 * s}" stroke="${P.olive2}" stroke-width="${8 * s}" fill="none" stroke-linecap="round"/>`; }
  return g(cls, out, shadow);
}

// ---------- molasses ----------
// big wave travelling right; front at x, crest height h above baseY
export function molassesWave(x, baseY, h, cls = 'wave') {
  const d = `M-900 ${baseY}V${baseY - h * 0.55}C-500 ${baseY - h * 0.75} ${x - 520} ${baseY - h * 1.05} ${x - 180} ${baseY - h}C${x - 20} ${baseY - h * 0.98} ${x + 60} ${baseY - h * 0.8} ${x + 40} ${baseY - h * 0.58}C${x + 20} ${baseY - h * 0.42} ${x - 80} ${baseY - h * 0.5} ${x - 60} ${baseY - h * 0.62}C${x - 30} ${baseY - h * 0.45} ${x + 120} ${baseY - h * 0.25} ${x + 140} ${baseY}z`;
  const gloss = `M${x - 600} ${baseY - h * 0.82}C${x - 420} ${baseY - h * 0.97} ${x - 240} ${baseY - h * 0.99} ${x - 140} ${baseY - h * 0.92}`;
  let drops = '';
  for (let i = 0; i < 6; i++) drops += `<circle class="drop" cx="${x + 20 + i * 18}" cy="${baseY - h * (0.6 + (i % 3) * 0.12)}" r="${9 + (i % 3) * 4}" fill="${P.mol2}" ${Sthin}/>`;
  return g(cls, `<path d="${d}" fill="url(#molg)" ${S}/><path d="${gloss}" stroke="${P.amber3}" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.7"/><path d="M${x - 700} ${baseY - h * 0.5}C${x - 500} ${baseY - h * 0.6} ${x - 300} ${baseY - h * 0.55} ${x - 200} ${baseY - h * 0.45}" stroke="${P.amber}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.6"/>${drops}`);
}
export function flood(y, cls = 'flood', x0 = -200, x1 = 2120) {
  let gl = '';
  for (let i = 0; i < 8; i++) gl += `<path class="gloss" d="M${x0 + 60 + i * 260} ${y + 30 + (i % 3) * 30}q60 -14 120 0" stroke="${P.amber3}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.55"/>`;
  return g(cls, `<path d="M${x0} ${y}q240 -26 480 0t480 0t480 0t480 0t480 0V1300H${x0}z" fill="url(#molg)" ${S}/>${gl}`);
}

// ---------- documents, charts, labels ----------
export function label(x, y, text, o = {}) {
  const size = o.size || 44, font = o.font || 'Special Elite', anchor = o.anchor || 'middle';
  const color = o.color || P.ink;
  return `<text class="${o.cls || 'label'}" x="${x}" y="${y}" text-anchor="${anchor}" font-family="${font}" font-weight="${o.weight || 400}" font-size="${size}" fill="${color}" ${o.letter ? `letter-spacing="${o.letter}"` : ''} ${o.extra || ''}>${text}</text>`;
}
export function tag(x, y, text, o = {}) {
  const size = o.size || 34, w = o.w || text.length * size * 0.62 + 50, h = size * 1.7;
  return g(o.cls || 'tag', `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="${o.fill || P.paper}" ${S}/>${label(x, y + size * 0.34, text, { size, font: o.font || 'Special Elite', color: o.color })}`, `${o.noShadow ? '' : 'filter="url(#cutsm)"'}`);
}
export function paperCard(x, y, w, h, inner = '', o = {}) {
  return g(o.cls || 'card', `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || P.snow}" ${S}/>${inner}`, `${shadow}`);
}
export function newspaper(x, y, w, h, mast, head, sub, o = {}) {
  let lines = '';
  const colW = (w - 80) / 3;
  for (let c = 0; c < 3; c++) for (let i = 0; i < Math.floor((h - 330) / 22); i++) lines += `<rect x="${x + 40 + c * (colW + 0)}" y="${y + 300 + i * 22}" width="${colW - 20 - ((i * 7 + c * 3) % 5) * 8}" height="7" fill="${P.ink}" opacity="0.35"/>`;
  return paperCard(x, y, w, h, `${label(x + w / 2, y + 70, mast, { font: 'Playfair Display', weight: 900, size: 54 })}<line x1="${x + 30}" y1="${y + 92}" x2="${x + w - 30}" y2="${y + 92}" stroke="${P.ink}" stroke-width="3"/><line x1="${x + 30}" y1="${y + 100}" x2="${x + w - 30}" y2="${y + 100}" stroke="${P.ink}" stroke-width="1.5"/>${label(x + w / 2, y + 180, head, { font: 'Oswald', weight: 700, size: o.headSize || 66 })}${label(x + w / 2, y + 240, sub, { font: 'Oswald', weight: 500, size: 32, color: P.ink2 })}${lines}`, { cls: o.cls || 'paper', fill: '#F5EEDC' });
}
export function calendar(x, y, month, day, year, o = {}) {
  return paperCard(x, y, 300, 340, `<rect x="${x}" y="${y}" width="300" height="80" fill="${P.brick}" ${S}/>${label(x + 150, y + 56, month, { font: 'Oswald', weight: 700, size: 44, color: P.snow, letter: 4 })}${label(x + 150, y + 225, day, { font: 'Playfair Display', weight: 900, size: 150 })}${label(x + 150, y + 305, year, { font: 'Special Elite', size: 40, color: P.ink2 })}<circle cx="${x + 70}" cy="${y}" r="10" fill="${P.ink}"/><circle cx="${x + 230}" cy="${y}" r="10" fill="${P.ink}"/>`, { cls: o.cls || 'calendar' });
}
export function thermometer(x, y, h, o = {}) {
  let ticks = '';
  for (let i = 0; i <= 10; i++) ticks += `<line x1="${x + 34}" y1="${y + 30 + (h - 60) * i / 10}" x2="${x + (i % 5 ? 50 : 62)}" y2="${y + 30 + (h - 60) * i / 10}" stroke="${P.ink}" stroke-width="3"/>`;
  return g(o.cls || 'thermo', `<rect x="${x - 30}" y="${y}" width="60" height="${h}" rx="30" fill="${P.snow}" ${S}/><circle cx="${x}" cy="${y + h + 20}" r="48" fill="${P.brick}" ${S}/><rect class="merc" x="${x - 14}" y="${y + 30}" width="28" height="${h - 10}" rx="14" fill="${P.brick}"/>${ticks}`, shadow);
}
export function clock(x, y, r = 110, cls = 'clock') {
  let t = '';
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; t += `<line x1="${f(x + Math.cos(a) * r * 0.78)}" y1="${f(y + Math.sin(a) * r * 0.78)}" x2="${f(x + Math.cos(a) * r * 0.9)}" y2="${f(y + Math.sin(a) * r * 0.9)}" stroke="${P.ink}" stroke-width="6"/>`; }
  return g(cls, `<circle cx="${x}" cy="${y}" r="${r}" fill="${P.snow}" ${S}/>${t}<line class="hour" x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.5}" stroke="${P.ink}" stroke-width="10" stroke-linecap="round"/><line class="minute" x1="${x}" y1="${y}" x2="${x}" y2="${y - r * 0.75}" stroke="${P.brick}" stroke-width="7" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="10" fill="${P.ink}"/>`, `${shadow}`);
}
export function stamp(x, y, text, o = {}) {
  const size = o.size || 60, w = text.length * size * 0.66 + 60;
  return g(o.cls || 'stamp', `<g transform="rotate(${o.rot ?? -8} ${x} ${y})" opacity="0.92"><rect x="${x - w / 2}" y="${y - size}" width="${w}" height="${size * 1.5}" fill="none" stroke="${o.color || P.brick}" stroke-width="8" rx="8"/>${label(x, y + size * 0.15, text, { font: 'Oswald', weight: 700, size, color: o.color || P.brick, letter: 3 })}</g>`);
}
export function cross(x, y, s = 120, cls = 'xmark') {
  return g(cls, `<path d="M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}" stroke="${P.brick}" stroke-width="26" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>`);
}
export function bomb(x, y, s = 1, cls = 'bomb') {
  return g(cls, `<circle cx="${x}" cy="${y}" r="${90 * s}" fill="${P.ink}" ${S}/><rect x="${x - 26 * s}" y="${y - 118 * s}" width="${52 * s}" height="${36 * s}" fill="${P.ink2}" ${S}/><path d="M${x} ${y - 118 * s}q${30 * s} ${-60 * s} ${80 * s} ${-40 * s}" stroke="${P.ink2}" stroke-width="${8 * s}" fill="none"/><circle class="spark" cx="${x + 82 * s}" cy="${y - 158 * s}" r="${18 * s}" fill="${P.amber3}"/><path d="M${x - 50 * s} ${y - 40 * s}q${20 * s} ${-30 * s} ${50 * s} ${-36 * s}" stroke="#fff" stroke-width="${10 * s}" fill="none" opacity="0.3" stroke-linecap="round"/>`, `${shadow}`);
}
export function gavel(x, y, s = 1, cls = 'gavel') {
  return g(cls, `<rect x="${x - 10 * s}" y="${y - 20 * s}" width="${200 * s}" height="${22 * s}" rx="8" fill="${P.amber}" ${S} transform="rotate(-30 ${x} ${y})"/><rect x="${x - 60 * s}" y="${y - 70 * s}" width="${120 * s}" height="${60 * s}" rx="12" fill="${P.mol3}" ${S} transform="rotate(-30 ${x} ${y})"/>`, ``);
}
export function moneyStack(x, y, n = 5, s = 1, cls = 'money') {
  let out = '';
  for (let i = 0; i < n; i++) out += `<g class="bill b${i}"><rect x="${x - 110 * s}" y="${y - (i + 1) * 30 * s}" width="${220 * s}" height="${30 * s}" fill="${P.olive2}" ${Sthin}/><circle cx="${x}" cy="${y - (i + 0.5) * 30 * s}" r="${10 * s}" fill="${P.olive}"/></g>`;
  return g(cls, out, shadow);
}
export function document(x, y, w, h, o = {}) {
  let lines = '';
  for (let i = 0; i < Math.floor((h - 120) / 30); i++) lines += `<rect x="${x + 40}" y="${y + 100 + i * 30}" width="${w - 80 - (i % 4) * 30}" height="8" fill="${P.ink}" opacity="0.3"/>`;
  return paperCard(x, y, w, h, `${o.title ? label(x + w / 2, y + 64, o.title, { font: o.font || 'Playfair Display', weight: 700, size: o.size || 38 }) : ''}${lines}${o.inner || ''}`, { cls: o.cls || 'doc', fill: o.fill || '#F5EEDC' });
}
export function blueprint(x, y, w, h, o = {}) {
  const inner = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.slate}"/><g stroke="#E6EEF0" stroke-width="3" fill="none" opacity="0.85"><path d="M${x + w * 0.3} ${y + h * 0.2}h${w * 0.4}v${h * 0.55}h${-w * 0.4}z"/><ellipse cx="${x + w * 0.5}" cy="${y + h * 0.2}" rx="${w * 0.2}" ry="${h * 0.05}"/><path d="M${x + w * 0.22} ${y + h * 0.2}v${h * 0.55}M${x + w * 0.2} ${y + h * 0.2}h${w * 0.04}M${x + w * 0.2} ${y + h * 0.75}h${w * 0.04}M${x + w * 0.3} ${y + h * 0.85}h${w * 0.4}" stroke-dasharray="${o.dash || '0'}"/></g><g stroke="#E6EEF0" stroke-opacity="0.18" stroke-width="1.5">${Array.from({ length: 12 }, (_, i) => `<line x1="${x + (w / 12) * i}" y1="${y}" x2="${x + (w / 12) * i}" y2="${y + h}"/>`).join('')}</g>${o.inner || ''}`;
  return paperCard(x, y, w, h, inner, { cls: o.cls || 'blueprint', fill: P.slate });
}
export function bars(x, base, items, o = {}) {
  // items: [{label, value, color, cls}]
  const bw = o.bw || 180, gap = o.gap || 120, max = Math.max(...items.map((i) => i.value)), H = o.h || 420;
  return items.map((it, i) => {
    const bx = x + i * (bw + gap), bh = (it.value / max) * H;
    return g(`bar ${it.cls || ''}`, `<rect x="${bx}" y="${base - bh}" width="${bw}" height="${bh}" fill="${it.color}" ${S} ${shadow}/>${label(bx + bw / 2, base + 64, it.label, { font: 'Oswald', weight: 700, size: 40 })}${it.note ? label(bx + bw / 2, base - bh - 26, it.note, { size: 36 }) : ''}`, ``);
  }).join('');
}
export function tree(x, base, s = 1, cls = 'tree') {
  return g(cls, `<path d="M${x} ${base}v${-150 * s}M${x} ${base - 90 * s}l${-50 * s} ${-60 * s}M${x} ${base - 120 * s}l${46 * s} ${-56 * s}M${x - 30 * s} ${base - 126 * s}l${-14 * s} ${-40 * s}M${x} ${base - 150 * s}l${10 * s} ${-50 * s}" stroke="${P.ink2}" stroke-width="${12 * s}" stroke-linecap="round" fill="none"/>`);
}
export function bird(x, y, s = 1, cls = 'bird') {
  return `<path class="${cls}" d="M${x - 22 * s} ${y}q${11 * s} ${-14 * s} ${22 * s} 0q${11 * s} ${-14 * s} ${22 * s} 0" stroke="${P.ink}" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>`;
}
// chapter card, full frame
export function chapterCard(num, title) {
  return `${sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.3"/>
  ${label(960, 430, `CHAPTER ${num}`, { font: 'Oswald', weight: 500, size: 52, color: P.amber3, letter: 14, cls: 'chap-num' })}
  <line class="chap-rule" x1="660" y1="480" x2="1260" y2="480" stroke="${P.amber2}" stroke-width="4"/>
  ${label(960, 620, title, { font: 'Playfair Display', weight: 900, size: 132, color: P.snow, cls: 'chap-title' })}`;
}
