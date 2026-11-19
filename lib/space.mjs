// Ink & Amber — space set: deep-space backgrounds, shaded planets, rockets, spacecraft, mission control.
import { P, g, S, Sthin, shadow, label, person, rng } from './inkamber.mjs';

export const SP = { void: '#120E1F', void2: '#221A35', nebA: '#B8631A', nebB: '#A23B2A', ocean: '#2F5F7E', ocean2: '#1E3D55', land: '#7C8A4A', land2: '#A89A5A', mars: '#C9643A', mars2: '#8E3A1E', mars3: '#E0905E', gold: '#D9A43A', gold2: '#A8741E', panel: '#2E4A7A' };

export function spaceDefs() {
  return `<svg width="0" height="0" style="position:absolute"><defs>
  <radialGradient id="neb1" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${SP.nebA}" stop-opacity="0.45"/><stop offset="1" stop-color="${SP.nebA}" stop-opacity="0"/></radialGradient>
  <radialGradient id="neb2" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${SP.nebB}" stop-opacity="0.4"/><stop offset="1" stop-color="${SP.nebB}" stop-opacity="0"/></radialGradient>
  <linearGradient id="voidg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${SP.void}"/><stop offset="1" stop-color="${SP.void2}"/></linearGradient>
  <radialGradient id="earthg" cx="0.38" cy="0.35" r="0.75"><stop offset="0" stop-color="#4C86A6"/><stop offset="0.6" stop-color="${SP.ocean}"/><stop offset="1" stop-color="${SP.ocean2}"/></radialGradient>
  <radialGradient id="marsg" cx="0.38" cy="0.35" r="0.75"><stop offset="0" stop-color="${SP.mars3}"/><stop offset="0.55" stop-color="${SP.mars}"/><stop offset="1" stop-color="${SP.mars2}"/></radialGradient>
  <radialGradient id="atmo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.82" stop-color="#9FD0E8" stop-opacity="0"/><stop offset="0.9" stop-color="#9FD0E8" stop-opacity="0.55"/><stop offset="1" stop-color="#9FD0E8" stop-opacity="0"/></radialGradient>
  <radialGradient id="matmo" cx="0.5" cy="0.5" r="0.5"><stop offset="0.84" stop-color="#F0B37A" stop-opacity="0"/><stop offset="0.91" stop-color="#F0B37A" stop-opacity="0.45"/><stop offset="1" stop-color="#F0B37A" stop-opacity="0"/></radialGradient>
  <linearGradient id="night" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stop-color="#05030A" stop-opacity="0"/><stop offset="0.75" stop-color="#05030A" stop-opacity="0.55"/><stop offset="1" stop-color="#05030A" stop-opacity="0.8"/></linearGradient>
  <radialGradient id="sung" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFF1C9"/><stop offset="0.25" stop-color="#F0B35A"/><stop offset="1" stop-color="#F0B35A" stop-opacity="0"/></radialGradient>
  <radialGradient id="flameg" cx="0.5" cy="0.2" r="0.8"><stop offset="0" stop-color="#FFF6D8"/><stop offset="0.35" stop-color="#F0B35A"/><stop offset="0.8" stop-color="#C4583F" stop-opacity="0.6"/><stop offset="1" stop-color="#C4583F" stop-opacity="0"/></radialGradient>
  <linearGradient id="goldg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F2CB6A"/><stop offset="0.5" stop-color="${SP.gold}"/><stop offset="1" stop-color="${SP.gold2}"/></linearGradient>
  <linearGradient id="screeng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3B52"/><stop offset="1" stop-color="#10202E"/></linearGradient>
  <clipPath id="earthclip"><circle cx="0" cy="0" r="1"/></clipPath>
  </defs></svg>`;
}

