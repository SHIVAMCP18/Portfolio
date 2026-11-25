// Ink & Amber — Persian set: Persepolis, Cyrus Cylinder, fire altar, qanat, chess, dhow, Peacock Throne, oil, missiles, crowds.
import { P, g, S, Sthin, shadow, label, person } from './inkamber.mjs';

export function column(x, base, h = 520, s = 1, cls = 'col') {
  const k = s;
  return `<g class="${cls}"><rect x="${x - 22 * k}" y="${base - h * k}" width="${44 * k}" height="${h * k}" fill="#C9B48E" ${S}/>${[0.2, 0.4, 0.6, 0.8].map((f) => `<line x1="${x - 12 * k}" y1="${base - h * k}" x2="${x - 12 * k}" y2="${base}" stroke="${P.ink}" stroke-width="2" opacity="0.25"/><line x1="${x + 8 * k}" y1="${base - h * k}" x2="${x + 8 * k}" y2="${base}" stroke="${P.ink}" stroke-width="2" opacity="0.25"/>`).slice(0, 1).join('')}
    <rect x="${x - 40 * k}" y="${base - 30 * k}" width="${80 * k}" height="${30 * k}" fill="#B49A78" ${Sthin}/>
    <path d="M${x - 70 * k} ${base - h * k}q${-20 * k} ${-40 * k} ${10 * k} ${-50 * k}h${40 * k}l${20 * k} ${20 * k}l${20 * k} ${-20 * k}h${40 * k}q${30 * k} ${10 * k} ${10 * k} ${50 * k}z" fill="#B49A78" ${S}/><circle cx="${x - 50 * k}" cy="${base - h * k - 30 * k}" r="${6 * k}" fill="${P.ink}"/><circle cx="${x + 50 * k}" cy="${base - h * k - 30 * k}" r="${6 * k}" fill="${P.ink}"/></g>`;
}
export function persepolis(x0, x1, base, cls = 'persepolis', o = {}) {
  let c = '';
  const n = o.n || 7;
  for (let i = 0; i < n; i++) { const x = x0 + ((x1 - x0) * i) / (n - 1); const broken = o.ruin && i % 3 === 1; c += column(x, base - 60, broken ? 220 : 480 + (i % 2) * 20, 1, 'col c' + i); }
  return g(cls, `<rect x="${x0 - 120}" y="${base - 60}" width="${x1 - x0 + 240}" height="60" fill="#B49A78" ${S}/><path d="M${x0 - 120} ${base - 30}h${x1 - x0 + 240}" stroke="${P.ink}" stroke-width="2" opacity="0.3"/>${c}`, shadow);
}
export function cylinder(x, y, s = 1, cls = 'cyl') {
  const k = s;
  let lines = ''; for (let i = 0; i < 6; i++) lines += `<path d="M${x - 200 * k} ${y - 70 * k + i * 26 * k}h${400 * k}" stroke="${P.ink2}" stroke-width="${3 * k}" stroke-dasharray="${6 * k} ${4 * k} ${2 * k} ${4 * k}"/>`;
  return g(cls, `<path d="M${x - 240 * k} ${y - 100 * k}q${-40 * k} ${100 * k} 0 ${200 * k}h${480 * k}q${40 * k} ${-100 * k} 0 ${-200 * k}z" fill="#C9AE84" ${S}/><ellipse cx="${x - 240 * k}" cy="${y}" rx="${30 * k}" ry="${100 * k}" fill="#B4996E" ${Sthin}/>${lines}<path d="M${x + 60 * k} ${y - 100 * k}l${-20 * k} ${60 * k}l${30 * k} ${50 * k}" stroke="${P.ink}" stroke-width="3" fill="none" opacity="0.5"/>`, shadow);
}
export function fireAltar(x, base, s = 1, cls = 'altar') {
  const k = s;
  return g(cls, `<path d="M${x - 70 * k} ${base}h${140 * k}l${-20 * k} ${-40 * k}h${-100 * k}z" fill="#B49A78" ${S}/><rect x="${x - 34 * k}" y="${base - 200 * k}" width="${68 * k}" height="${160 * k}" fill="#C9B48E" ${S}/><path d="M${x - 70 * k} ${base - 200 * k}h${140 * k}l${-20 * k} ${-36 * k}h${-100 * k}z" fill="#B49A78" ${S}/>
    <g class="flame"><path d="M${x - 46 * k} ${base - 236 * k}q${-10 * k} ${-90 * k} ${46 * k} ${-170 * k}q${56 * k} ${80 * k} ${46 * k} ${170 * k}z" fill="${P.amber2}" ${Sthin}/><path d="M${x - 22 * k} ${base - 236 * k}q${-4 * k} ${-50 * k} ${22 * k} ${-100 * k}q${26 * k} ${50 * k} ${22 * k} ${100 * k}z" fill="${P.amber3}"/></g><circle cx="${x}" cy="${base - 300 * k}" r="${160 * k}" fill="url(#glow)"/>`, shadow);
}
// qanat cross-section: mountain, mother well, shafts, tunnel to a village
export function qanat(cls = 'qanat') {
  let shafts = ''; for (let i = 0; i < 9; i++) { const x = 560 + i * 120; shafts += `<rect class="shaft${i}" x="${x - 10}" y="${620 + i * 6}" width="20" height="${200 - i * 10}" fill="${P.mol3}"/><ellipse cx="${x}" cy="${618 + i * 6}" rx="34" ry="12" fill="#B49A78" ${Sthin}/>`; }
  return g(cls, `<rect x="-200" y="620" width="2320" height="700" fill="#C9AE84" ${S}/><path d="M-200 620L200 260L560 620z" fill="#9A8A72" ${S}/><path d="M-200 900h2320" stroke="${P.ink}" stroke-width="2" opacity="0.2"/>
    <path d="M-100 760H400" stroke="${P.slate2}" stroke-width="30" opacity="0.7"/>${shafts}
    <path class="tunnel" d="M380 820L560 820L1520 760L1720 700" stroke="${P.slate2}" stroke-width="22" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
    <rect x="1640" y="520" width="140" height="100" fill="${P.paper2}" ${S}/><path d="M1630 520l80 -50l80 50z" fill="${P.brick}" ${S}/><path d="M1720 700q40 -20 80 0" stroke="${P.slate2}" stroke-width="18" fill="none"/>`);
}
export function chess(x, y, s = 1, cls = 'chess') {
  const k = s; let sq = '';
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) sq += `<rect x="${x + i * 50 * k}" y="${y + j * 50 * k}" width="${50 * k}" height="${50 * k}" fill="${(i + j) % 2 ? P.mol3 : P.paper}"/>`;
  const piece = (px, py, c) => `<path d="M${px - 16 * k} ${py}h${32 * k}l${-6 * k} ${-30 * k}h${-20 * k}z" fill="${c}" ${Sthin}/><circle cx="${px}" cy="${py - 40 * k}" r="${13 * k}" fill="${c}" ${Sthin}/><path d="M${px - 8 * k} ${py - 56 * k}l${8 * k} ${-14 * k}l${8 * k} ${14 * k}z" fill="${c}" ${Sthin}/>`;
  return g(cls, `<rect x="${x - 14 * k}" y="${y - 14 * k}" width="${428 * k}" height="${428 * k}" fill="${P.ink2}" ${S}/>${sq}${piece(x + 175 * k, y + 120 * k, P.snow)}${piece(x + 275 * k, y + 330 * k, P.ink)}`, shadow);
}
export function dhow(x, y, s = 1, cls = 'dhow') {
  const k = s;
  return g(cls, `<path d="M${x - 220 * k} ${y - 40 * k}q${220 * k} ${30 * k} ${440 * k} ${-60 * k}l${-60 * k} ${90 * k}h${-300 * k}z" fill="${P.mol3}" ${S}/><line x1="${x}" y1="${y - 40 * k}" x2="${x}" y2="${y - 380 * k}" ${S}/><path d="M${x - 10 * k} ${y - 370 * k}Q${x - 220 * k} ${y - 200 * k} ${x - 180 * k} ${y - 60 * k}L${x + 180 * k} ${y - 70 * k}Q${x + 100 * k} ${y - 260 * k} ${x - 10 * k} ${y - 370 * k}z" fill="${P.snow}" ${S}/>`, shadow);
}
export function bowl(x, y, s = 1, cls = 'bowl') {
  const k = s;
  return g(cls, `<path d="M${x - 110 * k} ${y}q${110 * k} ${120 * k} ${220 * k} 0z" fill="${P.paper2}" ${S}/><ellipse cx="${x}" cy="${y}" rx="${110 * k}" ry="${26 * k}" fill="${P.snow}" ${S}/>`, shadow);
}
export function peacockThrone(x, base, s = 1, cls = 'throne') {
  const k = s; let tail = '';
  for (let i = 0; i < 9; i++) { const a = Math.PI * (0.15 + 0.7 * i / 8); tail += `<path d="M${x} ${base - 320 * k}L${x - Math.cos(a) * 260 * k} ${base - 320 * k - Math.sin(a) * 260 * k}" stroke="${P.olive}" stroke-width="${18 * k}" stroke-linecap="round"/><circle cx="${x - Math.cos(a) * 260 * k}" cy="${base - 320 * k - Math.sin(a) * 260 * k}" r="${22 * k}" fill="#3E7C8C" stroke="${P.amber3}" stroke-width="5"/>`; }
  return g(cls, `${tail}<rect x="${x - 200 * k}" y="${base - 320 * k}" width="${400 * k}" height="${200 * k}" fill="url(#goldg)" ${S}/><rect x="${x - 240 * k}" y="${base - 130 * k}" width="${480 * k}" height="${60 * k}" fill="${P.amber}" ${S}/><path d="M${x - 220 * k} ${base - 70 * k}v${70 * k}M${x + 220 * k} ${base - 70 * k}v${70 * k}M${x - 80 * k} ${base - 70 * k}v${70 * k}M${x + 80 * k} ${base - 70 * k}v${70 * k}" stroke="${P.amber}" stroke-width="${22 * k}"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${x - 160 * k + i * 80 * k}" cy="${base - 220 * k}" r="${14 * k}" fill="${[P.brick, '#3E7C8C', P.olive2][i % 3]}" ${Sthin}/>`).join('')}`, shadow);
}
export function derrick(x, base, s = 1, cls = 'derrick') {
  const k = s;
  return g(cls, `<path d="M${x - 70 * k} ${base}L${x - 10 * k} ${base - 380 * k}h${20 * k}L${x + 70 * k} ${base}" stroke="${P.ink}" stroke-width="${8 * k}" fill="none"/>${[0, 1, 2, 3].map((i) => `<path d="M${x - 60 * k + i * 12 * k} ${base - 60 * k - i * 80 * k}L${x + 60 * k - i * 12 * k} ${base - 130 * k - i * 80 * k}M${x + 60 * k - i * 12 * k} ${base - 60 * k - i * 80 * k}L${x - 60 * k + i * 12 * k} ${base - 130 * k - i * 80 * k}" stroke="${P.ink}" stroke-width="${4 * k}"/>`).join('')}<rect x="${x - 20 * k}" y="${base - 400 * k}" width="${40 * k}" height="${24 * k}" fill="${P.ink}"/><path class="gush" d="M${x} ${base - 400 * k}q${-30 * k} ${-120 * k} ${0} ${-200 * k}q${30 * k} ${80 * k} ${0} ${200 * k}" fill="${P.ink}" opacity="0.9"/>`, shadow);
}
export function missile(x, y, s = 1, ang = -35, cls = 'missile') {
  const k = s;
  return g(cls, `<g transform="rotate(${ang} ${x} ${y})"><path d="M${x - 120 * k} ${y - 14 * k}h${200 * k}q${50 * k} ${14 * k} 0 ${28 * k}h${-200 * k}z" fill="#C9CFD2" ${S}/><path d="M${x - 120 * k} ${y - 14 * k}l${-30 * k} ${-26 * k}v${80 * k}l${30 * k} ${-26 * k}" fill="${P.slate}" ${Sthin}/><path d="M${x - 150 * k} ${y}q${-80 * k} ${-14 * k} ${-140 * k} 0q${60 * k} ${14 * k} ${140 * k} 0" fill="url(#flameg)"/></g>`);
}
export function embassy(x, base, s = 1, cls = 'embassy') {
  const k = s; let w = '';
  for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) w += `<rect x="${x - 300 * k + i * 86 * k}" y="${base - 260 * k + r * 110 * k}" width="${40 * k}" height="${60 * k}" fill="${P.slate3}" ${Sthin}/>`;
  return g(cls, `<rect x="${x - 340 * k}" y="${base - 300 * k}" width="${680 * k}" height="${300 * k}" fill="${P.paper2}" ${S}/>${w}<rect x="${x - 40 * k}" y="${base - 100 * k}" width="${80 * k}" height="${100 * k}" fill="${P.ink2}"/><path d="M${x - 380 * k} ${base}h${760 * k}" stroke="${P.ink}" stroke-width="10"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<path d="M${x - 360 * k + i * 80 * k} ${base}v${-80 * k}" stroke="${P.ink}" stroke-width="6"/>`).join('')}<path d="M${x - 380 * k} ${base - 70 * k}h${760 * k}" stroke="${P.ink}" stroke-width="6"/>`, shadow);
}
export function protest(x0, x1, y, n, s = 0.6, cls = 'protest') {
  let out = '';
  const SK = ['#C48E62', '#B07A52', '#D9A57A', '#9C6942'];
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * i) / (n - 1), yy = y + (i % 3) * 18 * s;
    const sign = i % 4 === 0 ? `<path d="M${x + 30 * s} ${yy - 120 * s}v${-120 * s}" stroke="${P.ink2}" stroke-width="${6 * s}"/><rect x="${x - 10 * s}" y="${yy - 300 * s}" width="${90 * s}" height="${64 * s}" fill="${P.snow}" ${Sthin}/>` : '';
    out += `<g class="pp">${sign}${person(x, yy, s, { coat: [P.ink2, P.slate, P.olive2, P.mol3][i % 4], hat: i % 3 === 0 ? 'bonnet' : 'none', hatColor: P.ink, skin: SK[i % 4], pose: i % 2 ? 'arms' : 'stand', skirt: i % 3 === 0 })}</g>`;
  }
  return g(cls, out);
}
export function book(x, y, title, s = 1, cls = 'book', font = "'Baloo 2', Oswald") {
  const k = s;
  return g(cls, `<rect x="${x - 180 * k}" y="${y - 240 * k}" width="${360 * k}" height="${480 * k}" rx="10" fill="${P.brick}" ${S}/><rect x="${x - 150 * k}" y="${y - 210 * k}" width="${300 * k}" height="${420 * k}" fill="none" stroke="${P.amber3}" stroke-width="5"/><circle cx="${x}" cy="${y + 60 * k}" r="${60 * k}" fill="none" stroke="${P.amber3}" stroke-width="5"/>${label(x, y - 80 * k, title, { font, weight: 800, size: 62 * k, color: P.amber3 })}`, shadow);
}
