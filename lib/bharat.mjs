// Ink & Amber — India set. Maps of India in this library never draw political borders.
import { P, g, S, Sthin, shadow, label, person } from './inkamber.mjs';

export const RIVERS = {
  indus: [[81.3, 30.9], [79, 32.5], [77.5, 34.2], [75, 35.8], [73, 35.2], [72.2, 33.9], [71.5, 32], [70.8, 29.5], [69, 26.5], [68.3, 25], [67.5, 24]],
  ganga: [[78.2, 30.7], [78.1, 29.9], [79.5, 27.5], [81.9, 25.4], [83, 25.3], [85.1, 25.6], [87.3, 25.2], [88, 24], [88.8, 22.4]],
  yamuna: [[78.4, 31], [77.6, 30.1], [77.2, 28.6], [78, 27.2], [79.5, 26.2], [81.9, 25.4]],
  brahmaputra: [[82, 30.2], [88, 29.3], [93, 29.4], [95.3, 28.2], [94, 26.8], [91.7, 26.2], [89.8, 25.7], [89.7, 23.8]],
};
export function rivers(m, names = ['indus', 'ganga', 'yamuna', 'brahmaputra'], cls = 'rivers') {
  return g(cls, names.map((n) => `<path class="rv ${n}" d="M${RIVERS[n].map((p) => m.xy(...p).join(' ')).join('L')}" stroke="#5E8FA6" stroke-width="${n === 'yamuna' ? 4 : 7}" fill="none" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>`).join(''));
}
export function harappa(x0, y0, cls = 'harappa') {
  let h = '';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) {
    const x = x0 + c * 160, y = y0 + r * 120;
    h += `<rect x="${x}" y="${y}" width="120" height="80" fill="#C47E52" ${Sthin}/><rect x="${x}" y="${y}" width="120" height="80" fill="url(#bricks)"/><rect x="${x + 48}" y="${y + 50}" width="24" height="30" fill="${P.ink2}"/>`;
  }
  let drains = '';
  for (let r = 0; r <= 4; r++) drains += `<path class="drain" d="M${x0 - 20} ${y0 + r * 120 - 20}H${x0 + 7 * 160}" stroke="#5E8FA6" stroke-width="8" stroke-dasharray="1 1" pathLength="1"/>`;
  return g(cls, `<rect x="${x0 - 40}" y="${y0 - 40}" width="${7 * 160 + 40}" height="${4 * 120 + 40}" fill="#D8B48A" ${S}/>${drains}${h}`, shadow);
}
export function greatBath(x, y, cls = 'bath') {
  return g(cls, `<rect x="${x - 260}" y="${y - 150}" width="520" height="300" fill="#C47E52" ${S}/><rect x="${x - 260}" y="${y - 150}" width="520" height="300" fill="url(#bricks)"/><rect x="${x - 180}" y="${y - 90}" width="360" height="180" fill="#5E8FA6" ${S}/><path d="M${x - 180} ${y - 90}l40 40h280l40 -40" stroke="${P.ink}" stroke-width="3" fill="none" opacity="0.5"/><path class="ripple" d="M${x - 150} ${y + 10}q30 -12 60 0t60 0t60 0t60 0t60 0" stroke="#BFE0EE" stroke-width="4" fill="none"/>`, shadow);
}
export function seal(x, y, s = 1, cls = 'seal') {
  const k = s;
  return g(cls, `<rect x="${x - 130 * k}" y="${y - 130 * k}" width="${260 * k}" height="${260 * k}" rx="${14 * k}" fill="#D8C7A2" ${S}/>
    <path d="M${x - 70 * k} ${y + 70 * k}v${-60 * k}q${0} ${-50 * k} ${60 * k} ${-50 * k}h${50 * k}q${30 * k} 0 ${30 * k} ${-30 * k}l${20 * k} ${-20 * k}l${-6 * k} ${36 * k}q${10 * k} ${40 * k} ${-30 * k} ${60 * k}v${54 * k}M${x - 60 * k} ${y + 70 * k}v${-40 * k}M${x + 30 * k} ${y + 70 * k}v${-40 * k}" stroke="${P.ink2}" stroke-width="${8 * k}" fill="none" stroke-linecap="round"/>
    <path d="M${x + 40 * k} ${y - 70 * k}l${50 * k} ${-40 * k}" stroke="${P.ink2}" stroke-width="${6 * k}"/>
    ${['M-90 -100v20', 'M-70 -100l10 20l10 -20', 'M-30 -100h20M-20 -100v20', 'M10 -100c10 0 10 20 0 20'].map((d) => `<path d="${d.replace(/(-?\d+)/g, (n) => n)}" transform="translate(${x} ${y}) scale(${k})" stroke="${P.ink2}" stroke-width="4" fill="none"/>`).join('')}`, shadow);
}
export function stupa(x, base, s = 1, cls = 'stupa') {
  const k = s;
  return g(cls, `<rect x="${x - 260 * k}" y="${base - 40 * k}" width="${520 * k}" height="${40 * k}" fill="#C9B48E" ${S}/><path d="M${x - 220 * k} ${base - 40 * k}a${220 * k} ${190 * k} 0 0 1 ${440 * k} 0z" fill="#E6D8B8" ${S}/><rect x="${x - 40 * k}" y="${base - 250 * k}" width="${80 * k}" height="${30 * k}" fill="#C9B48E" ${Sthin}/><path d="M${x} ${base - 250 * k}v${-60 * k}M${x - 40 * k} ${base - 290 * k}h${80 * k}M${x - 30 * k} ${base - 270 * k}h${60 * k}" stroke="${P.ink}" stroke-width="${6 * k}"/>`, shadow);
}
export function chakra(x, y, r = 100, cls = 'chakra', color = '#1F3A93') {
  let sp = ''; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; sp += `<line x1="${x}" y1="${y}" x2="${x + Math.cos(a) * r}" y2="${y + Math.sin(a) * r}" stroke="${color}" stroke-width="${r * 0.04}"/>`; }
  return g(cls, `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="${r * 0.08}"/>${sp}<circle cx="${x}" cy="${y}" r="${r * 0.14}" fill="${color}"/>`);
}
export function lionCapital(x, base, s = 1, cls = 'lions') {
  const k = s;
  const lion = (dx, flip) => `<g transform="translate(${x + dx * k} ${base - 300 * k}) scale(${flip ? -k : k} ${k})"><path d="M-40 0q-6 -70 30 -90h60q30 20 20 90z" fill="#C9B48E" ${S}/><circle cx="20" cy="-130" r="62" fill="#B49A78" ${S}/>${[0,1,2,3,4,5,6,7,8,9].map((i) => `<path d="M20 -130L${20 + Math.cos(i * 0.628) * 70} ${-130 + Math.sin(i * 0.628) * 70}" stroke="${P.ink2}" stroke-width="3" opacity="0.5"/>`).join('')}<circle cx="34" cy="-126" r="36" fill="#D8C49E" ${Sthin}/><circle cx="46" cy="-136" r="5" fill="${P.ink}"/><path d="M52 -112q10 4 16 -2" stroke="${P.ink}" stroke-width="4" fill="none"/><path d="M60 -122l12 4" stroke="${P.ink}" stroke-width="4"/></g>`;
  return g(cls, `<rect x="${x - 150 * k}" y="${base - 60 * k}" width="${300 * k}" height="${60 * k}" fill="#B49A78" ${S}/><path d="M${x - 130 * k} ${base - 60 * k}q${130 * k} ${-100 * k} ${260 * k} 0" fill="#C9B48E" ${S}/><rect x="${x - 170 * k}" y="${base - 300 * k}" width="${340 * k}" height="${120 * k}" fill="#C9B48E" ${S}/>${chakra(x, base - 240 * k, 44 * k, 'chk', P.ink2)}${lion(-110, true)}${lion(110, false)}${lion(0, false).replace('#C9B48E', '#D8C49E')}`, shadow);
}
export function tricolor(x, y, w = 360, cls = 'flag') {
  const h = w * 2 / 3;
  return g(cls, `<line x1="${x}" y1="${y - 10}" x2="${x}" y2="${y + h + 380}" stroke="${P.ink}" stroke-width="10"/><g class="cloth"><rect x="${x}" y="${y}" width="${w}" height="${h / 3}" fill="#E8893A" ${Sthin}/><rect x="${x}" y="${y + h / 3}" width="${w}" height="${h / 3}" fill="${P.snow}" ${Sthin}/><rect x="${x}" y="${y + 2 * h / 3}" width="${w}" height="${h / 3}" fill="#3E8A46" ${Sthin}/>${chakra(x + w / 2, y + h / 2, h / 7.5, 'chk')}</g>`, shadow);
}
export function gopuram(x, base, s = 1, cls = 'temple') {
  const k = s; let tiers = '';
  for (let i = 0; i < 9; i++) { const w = 460 - i * 44; tiers += `<rect x="${x - w / 2 * k}" y="${base - (140 + i * 52) * k}" width="${w * k}" height="${52 * k}" fill="${i % 2 ? '#C99A6A' : '#B8865A'}" ${Sthin}/>`; }
  return g(cls, `<rect x="${x - 300 * k}" y="${base - 140 * k}" width="${600 * k}" height="${140 * k}" fill="#B8865A" ${S}/><rect x="${x - 40 * k}" y="${base - 100 * k}" width="${80 * k}" height="${100 * k}" fill="${P.ink2}"/>${tiers}<circle cx="${x}" cy="${base - 640 * k}" r="${40 * k}" fill="#C99A6A" ${S}/><path d="M${x} ${base - 680 * k}v${-40 * k}" stroke="${P.amber3}" stroke-width="${8 * k}"/>`, shadow);
}
export function angkor(x, base, s = 1, cls = 'angkor') {
  const k = s;
  const tower = (dx, h) => `<path d="M${x + (dx - 50) * k} ${base - 160 * k}q${10 * k} ${-h * 0.6 * k} ${50 * k} ${-h * k}q${40 * k} ${h * 0.4 * k} ${50 * k} ${h * k}z" fill="#8A7E6C" ${S}/>`;
  return g(cls, `<rect x="${x - 420 * k}" y="${base - 160 * k}" width="${840 * k}" height="${160 * k}" fill="#9A8E7C" ${S}/>${tower(-300, 220)}${tower(-150, 300)}${tower(0, 400)}${tower(150, 300)}${tower(300, 220)}<path d="M${x - 600 * k} ${base + 40 * k}h${1200 * k}" stroke="#5E8FA6" stroke-width="30"/>`, shadow);
}
export function taj(x, base, s = 1, cls = 'taj') {
  const k = s; const W = '#F2EEE6';
  const min = (dx) => `<rect x="${x + dx * k - 14 * k}" y="${base - 420 * k}" width="${28 * k}" height="${420 * k}" fill="${W}" ${Sthin}/><path d="M${x + dx * k - 22 * k} ${base - 420 * k}h${44 * k}l${-22 * k} ${-50 * k}z" fill="${W}" ${Sthin}/>`;
  return g(cls, `${min(-380)}${min(380)}<rect x="${x - 300 * k}" y="${base - 40 * k}" width="${600 * k}" height="${40 * k}" fill="${W}" ${S}/><rect x="${x - 220 * k}" y="${base - 260 * k}" width="${440 * k}" height="${220 * k}" fill="${W}" ${S}/><path d="M${x - 60 * k} ${base - 40 * k}v${-150 * k}q${60 * k} ${-60 * k} ${120 * k} 0v${150 * k}z" fill="#D8D2C4" ${Sthin}/>
    <path d="M${x - 130 * k} ${base - 260 * k}q${-30 * k} ${-170 * k} ${130 * k} ${-230 * k}q${160 * k} ${60 * k} ${130 * k} ${230 * k}z" fill="${W}" ${S}/><path d="M${x} ${base - 490 * k}v${-50 * k}" ${S}/>
    ${[-170, 170].map((dx) => `<path d="M${x + dx * k - 40 * k} ${base - 260 * k}q${40 * k} ${-90 * k} ${80 * k} 0z" fill="${W}" ${Sthin}/>`).join('')}<rect x="${x - 600 * k}" y="${base}" width="${1200 * k}" height="${40 * k}" fill="#5E8FA6"/>`, shadow);
}
export function loom(x, base, s = 1, cls = 'loom') {
  const k = s; let th = '';
  for (let i = 0; i < 12; i++) th += `<line x1="${x - 120 * k + i * 20 * k}" y1="${base - 260 * k}" x2="${x - 120 * k + i * 20 * k}" y2="${base - 80 * k}" stroke="${P.snow}" stroke-width="3"/>`;
  return g(cls, `<rect x="${x - 160 * k}" y="${base - 300 * k}" width="${320 * k}" height="${40 * k}" fill="${P.mol3}" ${S}/><rect x="${x - 160 * k}" y="${base - 90 * k}" width="${320 * k}" height="${30 * k}" fill="${P.mol3}" ${S}/><path d="M${x - 150 * k} ${base - 260 * k}v${260 * k}M${x + 150 * k} ${base - 260 * k}v${260 * k}" ${S}/>${th}<rect x="${x - 130 * k}" y="${base - 200 * k}" width="${260 * k}" height="${100 * k}" fill="${P.rose}" opacity="0.7"/>`, shadow);
}
export function steamTrain(x, y, s = 1, cls = 'steam') {
  const k = s;
  let cars = ''; for (let i = 1; i < 4; i++) cars += `<rect x="${x - i * 260 * k}" y="${y - 130 * k}" width="${240 * k}" height="${110 * k}" fill="${P.brick}" ${S}/><circle cx="${x - i * 260 * k + 50 * k}" cy="${y - 10 * k}" r="${20 * k}" fill="${P.ink}"/><circle cx="${x - i * 260 * k + 190 * k}" cy="${y - 10 * k}" r="${20 * k}" fill="${P.ink}"/>`;
  return g(cls, `${cars}<rect x="${x}" y="${y - 120 * k}" width="${220 * k}" height="${100 * k}" rx="${30 * k}" fill="${P.ink}" ${S}/><rect x="${x + 20 * k}" y="${y - 200 * k}" width="${80 * k}" height="${90 * k}" fill="${P.ink2}" ${S}/><rect x="${x + 160 * k}" y="${y - 180 * k}" width="${36 * k}" height="${60 * k}" fill="${P.ink}" ${S}/><circle cx="${x + 50 * k}" cy="${y - 10 * k}" r="${30 * k}" fill="${P.ink2}" ${S}/><circle cx="${x + 170 * k}" cy="${y - 10 * k}" r="${30 * k}" fill="${P.ink2}" ${S}/><path d="M${x + 220 * k} ${y - 20 * k}l${30 * k} ${20 * k}" ${S}/>`, shadow);
}
export function charkha(x, base, s = 1, cls = 'charkha') {
  const k = s; let sp = '';
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; sp += `<line x1="${x - 80 * k}" y1="${base - 140 * k}" x2="${x - 80 * k + Math.cos(a) * 110 * k}" y2="${base - 140 * k + Math.sin(a) * 110 * k}" stroke="${P.mol3}" stroke-width="${5 * k}"/>`; }
  return g(cls, `<rect x="${x - 220 * k}" y="${base - 20 * k}" width="${380 * k}" height="${20 * k}" fill="${P.mol3}" ${S}/><g class="wheel">${sp}<circle cx="${x - 80 * k}" cy="${base - 140 * k}" r="${110 * k}" fill="none" stroke="${P.mol3}" stroke-width="${8 * k}"/></g><path d="M${x - 80 * k} ${base - 140 * k}L${x + 140 * k} ${base - 60 * k}" stroke="${P.snow}" stroke-width="2"/><rect x="${x + 120 * k}" y="${base - 80 * k}" width="${40 * k}" height="${60 * k}" fill="${P.mol3}" ${Sthin}/>`, shadow);
}
export function wheat(x, base, s = 1, cls = 'wheat') {
  const k = s; let st = '';
  for (let i = 0; i < 7; i++) { const dx = (i - 3) * 30 * k; st += `<path d="M${x + dx} ${base}q${(i - 3) * 4 * k} ${-120 * k} ${(i - 3) * 10 * k} ${-240 * k}" stroke="${P.amber}" stroke-width="${6 * k}" fill="none"/>${[0, 1, 2, 3, 4].map((j) => `<ellipse cx="${x + dx + (i - 3) * 10 * k}" cy="${base - 250 * k + j * 22 * k}" rx="${9 * k}" ry="${14 * k}" fill="${P.amber2}" ${Sthin}/>`).join('')}`; }
  return g(cls, st, shadow);
}
export function phone(x, y, s = 1, cls = 'phone', inner = '') {
  const k = s;
  return g(cls, `<rect x="${x - 130 * k}" y="${y - 260 * k}" width="${260 * k}" height="${520 * k}" rx="${34 * k}" fill="${P.ink}" ${S}/><rect x="${x - 110 * k}" y="${y - 220 * k}" width="${220 * k}" height="${430 * k}" rx="${10 * k}" fill="${P.snow}"/>${inner}`, shadow);
}
export function itTower(x, base, s = 1, cls = 'it') {
  const k = s; let w = '';
  for (let r = 0; r < 10; r++) w += `<rect x="${x - 120 * k}" y="${base - 560 * k + r * 52 * k}" width="${240 * k}" height="${30 * k}" fill="#9FD0E8" opacity="0.8"/>`;
  return g(cls, `<rect x="${x - 140 * k}" y="${base - 580 * k}" width="${280 * k}" height="${580 * k}" fill="${P.slate}" ${S}/>${w}`, shadow);
}