// starfield in three layers (.stars1 far … .stars3 near) + nebula clouds
export function spaceBg(seed = 1, o = {}) {
  const r = rng(seed); let layers = '';
  for (let L = 1; L <= 3; L++) {
    let st = '';
    for (let i = 0; i < [140, 70, 26][L - 1]; i++) {
      const x = -200 + r() * 2320, y = -200 + r() * 1480, rad = [1.2, 2, 3.2][L - 1] * (0.6 + r() * 0.8);
      st += L === 3 && i % 3 === 0 ? `<path class="tw" d="M${x - rad * 3} ${y}H${x + rad * 3}M${x} ${y - rad * 3}V${y + rad * 3}" stroke="#FFF4DC" stroke-width="1.6" opacity="0.8"/><circle cx="${x}" cy="${y}" r="${rad}" fill="#FFF4DC"/>` : `<circle cx="${x}" cy="${y}" r="${rad}" fill="#FFF4DC" opacity="${0.5 + r() * 0.5}"/>`;
    }
    layers += `<g class="stars${L}">${st}</g>`;
  }
  const neb = o.nebula === false ? '' : `<ellipse class="neb" cx="${o.nx ?? 1450}" cy="${o.ny ?? 280}" rx="700" ry="380" fill="url(#neb1)"/><ellipse class="neb" cx="${o.nx2 ?? 300}" cy="${o.ny2 ?? 850}" rx="620" ry="320" fill="url(#neb2)"/>`;
  return `<rect x="-300" y="-300" width="2520" height="1680" fill="url(#voidg)"/>${neb}${layers}`;
}

export function sunGlow(x, y, r = 160, cls = 'sunglow') { return `<circle class="${cls}" cx="${x}" cy="${y}" r="${r}" fill="url(#sung)"/>`; }

// Earth with a stylised Indian subcontinent facing the viewer
export function earth(cx, cy, R, o = {}) {
  const k = R / 100;
  const land = `<g transform="translate(${cx} ${cy}) scale(${k})">
    <path d="M-120 -64C-80 -86 -30 -90 10 -82C40 -76 70 -86 96 -70L120 -40L120 -20C96 -24 80 -14 62 -10C48 -6 38 -16 26 -8C20 4 16 14 10 26C4 40 -2 54 -10 58C-16 50 -18 36 -24 22C-30 10 -40 4 -52 0C-66 -4 -80 -2 -96 -10L-120 -20Z" fill="${SP.land}" stroke="${P.ink}" stroke-width="${2 / k}"/>
    <path d="M-120 -20L-96 -10C-90 6 -86 30 -92 56C-98 76 -110 90 -120 96Z" fill="${SP.land2}" stroke="${P.ink}" stroke-width="${2 / k}"/>
    <path d="M14 60q6 6 2 12q-6 -2 -2 -12z" fill="${SP.land}" stroke="${P.ink}" stroke-width="${1.5 / k}"/>
    <path class="clouds" d="M-80 -40q20 -8 40 0t40 0M-40 20q16 -6 32 0M40 30q20 -8 40 0t30 0M-100 70q24 -8 48 0" stroke="#F7F1E3" stroke-width="${7 / k}" fill="none" stroke-linecap="round" opacity="0.75"/>
    ${o.marker ? `<circle class="india-dot" cx="-4" cy="20" r="${5}" fill="${P.brick}" stroke="#fff" stroke-width="${1.5}"/>` : ''}
  </g>`;
  const id = `ec${Math.round(cx)}_${Math.round(cy)}_${Math.round(R)}`;
  return g(o.cls || 'earth', `<circle cx="${cx}" cy="${cy}" r="${R * 1.12}" fill="url(#atmo)"/><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#earthg)"/><g clip-path="url(#${id})">${land}<rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="url(#night)"/></g><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ink}" stroke-width="3"/>`);
}
export function mars(cx, cy, R, o = {}) {
  const r = rng(o.seed || 4); let cr = '';
  for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = r() * R * 0.85, rr = R * (0.03 + r() * 0.08); cr += `<circle cx="${cx + Math.cos(a) * d}" cy="${cy + Math.sin(a) * d}" r="${rr}" fill="${SP.mars2}" opacity="0.55"/><circle cx="${cx + Math.cos(a) * d - rr * 0.25}" cy="${cy + Math.sin(a) * d - rr * 0.25}" r="${rr * 0.6}" fill="${SP.mars3}" opacity="0.35"/>`; }
  const id = `mc${Math.round(cx)}_${Math.round(cy)}_${Math.round(R)}`;
  return g(o.cls || 'mars', `<circle cx="${cx}" cy="${cy}" r="${R * 1.1}" fill="url(#matmo)"/><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#marsg)"/><g clip-path="url(#${id})">${cr}
    <path d="M${cx - R * 0.7} ${cy + R * 0.05}C${cx - R * 0.3} ${cy - R * 0.08} ${cx + R * 0.1} ${cy + R * 0.12} ${cx + R * 0.55} ${cy + R * 0.02}" stroke="${SP.mars2}" stroke-width="${R * 0.05}" fill="none" stroke-linecap="round" opacity="0.8"/>
    <ellipse cx="${cx - R * 0.1}" cy="${cy - R * 0.92}" rx="${R * 0.38}" ry="${R * 0.14}" fill="#F7F1E3" opacity="0.9"/>
    <circle cx="${cx - R * 0.45}" cy="${cy - R * 0.3}" r="${R * 0.12}" fill="${SP.mars3}" opacity="0.5"/>
    <rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="url(#night)"/></g><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${P.ink}" stroke-width="3"/>`);
}
export function moon(cx, cy, R, cls = 'moonb') {
  return g(cls, `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#C9C0AE" ${S}/><circle cx="${cx - R * 0.3}" cy="${cy - R * 0.2}" r="${R * 0.2}" fill="#A89F8E"/><circle cx="${cx + R * 0.3}" cy="${cy + R * 0.3}" r="${R * 0.14}" fill="#A89F8E"/><path d="M${cx} ${cy - R}A${R} ${R} 0 0 1 ${cx} ${cy + R}A${R * 0.5} ${R} 0 0 0 ${cx} ${cy - R}z" fill="#05030A" opacity="0.45"/>`);
}

