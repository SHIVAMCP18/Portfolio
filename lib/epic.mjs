// Ink & Amber — epic set: armies, animals, monuments, machines, weather.
import { P, g, S, Sthin, shadow, label, person, rng } from './inkamber.mjs';
const SKIN = ['#C48E62', '#B07A52', '#9C6942', '#D9A57A'];

// headgear drawn on top of person(..., {hat:'none'}); hy = head centre y
function hat(kind, x, hy, k, color) {
  const H = {
    greek: `<path d="M${x - 24 * k} ${hy}q${0} ${-34 * k} ${24 * k} ${-34 * k}q${24 * k} 0 ${24 * k} ${34 * k}z" fill="${P.amber}" ${Sthin}/><path d="M${x - 20 * k} ${hy - 32 * k}q${20 * k} ${-36 * k} ${46 * k} ${-6 * k}" stroke="${P.brick}" stroke-width="${12 * k}" fill="none" stroke-linecap="round"/>`,
    mongol: `<path d="M${x - 28 * k} ${hy - 4 * k}q${28 * k} ${-60 * k} ${56 * k} 0z" fill="${P.mol3}" ${Sthin}/><rect x="${x - 30 * k}" y="${hy - 10 * k}" width="${60 * k}" height="${12 * k}" rx="5" fill="${P.ink3}" ${Sthin}/>`,
    pakol: `<path d="M${x - 26 * k} ${hy - 6 * k}v${-16 * k}q${26 * k} ${-14 * k} ${52 * k} 0v${16 * k}z" fill="${color || P.paper3}" ${Sthin}/>`,
    turban: `<path d="M${x - 27 * k} ${hy}q${-4 * k} ${-34 * k} ${27 * k} ${-36 * k}q${31 * k} ${2 * k} ${27 * k} ${36 * k}z" fill="${color || P.snow}" ${Sthin}/><path d="M${x - 22 * k} ${hy - 12 * k}q${22 * k} ${-14 * k} ${44 * k} 0" stroke="${P.ink}" stroke-width="2" fill="none" opacity="0.4"/>`,
    shako: `<rect x="${x - 20 * k}" y="${hy - 52 * k}" width="${40 * k}" height="${44 * k}" fill="${P.ink}" ${Sthin}/><rect x="${x - 26 * k}" y="${hy - 12 * k}" width="${52 * k}" height="${7 * k}" fill="${P.ink}"/>`,
    soviet: `<path d="M${x - 28 * k} ${hy - 2 * k}q${28 * k} ${-50 * k} ${56 * k} 0z" fill="${P.olive}" ${Sthin}/><circle cx="${x}" cy="${hy - 22 * k}" r="${5 * k}" fill="${P.brick}"/>`,
    kevlar: `<path d="M${x - 30 * k} ${hy}q${30 * k} ${-54 * k} ${60 * k} 0l${-6 * k} ${4 * k}h${-48 * k}z" fill="#9A8A5A" ${Sthin}/>`,
    crown: `<path d="M${x - 22 * k} ${hy - 14 * k}l${6 * k} ${-26 * k}l${10 * k} ${14 * k}l${6 * k} ${-20 * k}l${6 * k} ${20 * k}l${10 * k} ${-14 * k}l${6 * k} ${26 * k}z" fill="${P.amber3}" ${Sthin}/>`,
  };
  return H[kind] || '';
}
// soldier / figure. o: {gear, coat, weapon:'spear'|'rifle'|'sword'|'banner', shield, skin, pose, child, beard}
export function figure(x, y, s = 1, o = {}) {
  const k = s, hy = y - 146 * k + 6 * k;
  let wp = '';
  if (o.weapon === 'spear') wp = `<path d="M${x + 34 * k} ${y - 10 * k}L${x + 40 * k} ${y - 230 * k}" stroke="${P.ink2}" stroke-width="${6 * k}"/><path d="M${x + 40 * k} ${y - 250 * k}l${-8 * k} ${22 * k}h${16 * k}z" fill="${P.slate3}" ${Sthin}/>`;
  if (o.weapon === 'rifle') wp = `<path d="M${x + 10 * k} ${y - 70 * k}L${x + 56 * k} ${y - 150 * k}" stroke="${P.ink}" stroke-width="${9 * k}" stroke-linecap="round"/>`;
  if (o.weapon === 'sword') wp = `<path d="M${x + 34 * k} ${y - 70 * k}L${x + 64 * k} ${y - 170 * k}" stroke="${P.slate3}" stroke-width="${7 * k}" stroke-linecap="round"/>`;
  if (o.weapon === 'banner') wp = `<path d="M${x + 36 * k} ${y}L${x + 36 * k} ${y - 260 * k}" stroke="${P.ink2}" stroke-width="${6 * k}"/><path class="flagcloth" d="M${x + 36 * k} ${y - 258 * k}h${90 * k}l${-16 * k} ${28 * k}l${16 * k} ${28 * k}h${-90 * k}z" fill="${o.flag || P.brick}" ${Sthin}/>`;
  const sh = o.shield ? `<circle cx="${x - 30 * k}" cy="${y - 90 * k}" r="${30 * k}" fill="${o.shield}" ${S}/><circle cx="${x - 30 * k}" cy="${y - 90 * k}" r="${8 * k}" fill="${P.ink2}"/>` : '';
  const beard = o.beard ? `<path d="M${x - 16 * k} ${hy + 14 * k}q${16 * k} ${30 * k} ${32 * k} 0z" fill="${o.beard}" />` : '';
  return g(o.cls || 'fig', `${wp}${person(x, y, s, { coat: o.coat || P.slate, hat: 'none', skin: o.skin || SKIN[(o.i || 0) % 4], pose: o.pose, child: o.child, skirt: o.skirt })}${beard}${hat(o.gear, x, hy, k * (o.child ? 0.72 : 1), o.hatColor)}${sh}`);
}
export function horse(x, y, s = 1, o = {}) {
  const c = o.color || P.mol3, k = s;
  const legs = o.gallop
    ? `<path d="M${x - 70 * k} ${y - 70 * k}l${-40 * k} ${50 * k}M${x - 40 * k} ${y - 70 * k}l${-10 * k} ${64 * k}M${x + 50 * k} ${y - 70 * k}l${40 * k} ${48 * k}M${x + 70 * k} ${y - 74 * k}l${60 * k} ${30 * k}" stroke="${c}" stroke-width="${16 * k}" stroke-linecap="round"/>`
    : `<path d="M${x - 70 * k} ${y - 70 * k}v${70 * k}M${x - 44 * k} ${y - 70 * k}v${70 * k}M${x + 50 * k} ${y - 70 * k}v${70 * k}M${x + 74 * k} ${y - 70 * k}v${70 * k}" stroke="${c}" stroke-width="${16 * k}" stroke-linecap="round"/>`;
  return `<g class="horse">${legs}<ellipse cx="${x}" cy="${y - 100 * k}" rx="${100 * k}" ry="${44 * k}" fill="${c}" ${S}/><path d="M${x + 80 * k} ${y - 120 * k}l${50 * k} ${-70 * k}l${44 * k} ${10 * k}l${-6 * k} ${34 * k}l${-40 * k} ${-4 * k}l${-26 * k} ${56 * k}z" fill="${c}" ${S}/><path d="M${x + 120 * k} ${y - 196 * k}q${-30 * k} ${20 * k} ${-46 * k} ${70 * k}" stroke="${P.ink}" stroke-width="${10 * k}" fill="none"/><path d="M${x - 98 * k} ${y - 112 * k}q${-40 * k} ${10 * k} ${-50 * k} ${70 * k}" stroke="${P.ink}" stroke-width="${12 * k}" fill="none" stroke-linecap="round"/><circle cx="${x + 150 * k}" cy="${y - 180 * k}" r="${4 * k}" fill="${P.ink}"/></g>`;
}
export function rider(x, y, s = 1, o = {}) {
  return g(o.cls || 'rider', `${horse(x, y, s, { gallop: o.gallop, color: o.horse })}${figure(x - 10 * s, y - 90 * s, s * 0.95, { ...o, pose: 'sit', cls: 'r' })}`, shadow);
}
export function cavalry(x0, y, n, s = 0.6, o = {}) {
  let out = '';
  for (let i = 0; i < n; i++) out += rider(x0 + i * 230 * s + (i % 2) * 40 * s, y + (i % 2) * 30 * s, s, { ...o, i, cls: 'rider c' + (i % 3) });
  return g(o.cls || 'cavalry', out);
}
export function elephant(x, y, s = 1, cls = 'elephant') {
  const k = s;
  return g(cls, `<path d="M${x - 110 * k} ${y - 70 * k}v${70 * k}M${x - 70 * k} ${y - 70 * k}v${70 * k}M${x + 50 * k} ${y - 70 * k}v${70 * k}M${x + 90 * k} ${y - 70 * k}v${70 * k}" stroke="#8A8478" stroke-width="${34 * k}" stroke-linecap="round"/>
    <ellipse cx="${x - 10 * k}" cy="${y - 130 * k}" rx="${140 * k}" ry="${90 * k}" fill="#9A948A" ${S}/><circle cx="${x + 130 * k}" cy="${y - 170 * k}" r="${62 * k}" fill="#9A948A" ${S}/><path d="M${x + 170 * k} ${y - 150 * k}q${30 * k} ${70 * k} ${10 * k} ${130 * k}" stroke="#9A948A" stroke-width="${30 * k}" fill="none" stroke-linecap="round"/><path d="M${x + 170 * k} ${y - 150 * k}q${30 * k} ${70 * k} ${10 * k} ${130 * k}" stroke="${P.ink}" stroke-width="3" fill="none"/><path d="M${x + 150 * k} ${y - 130 * k}l${40 * k} ${20 * k}" stroke="${P.snow}" stroke-width="${10 * k}" stroke-linecap="round"/><path d="M${x + 90 * k} ${y - 200 * k}q${-50 * k} ${10 * k} ${-40 * k} ${80 * k}q${30 * k} ${4 * k} ${50 * k} ${-30 * k}" fill="#8A8478" ${Sthin}/><circle cx="${x + 150 * k}" cy="${y - 185 * k}" r="${5 * k}" fill="${P.ink}"/><rect x="${x - 80 * k}" y="${y - 230 * k}" width="${120 * k}" height="${40 * k}" rx="8" fill="${P.brick}" ${Sthin}/>`, shadow);
}
export function tank(x, y, s = 1, cls = 'tank2') {
  const k = s;
  let wh = ''; for (let i = 0; i < 6; i++) wh += `<circle cx="${x - 150 * k + i * 60 * k}" cy="${y - 30 * k}" r="${22 * k}" fill="${P.ink2}" ${Sthin}/>`;
  return g(cls, `<rect x="${x - 190 * k}" y="${y - 60 * k}" width="${380 * k}" height="${60 * k}" rx="${30 * k}" fill="${P.ink}" ${S}/>${wh}<path d="M${x - 170 * k} ${y - 60 * k}l${20 * k} ${-50 * k}h${300 * k}l${30 * k} ${50 * k}z" fill="#6E7350" ${S}/><path d="M${x - 70 * k} ${y - 110 * k}q${0} ${-60 * k} ${80 * k} ${-60 * k}q${60 * k} 0 ${60 * k} ${60 * k}z" fill="#6E7350" ${S}/><rect class="barrel" x="${x + 60 * k}" y="${y - 150 * k}" width="${230 * k}" height="${16 * k}" fill="#5A5E40" ${Sthin}/><circle cx="${x - 20 * k}" cy="${y - 125 * k}" r="${9 * k}" fill="${P.brick}"/>`, shadow);
}
export function helicopter(x, y, s = 1, cls = 'heli') {
  const k = s;
  return g(cls, `<path d="M${x - 40 * k} ${y}h${-230 * k}l${-30 * k} ${-40 * k}h${20 * k}l${30 * k} ${24 * k}h${210 * k}z" fill="#5E6448" ${Sthin}/><path d="M${x - 70 * k} ${y - 50 * k}q${70 * k} ${-50 * k} ${170 * k} ${-6 * k}l${40 * k} ${30 * k}q${-20 * k} ${46 * k} ${-90 * k} ${46 * k}h${-120 * k}z" fill="#6E7350" ${S}/><path d="M${x + 60 * k} ${y - 46 * k}q${40 * k} ${4 * k} ${66 * k} ${24 * k}l${-50 * k} ${6 * k}z" fill="#9FD0E8" ${Sthin}/><rect x="${x - 10 * k}" y="${y - 76 * k}" width="${16 * k}" height="${26 * k}" fill="${P.ink}"/><g class="rotor"><rect x="${x - 220 * k}" y="${y - 84 * k}" width="${440 * k}" height="${10 * k}" rx="5" fill="${P.ink}" opacity="0.8"/></g><path d="M${x - 50 * k} ${y + 10 * k}h${150 * k}" stroke="${P.ink}" stroke-width="${6 * k}"/>`, shadow);
}
export function bigPlane(x, y, s = 1, cls = 'plane') {
  const k = s;
  return g(cls, `<path d="M${x - 300 * k} ${y}q${-40 * k} ${-60 * k} ${20 * k} ${-70 * k}h${520 * k}q${80 * k} 0 ${100 * k} ${50 * k}l${-40 * k} ${20 * k}z" fill="#8C939A" ${S}/><path d="M${x - 260 * k} ${y - 70 * k}l${-70 * k} ${-110 * k}h${60 * k}l${90 * k} ${110 * k}z" fill="#7C838A" ${S}/><path d="M${x - 40 * k} ${y - 70 * k}l${-90 * k} ${-40 * k}h${280 * k}l${40 * k} ${40 * k}z" fill="#7C838A" ${S}/><path d="M${x + 290 * k} ${y - 56 * k}l${20 * k} ${-6 * k}" stroke="#9FD0E8" stroke-width="${12 * k}"/><ellipse cx="${x + 20 * k}" cy="${y - 96 * k}" rx="${30 * k}" ry="${14 * k}" fill="${P.ink2}"/><ellipse cx="${x + 120 * k}" cy="${y - 96 * k}" rx="${30 * k}" ry="${14 * k}" fill="${P.ink2}"/>`, shadow);
}
// two Buddhas in cliff niches; o.empty → empty niches after 2001
export function buddhaCliff(x, base, s = 1, o = {}) {
  const k = s;
  const niche = (cx, h, w) => `<path d="M${cx - w / 2} ${base}V${base - h + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${base}z" fill="#6E5A44" ${S}/>`;
  const buddha = (cx, h, w, cls) => `<g class="${cls}"><path d="M${cx - w * 0.36} ${base}V${base - h * 0.62}q${0} ${-h * 0.12} ${w * 0.36} ${-h * 0.12}q${w * 0.36} 0 ${w * 0.36} ${h * 0.12}V${base}z" fill="#C9B48E" ${S}/><circle cx="${cx}" cy="${base - h * 0.8}" r="${w * 0.16}" fill="#C9B48E" ${S}/><path d="M${cx - w * 0.3} ${base - h * 0.55}q${w * 0.3} ${h * 0.1} ${w * 0.6} 0M${cx - w * 0.32} ${base - h * 0.4}q${w * 0.32} ${h * 0.1} ${w * 0.64} 0M${cx - w * 0.33} ${base - h * 0.25}q${w * 0.33} ${h * 0.1} ${w * 0.66} 0" stroke="${P.ink2}" stroke-width="3" fill="none" opacity="0.6"/></g>`;
  let cl = '';
  for (let i = 0; i < 14; i++) cl += `<rect x="${x - 900 * k + i * 130 * k}" y="${base - 560 * k + (i % 3) * 20 * k}" width="${46 * k}" height="${60 * k}" rx="${20 * k}" fill="#5A4A38" opacity="0.7"/>`;
  return g(o.cls || 'cliff', `<path d="M${x - 1100 * k} ${base}V${base - 640 * k}q${300 * k} ${-60 * k} ${600 * k} ${-20 * k}t${600 * k} ${-10 * k}t${600 * k} ${30 * k}V${base}z" fill="#B49A78" ${S}/><rect x="${x - 1100 * k}" y="${base - 640 * k}" width="${2200 * k}" height="${640 * k}" fill="url(#hatch)" opacity="0.3"/>${cl}${niche(x - 380 * k, 520 * k, 190 * k)}${niche(x + 330 * k, 380 * k, 150 * k)}${o.empty ? '' : buddha(x - 380 * k, 500 * k, 190 * k, 'b1') + buddha(x + 330 * k, 360 * k, 150 * k, 'b2')}`);
}
export function edictStone(x, y, s = 1, cls = 'edict') {
  const k = s; const r = rng(9);
  let gl = '';
  for (let row = 0; row < 7; row++) { let t = ''; for (let c = 0; c < 9; c++) t += String.fromCharCode(row < 3 ? 913 + Math.floor(r() * 24) : 2048 + Math.floor(r() * 20)); if (row < 3) gl += label(x, y - 230 * k + row * 42 * k, t, { font: 'serif', size: 30 * k, color: P.ink2 }); else { let d = `M${x - 120 * k} ${y - 240 * k + row * 42 * k}`; for (let c = 0; c < 12; c++) d += `l${8 * k} ${(c % 2 ? -10 : 10) * k}l${12 * k} 0`; gl += `<path d="${d}" stroke="${P.ink2}" stroke-width="${3 * k}" fill="none"/>`; } }
  return g(cls, `<path d="M${x - 170 * k} ${y}v${-280 * k}q${0} ${-40 * k} ${40 * k} ${-50 * k}h${260 * k}q${40 * k} ${10 * k} ${40 * k} ${50 * k}v${280 * k}z" fill="#A89F8E" ${S}/>${gl}<line x1="${x - 140 * k}" y1="${y - 118 * k}" x2="${x + 140 * k}" y2="${y - 118 * k}" stroke="${P.ink}" stroke-width="2" opacity="0.4"/>`, shadow);
}
export function gandharaBuddha(x, y, s = 1, cls = 'gbuddha') {
  const k = s;
  return g(cls, `<path d="M${x - 120 * k} ${y}q${0} ${-170 * k} ${120 * k} ${-190 * k}q${120 * k} ${20 * k} ${120 * k} ${190 * k}z" fill="#8E8A80" ${S}/><path d="M${x - 90 * k} ${y - 20 * k}q${90 * k} ${-60 * k} ${180 * k} 0M${x - 80 * k} ${y - 70 * k}q${80 * k} ${-50 * k} ${160 * k} 0M${x - 60 * k} ${y - 120 * k}q${60 * k} ${-40 * k} ${120 * k} 0" stroke="${P.ink}" stroke-width="3" fill="none" opacity="0.5"/><circle cx="${x}" cy="${y - 260 * k}" r="${130 * k}" fill="${P.amber3}" opacity="0.35"/><ellipse cx="${x}" cy="${y - 250 * k}" rx="${58 * k}" ry="${70 * k}" fill="#9A968C" ${S}/><path d="M${x - 52 * k} ${y - 280 * k}q${52 * k} ${-60 * k} ${104 * k} 0q${-20 * k} ${-60 * k} ${-52 * k} ${-62 * k}q${-32 * k} ${2 * k} ${-52 * k} ${62 * k}z" fill="#6E6A62" ${Sthin}/><path d="M${x - 24 * k} ${y - 250 * k}q${10 * k} ${-6 * k} ${18 * k} 0M${x + 6 * k} ${y - 250 * k}q${10 * k} ${-6 * k} ${18 * k} 0M${x - 10 * k} ${y - 215 * k}q${10 * k} ${6 * k} ${20 * k} 0" stroke="${P.ink}" stroke-width="3" fill="none"/>`, shadow);
}
export function minaret(x, base, s = 1, cls = 'minaret', c = '#3E7C8C') {
  const k = s;
  let bands = ''; for (let i = 0; i < 6; i++) bands += `<rect x="${x - 26 * k}" y="${base - 90 * k - i * 80 * k}" width="${52 * k}" height="${14 * k}" fill="${P.amber3}" opacity="0.8"/>`;
  return g(cls, `<path d="M${x - 34 * k} ${base}L${x - 24 * k} ${base - 560 * k}h${48 * k}L${x + 34 * k} ${base}z" fill="${c}" ${S}/>${bands}<rect x="${x - 40 * k}" y="${base - 580 * k}" width="${80 * k}" height="${24 * k}" fill="${P.amber2}" ${Sthin}/><path d="M${x - 20 * k} ${base - 580 * k}q${20 * k} ${-60 * k} ${40 * k} 0z" fill="${c}" ${Sthin}/>`, shadow);
}
export function dome(x, base, s = 1, cls = 'mosque', c = '#3E7C8C') {
  const k = s;
  return g(cls, `<rect x="${x - 220 * k}" y="${base - 200 * k}" width="${440 * k}" height="${200 * k}" fill="${P.paper2}" ${S}/><path d="M${x - 60 * k} ${base - 200 * k}v${-80 * k}h${120 * k}v${80 * k}" fill="${P.paper2}" ${S}/><path d="M${x - 120 * k} ${base - 280 * k}q${0} ${-160 * k} ${120 * k} ${-190 * k}q${120 * k} ${30 * k} ${120 * k} ${190 * k}z" fill="${c}" ${S}/><path d="M${x - 50 * k} ${base}v${-120 * k}a${50 * k} ${50 * k} 0 0 1 ${100 * k} 0v${120 * k}z" fill="${P.ink2}" ${Sthin}/><path d="M${x} ${base - 470 * k}v${-40 * k}" ${S}/>`, shadow);
}
export function fortWall(x0, x1, base, h = 220, cls = 'fort', c = '#B49A78') {
  let m = ''; for (let x = x0; x < x1; x += 60) m += `<rect x="${x}" y="${base - h - 30}" width="36" height="34" fill="${c}" ${Sthin}/>`;
  let towers = ''; for (let x = x0 + 120; x < x1; x += 460) towers += `<rect x="${x - 50}" y="${base - h - 90}" width="100" height="${h + 90}" fill="${c}" ${S}/><rect x="${x - 56}" y="${base - h - 110}" width="112" height="26" fill="${c}" ${Sthin}/>`;
  return g(cls, `<rect x="${x0}" y="${base - h}" width="${x1 - x0}" height="${h}" fill="${c}" ${S}/><rect x="${x0}" y="${base - h}" width="${x1 - x0}" height="${h}" fill="url(#bricks)"/>${m}${towers}`, shadow);
}
export function diamond(x, y, s = 1, cls = 'diamond') {
  const k = s;
  return g(cls, `<circle cx="${x}" cy="${y}" r="${150 * k}" fill="url(#glow)"/><path d="M${x - 90 * k} ${y - 30 * k}l${40 * k} ${-50 * k}h${100 * k}l${40 * k} ${50 * k}l${-90 * k} ${110 * k}z" fill="#E6F2F4" ${S}/><path d="M${x - 90 * k} ${y - 30 * k}h${180 * k}M${x - 50 * k} ${y - 80 * k}l${20 * k} ${50 * k}l${30 * k} ${-50 * k}l${30 * k} ${50 * k}l${20 * k} ${-50 * k}M${x - 30 * k} ${y - 30 * k}l${30 * k} ${110 * k}l${30 * k} ${-110 * k}" stroke="#7FA8B2" stroke-width="3" fill="none"/>`, shadow);
}
export function towers(x, base, s = 1, cls = 'towers') {
  const k = s;
  let w = ''; for (let i = 0; i < 18; i++) w += `<line x1="${x - 200 * k}" y1="${base - 40 * k - i * 30 * k}" x2="${x - 90 * k}" y2="${base - 40 * k - i * 30 * k}" stroke="${P.slate3}" stroke-width="2" opacity="0.5"/><line x1="${x + 30 * k}" y1="${base - 40 * k - i * 30 * k}" x2="${x + 140 * k}" y2="${base - 40 * k - i * 30 * k}" stroke="${P.slate3}" stroke-width="2" opacity="0.5"/>`;
  return g(cls, `<rect x="${x - 210 * k}" y="${base - 600 * k}" width="${130 * k}" height="${600 * k}" fill="${P.slate}" ${S}/><rect x="${x + 20 * k}" y="${base - 590 * k}" width="${130 * k}" height="${590 * k}" fill="${P.slate}" ${S}/>${w}`, shadow);
}
export function snow(n = 90, seed = 3, cls = 'snow') {
  const r = rng(seed); let o = '';
  for (let i = 0; i < n; i++) o += `<circle cx="${r() * 1920}" cy="${r() * 1080}" r="${2 + r() * 4}" fill="#FFFFFF" opacity="${0.5 + r() * 0.5}"/>`;
  return `<g class="${cls}">${o}</g><g class="${cls}" transform="translate(0 -1080)">${o}</g>`;
}
export function dust(n = 50, seed = 5, cls = 'dust') {
  const r = rng(seed); let o = '';
  for (let i = 0; i < n; i++) o += `<circle cx="${r() * 1920}" cy="${r() * 1080}" r="${1.5 + r() * 3}" fill="${P.amber3}" opacity="${0.25 + r() * 0.4}"/>`;
  return `<g class="${cls}">${o}</g>`;
}
export function peaks(base, seed = 1, o = {}) {
  const r = rng(seed); let d = `M-200 ${base}`;
  let x = -200; while (x < 2200) { const w = 150 + r() * 260, h = (o.h || 360) * (0.5 + r() * 0.6); d += `L${x + w / 2} ${base - h}L${x + w} ${base}`; x += w * 0.8; }
  d += `V1300H-200Z`;
  let caps = ''; x = -200; const r2 = rng(seed);
  while (x < 2200) { const w = 150 + r2() * 260, h = (o.h || 360) * (0.5 + r2() * 0.6); caps += `<path d="M${x + w / 2 - w * 0.12} ${base - h + h * 0.22}L${x + w / 2} ${base - h}L${x + w / 2 + w * 0.12} ${base - h + h * 0.22}l${-w * 0.06} ${h * 0.05}l${-w * 0.06} ${-h * 0.05}z" fill="${P.snow}"/>`; x += w * 0.8; }
  return g(o.cls || 'peaks', `<path d="${d}" fill="${o.fill || '#8A7E6C'}" ${S}/>${o.snow === false ? '' : caps}`);
}
export function dam(x, base, s = 1, cls = 'dam') {
  const k = s;
  return g(cls, `<path d="M${x - 400 * k} ${base - 260 * k}h${800 * k}l${-60 * k} ${260 * k}h${-680 * k}z" fill="#B8B2A4" ${S}/><path d="M${x - 400 * k} ${base - 260 * k}h${800 * k}" stroke="${P.ink}" stroke-width="6"/><rect x="${x - 420 * k}" y="${base - 300 * k}" width="${840 * k}" height="${40 * k}" fill="#9A948A" ${S}/><path d="M${x - 300 * k} ${base}q${60 * k} ${-40 * k} ${120 * k} 0t${120 * k} 0t${120 * k} 0t${120 * k} 0t${120 * k} 0" stroke="#9FD0E8" stroke-width="10" fill="none"/>`, shadow);
}
export function parliament(x, base, s = 1, cls = 'parl') {
  const k = s;
  let col = ''; for (let i = 0; i < 8; i++) col += `<rect x="${x - 300 * k + i * 80 * k}" y="${base - 200 * k}" width="${24 * k}" height="${170 * k}" fill="${P.snow}" ${Sthin}/>`;
  return g(cls, `<rect x="${x - 340 * k}" y="${base - 230 * k}" width="${680 * k}" height="${230 * k}" fill="#D8C7A2" ${S}/>${col}<path d="M${x - 160 * k} ${base - 230 * k}q${0} ${-200 * k} ${160 * k} ${-210 * k}q${160 * k} ${10 * k} ${160 * k} ${210 * k}z" fill="#7FA8B2" ${S}/><path d="M${x} ${base - 440 * k}v${-50 * k}" ${S}/>`, shadow);
}
