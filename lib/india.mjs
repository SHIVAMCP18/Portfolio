// Ink & Amber — extra pieces for stories set in South Asia.
import { P, g, S, Sthin, shadow, label, person } from './inkamber.mjs';
export const SKIN = ['#B07A52', '#9C6942', '#C48E62', '#8C5C3A', '#B98458'];

// Gandhi: bald, round glasses, white shawl and dhoti, walking stick. pose: walk | stand | bend
export function gandhi(x, y, s = 1, o = {}) {
  const k = s, skin = '#B98458';
  const bend = o.pose === 'bend';
  const lean = bend ? 28 : 0;
  const stick = o.pose === 'bend' ? '' : `<path d="M${x + 44 * k} ${y - 120 * k}L${x + 58 * k} ${y}" stroke="${P.ink2}" stroke-width="${8 * k}" stroke-linecap="round"/>`;
  const legs = o.pose === 'walk'
    ? `<path d="M${x - 8 * k} ${y - 56 * k}L${x - 26 * k} ${y}M${x + 8 * k} ${y - 56 * k}L${x + 22 * k} ${y}" stroke="${skin}" stroke-width="${9 * k}" stroke-linecap="round"/>`
    : `<path d="M${x - 8 * k} ${y - 56 * k}L${x - 10 * k} ${y}M${x + 8 * k} ${y - 56 * k}L${x + 10 * k} ${y}" stroke="${skin}" stroke-width="${9 * k}" stroke-linecap="round"/>`;
  const dhoti = `<path d="M${x - 26 * k} ${y - 100 * k}h${52 * k}l${6 * k} ${50 * k}h${-64 * k}z" fill="${P.snow}" ${S}/>`;
  const torso = `<g transform="rotate(${lean} ${x} ${y - 96 * k})"><path d="M${x - 22 * k} ${y - 156 * k}h${44 * k}l${4 * k} ${58 * k}h${-52 * k}z" fill="${skin}" ${S}/><path d="M${x - 26 * k} ${y - 160 * k}q${30 * k} ${10 * k} ${52 * k} ${66 * k}l${-18 * k} ${4 * k}q${-14 * k} ${-36 * k} ${-36 * k} ${-50 * k}z" fill="${P.snow}" ${Sthin}/>
    <path d="M${x + 20 * k} ${y - 148 * k}L${x + 44 * k} ${y - (bend ? 70 : 118) * k}" stroke="${skin}" stroke-width="${10 * k}" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y - 182 * k}" r="${24 * k}" fill="${skin}" ${S}/><ellipse cx="${x - 24 * k}" cy="${y - 180 * k}" rx="${5 * k}" ry="${9 * k}" fill="${skin}" ${Sthin}/><ellipse cx="${x + 24 * k}" cy="${y - 180 * k}" rx="${5 * k}" ry="${9 * k}" fill="${skin}" ${Sthin}/>
    <circle cx="${x - 9 * k}" cy="${y - 182 * k}" r="${7 * k}" fill="none" stroke="${P.ink}" stroke-width="${2.5 * k}"/><circle cx="${x + 9 * k}" cy="${y - 182 * k}" r="${7 * k}" fill="none" stroke="${P.ink}" stroke-width="${2.5 * k}"/><line x1="${x - 2 * k}" y1="${y - 182 * k}" x2="${x + 2 * k}" y2="${y - 182 * k}" stroke="${P.ink}" stroke-width="${2 * k}"/>
    <path d="M${x - 6 * k} ${y - 168 * k}q${6 * k} ${4 * k} ${12 * k} 0" stroke="${P.ink}" stroke-width="${2 * k}" fill="none"/>
    ${bend ? `<circle class="mud" cx="${x + 46 * k}" cy="${y - 64 * k}" r="${10 * k}" fill="${P.ink2}" ${Sthin}/>` : ''}</g>`;
  return g(o.cls || 'gandhi', `${stick}${legs}${dhoti}${torso}`);
}
// a marcher in white khadi with a white cap
export function marcher(x, y, s = 1, i = 0, o = {}) {
  return person(x, y, s, { coat: o.coat || P.snow, hat: o.hat || 'gcap', skin: SKIN[i % SKIN.length], pose: o.pose || 'stand', cls: o.cls || 'person m' });
}
export function woman(x, y, s = 1, i = 0, o = {}) {
  const c = [P.amber2, P.brick2, P.olive2, P.rose][i % 4];
  return person(x, y, s, { coat: c, hat: 'sari', hatColor: c, skirt: true, skin: SKIN[(i + 2) % SKIN.length], pose: o.pose, cls: o.cls || 'person w' });
}
export function police(x, y, s = 1, i = 0, o = {}) {
  const lathi = o.raised ? `<path d="M${x + 30 * s} ${y - 120 * s}L${x + 70 * s} ${y - 230 * s}" stroke="${P.ink2}" stroke-width="${9 * s}" stroke-linecap="round"/>` : `<path d="M${x + 34 * s} ${y - 70 * s}L${x + 46 * s} ${y - 170 * s}" stroke="${P.ink2}" stroke-width="${9 * s}" stroke-linecap="round"/>`;
  return g(o.cls || 'police', `${lathi}${person(x, y, s, { coat: '#9A8A5A', hat: 'turban', hatColor: P.brick, skin: SKIN[(i + 1) % SKIN.length] })}`);
}
export function officer(x, y, s = 1, o = {}) { return person(x, y, s, { coat: o.coat || P.ink2, hat: o.hat || 'pith', skin: '#E2B48C', cls: o.cls || 'person officer' }); }
export function hut(x, base, s = 1, cls = 'hut', wall = P.amber3) {
  return g(cls, `<rect x="${x}" y="${base - 120 * s}" width="${170 * s}" height="${120 * s}" fill="${wall}" ${S}/><path d="M${x - 24 * s} ${base - 110 * s}L${x + 85 * s} ${base - 200 * s}L${x + 194 * s} ${base - 110 * s}z" fill="${P.olive}" ${S}/><path d="M${x + 10 * s} ${base - 140 * s}l${30 * s} ${-26 * s}M${x + 60 * s} ${base - 150 * s}l${30 * s} ${-26 * s}M${x + 110 * s} ${base - 140 * s}l${30 * s} ${-20 * s}" stroke="${P.ink}" stroke-width="3" opacity="0.4"/><rect x="${x + 64 * s}" y="${base - 70 * s}" width="${40 * s}" height="${70 * s}" fill="${P.ink2}" ${Sthin}/>`, shadow);
}
export function palm(x, base, s = 1, cls = 'palm') {
  const top = base - 300 * s, tx = x + 30 * s;
  let fr = '';
  for (const [dx, dy] of [[-120, 20], [-90, -40], [0, -70], [90, -40], [120, 24], [60, 50], [-60, 50]]) fr += `<path d="M${tx} ${top}q${dx * 0.5 * s} ${(dy - 40) * s} ${dx * s} ${dy * s}" stroke="${P.olive}" stroke-width="${16 * s}" fill="none" stroke-linecap="round"/>`;
  return g(cls, `<path d="M${x} ${base}q${10 * s} ${-150 * s} ${30 * s} ${-300 * s}" stroke="${P.ink2}" stroke-width="${18 * s}" fill="none" stroke-linecap="round"/>${fr}`, shadow);
}
export function mangoTree(x, base, s = 1, cls = 'mango') {
  return g(cls, `<rect x="${x - 14 * s}" y="${base - 160 * s}" width="${28 * s}" height="${160 * s}" fill="${P.ink2}" ${Sthin}/><circle cx="${x}" cy="${base - 230 * s}" r="${110 * s}" fill="${P.olive}" ${S}/><circle cx="${x - 80 * s}" cy="${base - 180 * s}" r="${70 * s}" fill="${P.olive}" ${S}/><circle cx="${x + 80 * s}" cy="${base - 185 * s}" r="${72 * s}" fill="${P.olive}" ${S}/>`, shadow);
}
export function beach(seaY, sandY, cls = 'beach') {
  let w = '';
  for (let i = 0; i < 5; i++) { let d = `M-300 ${seaY + 30 + i * ((sandY - seaY) / 5)}`; for (let x = -300; x < 2300; x += 80) d += 'q20 -12 40 0t40 0'; w += `<path class="ripple r${i % 2}" d="${d}" stroke="${P.slate3}" stroke-width="4" fill="none" opacity="0.7"/>`; }
  return g(cls, `<rect x="-200" y="${seaY}" width="2320" height="${sandY - seaY + 40}" fill="url(#waterg)" ${S}/>${w}<path class="foam" d="M-200 ${sandY}q120 -26 240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0" stroke="${P.snow}" stroke-width="10" fill="none"/><path d="M-200 ${sandY}q120 -26 240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0t240 0V1300H-200Z" fill="${P.amber3}" ${S}/><rect x="-200" y="${sandY}" width="2320" height="400" fill="url(#dots)"/>`);
}
export function saltPile(x, base, s = 1, cls = 'salt') {
  return g(cls, `<path d="M${x - 90 * s} ${base}L${x} ${base - 110 * s}L${x + 90 * s} ${base}z" fill="${P.snow}" ${S}/><path d="M${x - 30 * s} ${base - 40 * s}l${16 * s} ${-14 * s}M${x + 20 * s} ${base - 70 * s}l${10 * s} ${-10 * s}M${x + 30 * s} ${base - 20 * s}l${14 * s} ${-12 * s}" stroke="${P.slate3}" stroke-width="4"/>`, shadow);
}
export function saltPans(x, y, w, h, cls = 'pans') {
  let c = '';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) c += `<rect x="${x + i * (w / 4) + 8}" y="${y + j * (h / 2) + 8}" width="${w / 4 - 16}" height="${h / 2 - 16}" fill="${P.slate3}" ${Sthin}/><rect x="${x + i * (w / 4) + 20}" y="${y + j * (h / 2) + 20}" width="${w / 4 - 40}" height="${h / 2 - 40}" fill="${P.snow}" opacity="0.8"/>`;
  return g(cls, `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.amber3}" ${S}/>${c}`, shadow);
}
export function unionFlag(x, y, w = 120, cls = 'uflag') {
  const h = w / 2;
  return g(cls, `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 220}" stroke="${P.ink}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.slate}" ${Sthin}/><path d="M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}" stroke="${P.snow}" stroke-width="${h * 0.22}"/><path d="M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}" stroke="${P.brick}" stroke-width="${h * 0.08}"/><path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="${P.snow}" stroke-width="${h * 0.32}"/><path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="${P.brick}" stroke-width="${h * 0.18}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${Sthin}/>`);
}
export function colonial(x, base, s = 1, cls = 'gov') {
  let cols = '';
  for (let i = 0; i < 6; i++) cols += `<rect x="${x + 40 * s + i * 70 * s}" y="${base - 240 * s}" width="${26 * s}" height="${200 * s}" fill="${P.snow}" ${Sthin}/>`;
  return g(cls, `<path d="M${x + 210 * s} ${base - 300 * s}q${0} ${-110 * s} ${-90 * s} ${-110 * s}h0q${-90 * s} 0 ${-90 * s} ${110 * s}" fill="${P.paper2}" ${S} transform="translate(${90 * s} 0)"/><rect x="${x}" y="${base - 300 * s}" width="${480 * s}" height="${60 * s}" fill="${P.paper2}" ${S}/><path d="M${x - 20 * s} ${base - 300 * s}L${x + 240 * s} ${base - 360 * s}L${x + 500 * s} ${base - 300 * s}z" fill="${P.paper3}" ${S}/>${cols}<rect x="${x}" y="${base - 40 * s}" width="${480 * s}" height="${40 * s}" fill="${P.paper3}" ${S}/>`, shadow);
}
export function camera(x, y, s = 1, cls = 'cam2') {
  return g(cls, `<path d="M${x} ${y}l${-50 * s} ${150 * s}M${x} ${y}v${150 * s}M${x} ${y}l${50 * s} ${150 * s}" stroke="${P.ink2}" stroke-width="${7 * s}"/><rect x="${x - 60 * s}" y="${y - 70 * s}" width="${120 * s}" height="${70 * s}" rx="8" fill="${P.ink}" ${Sthin}/><circle class="reel" cx="${x - 30 * s}" cy="${y - 100 * s}" r="${30 * s}" fill="${P.ink2}" ${Sthin}/><circle class="reel" cx="${x + 30 * s}" cy="${y - 100 * s}" r="${30 * s}" fill="${P.ink2}" ${Sthin}/><rect x="${x + 60 * s}" y="${y - 50 * s}" width="${30 * s}" height="${30 * s}" fill="${P.ink2}" ${Sthin}/>`, shadow);
}
// schematic map of the march (not to scale): sea to the west (left)
export const ROUTE = [
  ['SABARMATI ASHRAM', 1180, 170], ['NADIAD', 1250, 300], ['ANAND', 1230, 380], ['BORSAD', 1170, 450],
  ['ANKLESHWAR', 1120, 610], ['SURAT', 1080, 750], ['NAVSARI', 1050, 860], ['DANDI', 960, 905],
];
export function routeMap(cls = 'rmap') {
  const river = (y, name) => `<path d="M640 ${y + 30}C800 ${y + 10} 1000 ${y + 40} 1500 ${y - 10}" stroke="${P.slate2}" stroke-width="10" fill="none" stroke-linecap="round"/>${label(1560, y - 4, name, { font: 'Oswald', weight: 700, size: 26, color: P.slate, anchor: 'start' })}`;
  const path = 'M' + ROUTE.map((r) => `${r[1]} ${r[2]}`).join('L');
  const dots = ROUTE.map((r, i) => `<g class="stop st${i}"><circle cx="${r[1]}" cy="${r[2]}" r="${i === 0 || i === ROUTE.length - 1 ? 16 : 10}" fill="${i === ROUTE.length - 1 ? P.brick : P.ink}" ${Sthin}/>${label(r[1] + 30, r[2] + 10, r[0], { font: 'Oswald', weight: 700, size: i === 0 || i === ROUTE.length - 1 ? 34 : 26, anchor: 'start' })}</g>`).join('');
  return g(cls, `<rect x="380" y="60" width="1460" height="960" fill="${P.paper2}" ${S} ${shadow}/>
    <path d="M380 60H760C820 220 900 300 1000 360C1060 420 900 470 980 560C1040 640 1000 760 940 880L900 1020H380Z" fill="${P.slate3}" ${S}/>
    ${label(560, 640, 'ARABIAN SEA', { font: 'Oswald', weight: 700, size: 38, color: P.slate, letter: 6 })}${label(860, 330, 'GULF OF', { font: 'Oswald', weight: 500, size: 24, color: P.slate })}${label(860, 360, 'KHAMBHAT', { font: 'Oswald', weight: 500, size: 24, color: P.slate })}
    ${river(470, 'MAHI')}${river(590, 'NARMADA')}${river(730, 'TAPI')}
    <path class="route" d="${path}" stroke="${P.brick}" stroke-width="9" fill="none" stroke-dasharray="1 1" pathLength="1" stroke-linecap="round" stroke-linejoin="round"/>${dots}
    ${label(1800, 1000, 'NOT TO SCALE', { size: 22, anchor: 'end', color: P.ink3 })}`);
}
export function crowd(x0, x1, y, n, s = 0.6, seed = 0, cls = 'crowd') {
  let out = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / Math.max(1, n - 1) + ((i * 37 + seed) % 23) - 11, yy = y + ((i * 13 + seed) % 3) * 16;
    out += i % 3 === 2 ? woman(x, yy, s, i + seed) : marcher(x, yy, s, i + seed, { coat: i % 4 === 1 ? P.paper2 : P.snow });
  }
  return g(cls, out);
}