// Mangalyaan: gold box, one solar wing (3 panels), dish antenna on top, engine at the bottom
export function mom(x, y, s = 1, o = {}) {
  const w = 120 * s, h = 120 * s;
  let crinkle = '';
  for (let i = 0; i < 7; i++) crinkle += `<path d="M${x - w / 2 + 8 * s} ${y - h / 2 + 14 * s + i * 15 * s}q${15 * s} ${-6 * s} ${30 * s} 0t${30 * s} 0t${30 * s} 0t${30 * s} 0" stroke="${SP.gold2}" stroke-width="${1.6 * s}" fill="none" opacity="0.7"/>`;
  let panels = '';
  for (let i = 0; i < 3; i++) {
    const px = x + w / 2 + 40 * s + i * 96 * s;
    panels += `<rect x="${px}" y="${y - 50 * s}" width="${90 * s}" height="${100 * s}" fill="${SP.panel}" stroke="${P.ink}" stroke-width="${3 * s}"/>`;
    for (let j = 1; j < 4; j++) panels += `<line x1="${px + j * 22.5 * s}" y1="${y - 50 * s}" x2="${px + j * 22.5 * s}" y2="${y + 50 * s}" stroke="#8FB0D8" stroke-width="${1.2 * s}" opacity="0.6"/>`;
    panels += `<line x1="${px}" y1="${y}" x2="${px + 90 * s}" y2="${y}" stroke="#8FB0D8" stroke-width="${1.2 * s}" opacity="0.6"/>`;
  }
  const flame = `<g class="flame"><path d="M${x - 16 * s} ${y + h / 2 + 30 * s}Q${x} ${y + h / 2 + 170 * s} ${x + 16 * s} ${y + h / 2 + 30 * s}z" fill="url(#flameg)"/></g>`;
  return g(o.cls || 'mom', `${o.flame ? flame : ''}<path d="M${x - 16 * s} ${y + h / 2}h${32 * s}l${8 * s} ${30 * s}h${-48 * s}z" fill="${P.ink2}" ${Sthin}/>
    <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2 + 40 * s}" y2="${y}" stroke="${P.ink}" stroke-width="${5 * s}"/>${panels}
    <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="url(#goldg)" stroke="${P.ink}" stroke-width="${3.5 * s}"/>${crinkle}
    <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="url(#hatch)" opacity="0.35"/>
    <line x1="${x}" y1="${y - h / 2}" x2="${x}" y2="${y - h / 2 - 34 * s}" stroke="${P.ink}" stroke-width="${5 * s}"/>
    <path d="M${x - 70 * s} ${y - h / 2 - 40 * s}Q${x} ${y - h / 2 - 4 * s} ${x + 70 * s} ${y - h / 2 - 40 * s}z" fill="#E9E2D0" stroke="${P.ink}" stroke-width="${3 * s}"/><line x1="${x}" y1="${y - h / 2 - 22 * s}" x2="${x}" y2="${y - h / 2 - 64 * s}" stroke="${P.ink}" stroke-width="${3 * s}"/><circle cx="${x}" cy="${y - h / 2 - 66 * s}" r="${5 * s}" fill="${P.ink}"/>`);
}

// PSLV-XL: core with fairing + six strap-ons (three visible)
export function pslv(x, base, s = 1, o = {}) {
  const core = `<rect x="${x - 26 * s}" y="${base - 560 * s}" width="${52 * s}" height="${560 * s}" fill="#ECE6D6" ${S}/>
    <rect x="${x - 26 * s}" y="${base - 330 * s}" width="${52 * s}" height="${18 * s}" fill="${P.slate}"/><rect x="${x - 26 * s}" y="${base - 470 * s}" width="${52 * s}" height="${12 * s}" fill="${P.ink2}"/>
    <path d="M${x - 34 * s} ${base - 560 * s}v${-110 * s}q${0} ${-70 * s} ${34 * s} ${-100 * s}q${34 * s} ${30 * s} ${34 * s} ${100 * s}v${110 * s}z" fill="#F4EFE2" ${S}/>
    <rect x="${x - 14 * s}" y="${base - 300 * s}" width="${28 * s}" height="${14 * s}" fill="${P.amber2}"/><rect x="${x - 14 * s}" y="${base - 286 * s}" width="${28 * s}" height="${14 * s}" fill="#F7F1E3" ${Sthin}/><rect x="${x - 14 * s}" y="${base - 272 * s}" width="${28 * s}" height="${14 * s}" fill="${P.olive}"/>
    ${label(x, base - 160 * s, 'ISRO', { font: 'Oswald', weight: 700, size: 30 * s, color: P.slate, extra: `transform="rotate(-90 ${x} ${base - 160 * s})" dy="${10 * s}"` })}`;
  let straps = '';
  for (const dx of [-52, 52]) straps += `<rect x="${x + dx * s - 13 * s}" y="${base - 230 * s}" width="${26 * s}" height="${220 * s}" fill="#DDD5C2" ${Sthin}/><path d="M${x + dx * s - 13 * s} ${base - 230 * s}l${13 * s} ${-36 * s}l${13 * s} ${36 * s}z" fill="#DDD5C2" ${Sthin}/>`;
  const fire = o.fire ? `<g class="fire"><path d="M${x - 60 * s} ${base}Q${x} ${base + 380 * s} ${x + 60 * s} ${base}z" fill="url(#flameg)"/><path d="M${x - 30 * s} ${base}Q${x} ${base + 220 * s} ${x + 30 * s} ${base}z" fill="#FFF6D8"/></g>` : '';
  return g(o.cls || 'pslv', `${fire}${core}${straps}`);
}
export function launchTower(x, base, s = 1, cls = 'tower') {
  let lat = '';
  for (let i = 0; i < 9; i++) lat += `<path d="M${x} ${base - i * 80 * s}l${80 * s} ${-80 * s}M${x + 80 * s} ${base - i * 80 * s}l${-80 * s} ${-80 * s}" stroke="${P.brick}" stroke-width="${3 * s}" opacity="0.8"/>`;
  return g(cls, `<rect x="${x}" y="${base - 720 * s}" width="${80 * s}" height="${720 * s}" fill="none" stroke="${P.brick}" stroke-width="${8 * s}"/>${lat}`, shadow);
}
export function cloudsOfSmoke(x, y, n = 8, s = 1, cls = 'plume') {
  let o = '';
  for (let i = 0; i < n; i++) o += `<circle class="pc pc${i}" cx="${x + (i - n / 2) * 70 * s}" cy="${y + (i % 2) * 20 * s}" r="${(60 + (i % 3) * 25) * s}" fill="#EDE6D6" stroke="${P.ink2}" stroke-width="3"/>`;
  return g(cls, o);
}
export function ellipseOrbit(cx, cy, rx, ry, cls = 'orbit', o = {}) {
  return `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${o.color || '#E9DCC0'}" stroke-width="${o.w || 4}" stroke-dasharray="${o.dash || '10 12'}" opacity="${o.op ?? 0.85}"/>`;
}
export function arcPath(d, cls = 'arc', color = P.amber3, w = 6) {
  return `<path class="${cls}" d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>`;
}
export function signal(x1, y1, x2, y2, n = 5, cls = 'sig') {
  let a = '';
  const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  for (let i = 0; i < n; i++) a += `<path class="w w${i}" d="M0 -26Q16 0 0 26" stroke="#9FD0E8" stroke-width="5" fill="none" stroke-linecap="round" transform="translate(${x1} ${y1}) rotate(${ang})"/>`;
  return g(cls, `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9FD0E8" stroke-width="2" stroke-dasharray="6 10" opacity="0.6"/>${a}`);
}
export function screen(x, y, w, h, inner = '', cls = 'screen') {
  return g(cls, `<rect x="${x - 8}" y="${y - 8}" width="${w + 16}" height="${h + 16}" rx="8" fill="${P.ink}" ${Sthin}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#screeng)"/>${inner}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#9FD0E8" opacity="0.06"/>`);
}
const SK = ['#B07A52', '#9C6942', '#C48E62', '#8C5C3A', '#B98458'];
export function controlRoom(o = {}) {
  const wall = screen(360, 90, 1200, 380, `${ellipseOrbit(960, 300, 380, 120, 'wallorbit', { color: '#9FD0E8', w: 3 })}<circle cx="700" cy="300" r="40" fill="${SP.ocean}" stroke="#9FD0E8" stroke-width="2"/><circle cx="1260" cy="290" r="28" fill="${SP.mars}" stroke="#F0B37A" stroke-width="2"/><circle class="blip" cx="1100" cy="190" r="10" fill="#F0B35A"/>${o.wallText || ''}`, 'screen wall');
  let consoles = '';
  for (let row = 0; row < 2; row++) for (let i = 0; i < 5; i++) {
    const x = 120 + i * 360 + (row ? 120 : 0), y = 640 + row * 190;
    consoles += `<g class="console">${person(x + 60, y + 30, 0.8, { coat: [P.snow, P.slate3, P.paper2, P.olive2][(i + row) % 4], hat: 'none', skin: SK[(i + row * 2) % 5] })}${screen(x + 120, y - 78, 120, 70, `<path d="M${x + 126} ${y - 36}l20 -14l20 8l20 -22l20 12l16 -8" stroke="#9FD0E8" stroke-width="3" fill="none"/>`, 'screen sm')}<rect x="${x}" y="${y}" width="250" height="70" fill="${P.ink2}" ${Sthin}/></g>`;
  }
  return `<rect x="-200" y="-200" width="2320" height="1480" fill="#2A2235"/><rect x="-200" y="560" width="2320" height="800" fill="#3A2F45"/>${wall}${consoles}`;
}
export function autoRickshaw(x, y, s = 1, cls = 'auto') {
  return g(cls, `<path d="M${x - 140 * s} ${y - 40 * s}v${-90 * s}q${0} ${-60 * s} ${60 * s} ${-60 * s}h${120 * s}q${40 * s} 0 ${50 * s} ${40 * s}l${30 * s} ${110 * s}z" fill="${P.olive2}" ${S}/><path d="M${x - 150 * s} ${y - 150 * s}q${10 * s} ${-60 * s} ${80 * s} ${-60 * s}h${120 * s}q${50 * s} 0 ${60 * s} ${50 * s}" fill="${P.ink}" ${S}/>
    <rect x="${x - 150 * s}" y="${y - 50 * s}" width="${280 * s}" height="${30 * s}" fill="${P.amber3}" ${S}/><rect x="${x - 60 * s}" y="${y - 130 * s}" width="${70 * s}" height="${60 * s}" fill="#9FD0E8" opacity="0.7" ${Sthin}/>
    <circle cx="${x - 110 * s}" cy="${y - 10 * s}" r="${26 * s}" fill="${P.ink}" ${S}/><circle cx="${x + 100 * s}" cy="${y - 10 * s}" r="${26 * s}" fill="${P.ink}" ${S}/>`, shadow);
}
export function clapper(x, y, s = 1, cls = 'clap') {
  return g(cls, `<rect x="${x}" y="${y}" width="${240 * s}" height="${150 * s}" fill="${P.ink}" ${S}/><path d="M${x} ${y}l${10 * s} ${-50 * s}h${230 * s}l${-10 * s} ${50 * s}z" fill="${P.snow}" ${S}/>${[0, 1, 2, 3].map((i) => `<path d="M${x + 30 * s + i * 55 * s} ${y - 48 * s}l${-20 * s} ${46 * s}h${22 * s}l${20 * s} ${-46 * s}z" fill="${P.ink}"/>`).join('')}`, shadow);
}
export function cow(x, y, s = 1, cls = 'cow') {
  return g(cls, `<rect x="${x - 100 * s}" y="${y - 120 * s}" width="${170 * s}" height="${80 * s}" rx="${30 * s}" fill="${P.snow}" ${S}/><circle cx="${x - 40 * s}" cy="${y - 90 * s}" r="${14 * s}" fill="${P.ink2}"/><path d="M${x + 60 * s} ${y - 110 * s}l${40 * s} ${-20 * s}l${16 * s} ${36 * s}l${-30 * s} ${20 * s}z" fill="${P.snow}" ${S}/><path d="M${x + 96 * s} ${y - 130 * s}l${10 * s} ${-18 * s}M${x + 80 * s} ${y - 126 * s}l${-6 * s} ${-18 * s}" ${S}/><path d="M${x - 80 * s} ${y - 40 * s}v${40 * s}M${x - 50 * s} ${y - 40 * s}v${40 * s}M${x + 20 * s} ${y - 40 * s}v${40 * s}M${x + 50 * s} ${y - 40 * s}v${40 * s}" ${S}/>`, shadow);
}
export function note2000(x, y, s = 1, cls = 'note') {
  return g(cls, `<rect x="${x}" y="${y}" width="${520 * s}" height="${240 * s}" rx="12" fill="#D98AB4" ${S}/><rect x="${x + 16 * s}" y="${y + 16 * s}" width="${488 * s}" height="${208 * s}" rx="8" fill="none" stroke="#8E3A6A" stroke-width="3" stroke-dasharray="8 6"/>${label(x + 440 * s, y + 80 * s, '₹2000', { font: 'Oswald', weight: 700, size: 52 * s, color: '#5A1E40' })}<circle cx="${x + 170 * s}" cy="${y + 130 * s}" r="${80 * s}" fill="#E7B2CF" stroke="#8E3A6A" stroke-width="3"/>${mom(x + 150 * s, y + 135 * s, 0.38 * s, { cls: 'mini' })}`, shadow);
}
