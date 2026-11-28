// Mumbai / 26-11 artwork: landmarks, boats, figures (attackers are faceless silhouettes, no weapons drawn), schematic city map.
import * as L from './inkamber.mjs';
import * as E from './epic.mjs';
const { P, g, S, Sthin, shadow } = L;
const f = (n) => Math.round(n * 10) / 10;

export const MB = { night: '#1B2230', night2: '#2C3546', basalt: '#8E8070', taj: '#D9C7A0', tajR: '#A23B2A', gothic: '#C8AE86', lamp: '#FFD27A', khaki: '#B49A5E', ns: '#23262B', sea: '#3C5868' };

export function mumbaiDefs() {
  return `<svg width="0" height="0" style="position:absolute"><defs>
  <linearGradient id="mnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121826"/><stop offset="0.7" stop-color="#2C3546"/><stop offset="1" stop-color="#4A4652"/></linearGradient>
  <linearGradient id="mdawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6B86"/><stop offset="0.55" stop-color="#D99A6C"/><stop offset="1" stop-color="#F3D29A"/></linearGradient>
  <linearGradient id="mseag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E4554"/><stop offset="1" stop-color="#16222C"/></linearGradient>
  <radialGradient id="fireg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFB347" stop-opacity="0.85"/><stop offset="0.5" stop-color="#E0562B" stop-opacity="0.35"/><stop offset="1" stop-color="#E0562B" stop-opacity="0"/></radialGradient>
  <radialGradient id="candleg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE3A0" stop-opacity="0.9"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
  <radialGradient id="pulseg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#E0402B" stop-opacity="0.9"/><stop offset="1" stop-color="#E0402B" stop-opacity="0"/></radialGradient>
  </defs></svg>`;
}

export const nightSky = (seed = 4) => {
  const r = L.rng(seed); let st = '';
  for (let i = 0; i < 90; i++) st += `<circle cx="${f(-100 + r() * 2120)}" cy="${f(-100 + r() * 620)}" r="${f(1 + r() * 2.2)}" fill="#FFF4DC" opacity="${f(0.3 + r() * 0.6)}"/>`;
  return `<rect x="-200" y="-200" width="2320" height="1480" fill="url(#mnight)"/><g class="stars">${st}</g>`;
};
export const moon = (x, y, r = 50) => `<circle class="moon" cx="${x}" cy="${y}" r="${r * 2.2}" fill="url(#candleg)" opacity="0.35"/><circle cx="${x}" cy="${y}" r="${r}" fill="#F3E6C4" ${Sthin}/><circle cx="${x + r * 0.35}" cy="${y - r * 0.2}" r="${r * 0.82}" fill="#2C3546" opacity="0.25"/>`;
export const sea = (y, fill = 'url(#mseag)') => `<rect x="-200" y="${y}" width="2320" height="${1280 - y}" fill="${fill}"/>${Array.from({ length: 7 }, (_, i) => `<path class="wave w${i % 3}" d="M${-200 + (i % 2) * 120} ${y + 40 + i * 48}${Array.from({ length: 12 }, (_, j) => `q60 -14 120 0t120 0`).join('')}" stroke="#9DB0B5" stroke-width="3" fill="none" opacity="0.35"/>`).join('')}`;

// lit/unlit window grid
function windows(x, y, cols, rows, w, h, gx, gy, seed, lit = 0.6, cls = 'win') {
  const r = L.rng(seed); let o = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const on = r() < lit;
    o += `<rect class="${cls}${on ? ' on' : ''}" x="${f(x + i * gx)}" y="${f(y + j * gy)}" width="${w}" height="${h}" rx="${w / 2.2}" fill="${on ? MB.lamp : '#3A3440'}" stroke="${P.ink}" stroke-width="2"/>`;
  }
  return o;
}

// Taj Mahal Palace: central red dome, corner turrets with small domes, arched window rows
export function tajHotel(x, base, s = 1, o = {}) {
  const k = s, w = 900 * k, h = 380 * k, x0 = x - w / 2, top = base - h;
  const turret = (cx) => `<rect x="${f(cx - 50 * k)}" y="${f(top - 70 * k)}" width="${f(100 * k)}" height="${f(h + 70 * k)}" fill="${MB.taj}" ${S}/><path d="M${f(cx - 58 * k)} ${f(top - 70 * k)}q${f(58 * k)} ${f(-110 * k)} ${f(116 * k)} 0z" fill="${MB.tajR}" ${S}/><line x1="${cx}" y1="${f(top - 125 * k)}" x2="${cx}" y2="${f(top - 150 * k)}" stroke="${P.ink}" stroke-width="${f(5 * k)}"/>${windows(cx - 30 * k, top - 40 * k, 2, 6, 18 * k, 30 * k, 42 * k, 62 * k, Math.round(cx), o.lit ?? 0.55)}`;
  const dome = `<g class="tdome"><rect x="${f(x - 120 * k)}" y="${f(top - 60 * k)}" width="${f(240 * k)}" height="${f(60 * k)}" fill="${MB.taj}" ${S}/><path d="M${f(x - 150 * k)} ${f(top - 60 * k)}q${f(10 * k)} ${f(-230 * k)} ${f(150 * k)} ${f(-250 * k)}q${f(140 * k)} ${f(20 * k)} ${f(150 * k)} ${f(250 * k)}z" fill="${MB.tajR}" ${S}/><path d="M${f(x - 70 * k)} ${f(top - 80 * k)}q${f(10 * k)} ${f(-130 * k)} ${f(70 * k)} ${f(-210 * k)}M${f(x + 70 * k)} ${f(top - 80 * k)}q${f(-10 * k)} ${f(-130 * k)} ${f(-70 * k)} ${f(-210 * k)}" stroke="${P.ink}" stroke-width="${f(3 * k)}" fill="none" opacity="0.5"/><line x1="${x}" y1="${f(top - 310 * k)}" x2="${x}" y2="${f(top - 350 * k)}" stroke="${P.ink}" stroke-width="${f(6 * k)}"/><circle cx="${x}" cy="${f(top - 312 * k)}" r="${f(9 * k)}" fill="${P.amber3}" ${Sthin}/></g>`;
  const fire = o.fire ? `<circle class="tfire" cx="${x}" cy="${f(top - 140 * k)}" r="${f(260 * k)}" fill="url(#fireg)"/>${L.smoke(x, top - 300 * k, 5, 'smoke tsmoke', 2.4 * k)}` : '';
  return g(o.cls || 'taj', `${fire}<rect x="${f(x0)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${MB.taj}" ${S}/>${windows(x0 + 80 * k, top + 34 * k, 18, 6, 22 * k, 34 * k, 41 * k, 58 * k, 7, o.lit ?? 0.55)}<rect x="${f(x0)}" y="${f(top - 12 * k)}" width="${f(w)}" height="${f(14 * k)}" fill="${P.paper2}" ${Sthin}/>${dome}${turret(x0 + 40 * k)}${turret(x0 + w - 40 * k)}<rect x="${f(x - 60 * k)}" y="${f(base - 70 * k)}" width="${f(120 * k)}" height="${f(70 * k)}" rx="${f(50 * k)}" fill="${P.ink2}" ${S}/>`, shadow);
}

// Gateway of India
export function gateway(x, base, s = 1, cls = 'gateway') {
  const k = s, w = 420 * k, h = 340 * k, x0 = x - w / 2, top = base - h;
  const tur = (cx) => `<rect x="${f(cx - 24 * k)}" y="${f(top - 60 * k)}" width="${f(48 * k)}" height="${f(60 * k)}" fill="${MB.basalt}" ${Sthin}/><path d="M${f(cx - 28 * k)} ${f(top - 60 * k)}q${f(28 * k)} ${f(-40 * k)} ${f(56 * k)} 0z" fill="${MB.basalt}" ${Sthin}/>`;
  return g(cls, `<rect x="${f(x0)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${MB.basalt}" ${S}/><path d="M${f(x - 90 * k)} ${base}v${f(-170 * k)}q${f(90 * k)} ${f(-110 * k)} ${f(180 * k)} 0v${f(170 * k)}z" fill="${MB.night2}" ${S}/><path d="M${f(x0 + 30 * k)} ${base}v${f(-110 * k)}q${f(25 * k)} ${f(-36 * k)} ${f(50 * k)} 0v${f(110 * k)}zM${f(x0 + w - 80 * k)} ${base}v${f(-110 * k)}q${f(25 * k)} ${f(-36 * k)} ${f(50 * k)} 0v${f(110 * k)}z" fill="${MB.night2}" ${Sthin}/><rect x="${f(x0 - 10 * k)}" y="${f(top + 40 * k)}" width="${f(w + 20 * k)}" height="${f(14 * k)}" fill="${P.ink3}" ${Sthin}/>${tur(x0 + 30 * k)}${tur(x0 + 140 * k)}${tur(x0 + w - 140 * k)}${tur(x0 + w - 30 * k)}`, shadow);
}

// Chhatrapati Shivaji Terminus: gothic station, central dome tower with clock
export function cst(x, base, s = 1, o = {}) {
  const k = s, w = 1000 * k, h = 300 * k, x0 = x - w / 2, top = base - h;
  const gable = (cx, ww) => `<path d="M${f(cx - ww / 2)} ${f(top)}l${f(ww / 2)} ${f(-90 * k)}l${f(ww / 2)} ${f(90 * k)}z" fill="${MB.gothic}" ${S}/><path d="M${f(cx - 4 * k)} ${f(top - 90 * k)}v${f(-40 * k)}" stroke="${P.ink}" stroke-width="${f(5 * k)}"/>`;
  let arches = '';
  for (let i = 0; i < 12; i++) { const ax = x0 + 50 * k + i * 78 * k; arches += `<path class="arch${i % 3}" d="M${f(ax)} ${f(base - 20 * k)}v${f(-90 * k)}q${f(22 * k)} ${f(-40 * k)} ${f(44 * k)} 0v${f(90 * k)}z" fill="${o.lit === 0 ? '#3A3440' : MB.lamp}" stroke="${P.ink}" stroke-width="2.5"/>`; }
  return g(o.cls || 'cst', `<rect x="${f(x0)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${MB.gothic}" ${S}/><rect x="${f(x0)}" y="${f(top + 60 * k)}" width="${f(w)}" height="${f(12 * k)}" fill="${P.brick2}" ${Sthin}/>${windows(x0 + 60 * k, top + 100 * k, 12, 1, 26 * k, 50 * k, 78 * k, 0, 3, 0.7)}${arches}${gable(x0 + 120 * k, 200 * k)}${gable(x0 + w - 120 * k, 200 * k)}
    <rect x="${f(x - 130 * k)}" y="${f(top - 160 * k)}" width="${f(260 * k)}" height="${f(160 * k)}" fill="${MB.gothic}" ${S}/><path d="M${f(x - 150 * k)} ${f(top - 160 * k)}q${f(150 * k)} ${f(-240 * k)} ${f(300 * k)} 0z" fill="#6F8A6A" ${S}/><path d="M${x} ${f(top - 340 * k)}v${f(-50 * k)}" stroke="${P.ink}" stroke-width="${f(7 * k)}"/><circle cx="${x}" cy="${f(top - 345 * k)}" r="${f(12 * k)}" fill="${P.amber3}" ${Sthin}/>${L.clock(x, top - 80 * k, 56 * k, 'clock cstclock')}`, shadow);
}

// tall modern hotel tower (Oberoi-Trident)
export function tower(x, base, s = 1, o = {}) {
  const k = s, w = 300 * k, h = 640 * k;
  return g(o.cls || 'tower', `${o.fire ? `<circle class="tfire" cx="${x}" cy="${f(base - h * 0.6)}" r="${f(200 * k)}" fill="url(#fireg)"/>` : ''}<rect x="${f(x - w / 2)}" y="${f(base - h)}" width="${f(w)}" height="${f(h)}" fill="#B9B1A2" ${S}/><path d="M${f(x - w / 2)} ${f(base - h)}q${f(w / 2)} ${f(-60 * k)} ${w} 0" fill="#B9B1A2" ${S}/>${windows(x - w / 2 + 26 * k, base - h + 30 * k, 6, 14, 22 * k, 22 * k, 42 * k, 42 * k, 11, o.lit ?? 0.5)}`, shadow);
}

// generic city building with optional sign / awning / red cross
export function bldg(x, base, w, h, o = {}) {
  const cols = Math.max(2, Math.floor((w - 40) / 60)), rows = Math.max(1, Math.floor((h - 90) / 70));
  const sign = o.sign ? `<rect x="${f(x - w / 2 + 20)}" y="${f(base - h + 16)}" width="${w - 40}" height="54" fill="${o.signFill || P.ink}" ${Sthin}/>${L.label(x, base - h + 56, o.sign, { font: "'Mukta', Oswald", weight: 700, size: 34, color: o.signColor || P.amber3 })}` : '';
  const awn = o.awning ? Array.from({ length: Math.floor(w / 40) }, (_, i) => `<path d="M${f(x - w / 2 + i * 40)} ${base - 120}h40l-6 30h-28z" fill="${i % 2 ? P.snow : o.awning}" stroke="${P.ink}" stroke-width="2"/>`).join('') : '';
  const cross = o.cross ? `<rect x="${x - 14}" y="${base - h - 70}" width="28" height="70" fill="${P.brick}" ${Sthin}/><rect x="${x - 35}" y="${base - h - 49}" width="70" height="28" fill="${P.brick}" ${Sthin}/>` : '';
  return g(o.cls || 'bldg', `<rect x="${f(x - w / 2)}" y="${f(base - h)}" width="${w}" height="${h}" fill="${o.fill || P.paper3}" ${S}/>${windows(x - w / 2 + 30, base - h + (o.sign ? 96 : 30), cols, rows, 26, 40, (w - 60) / cols, 70, o.seed || 5, o.lit ?? 0.6)}${sign}${awn}${cross}<rect x="${x - 34}" y="${base - 80}" width="68" height="80" fill="${P.ink2}" ${Sthin}/>`, shadow);
}

export function dinghy(x, y, s = 1, cls = 'dinghy', n = 10) {
  const k = s; let heads = '';
  for (let i = 0; i < n; i++) heads += `<circle cx="${f(x - 150 * k + i * 32 * k)}" cy="${f(y - 46 * k - (i % 2) * 4 * k)}" r="${f(13 * k)}" fill="#1E1A17"/><rect x="${f(x - 162 * k + i * 32 * k)}" y="${f(y - 36 * k)}" width="${f(24 * k)}" height="${f(20 * k)}" fill="#1E1A17"/>`;
  return g(cls, `${heads}<path d="M${f(x - 190 * k)} ${f(y - 20 * k)}h${f(360 * k)}q${f(40 * k)} 0 ${f(40 * k)} ${f(20 * k)}t${f(-40 * k)} ${f(20 * k)}h${f(-360 * k)}q${f(-30 * k)} 0 ${f(-30 * k)} ${f(-20 * k)}t${f(30 * k)} ${f(-20 * k)}z" fill="#E3C25A" ${S}/><rect x="${f(x - 236 * k)}" y="${f(y - 40 * k)}" width="${f(30 * k)}" height="${f(50 * k)}" fill="${P.ink}" ${Sthin}/>`, shadow);
}
export function trawler(x, y, s = 1, o = {}) {
  const k = s;
  return g(o.cls || 'trawler', `<line x1="${f(x + 60 * k)}" y1="${f(y - 40 * k)}" x2="${f(x + 60 * k)}" y2="${f(y - 260 * k)}" stroke="${P.ink}" stroke-width="${f(8 * k)}"/><path d="M${f(x + 60 * k)} ${f(y - 250 * k)}L${f(x + 230 * k)} ${f(y - 50 * k)}M${f(x + 60 * k)} ${f(y - 250 * k)}L${f(x - 150 * k)} ${f(y - 50 * k)}" stroke="${P.ink}" stroke-width="${f(3 * k)}"/><rect x="${f(x - 120 * k)}" y="${f(y - 130 * k)}" width="${f(130 * k)}" height="${f(90 * k)}" fill="${P.snow}" ${S}/><rect x="${f(x - 100 * k)}" y="${f(y - 112 * k)}" width="${f(36 * k)}" height="${f(30 * k)}" fill="#6F8792" ${Sthin}/><rect x="${f(x - 50 * k)}" y="${f(y - 112 * k)}" width="${f(36 * k)}" height="${f(30 * k)}" fill="#6F8792" ${Sthin}/>
    <path d="M${f(x - 230 * k)} ${f(y - 50 * k)}h${f(500 * k)}l${f(-40 * k)} ${f(70 * k)}h${f(-420 * k)}z" fill="${o.hull || '#2F6F8A'}" ${S}/><path d="M${f(x - 222 * k)} ${f(y - 34 * k)}h${f(484 * k)}" stroke="${P.snow}" stroke-width="${f(6 * k)}"/>${o.name ? L.label(x + 100 * k, y + 4 * k, o.name, { font: "'Baloo 2', Oswald", weight: 800, size: f(34 * k), color: P.snow }) : ''}`, shadow);
}

// faceless silhouette (attacker) — dark, no weapon drawn
export function shade(x, y, s = 1, i = 0, cls = 'shade') {
  return g(cls, `${L.person(x, y, s, { coat: '#1E1A17', skin: '#2A2420', hat: 'none', pose: i % 3 === 1 ? 'run' : undefined, cls: 'sh' })}<rect x="${f(x - 46 * s)}" y="${f(y - 122 * s)}" width="${f(26 * s)}" height="${f(52 * s)}" rx="${f(6 * s)}" fill="#14110F"/>`);
}
export function commando(x, y, s = 1, i = 0, o = {}) {
  return E.figure(x, y, s, { gear: 'kevlar', coat: MB.ns, weapon: o.weapon ?? 'rifle', i, pose: o.pose, cls: o.cls || 'fig cmd', hatColor: MB.ns });
}
export function cop(x, y, s = 1, i = 0, o = {}) {
  const lathi = o.lathi ? `<path d="M${f(x + 30 * s)} ${f(y - 70 * s)}L${f(x + 50 * s)} ${f(y - 180 * s)}" stroke="${P.ink2}" stroke-width="${f(9 * s)}" stroke-linecap="round"/>` : '';
  return g(o.cls || 'cop', `${lathi}${L.person(x, y, s, { coat: MB.khaki, hat: 'cap', skin: ['#B07A52', '#9C6942', '#C48E62', '#8C5C3A'][i % 4], pose: o.pose })}`);
}
export function nurse(x, y, s = 1, cls = 'nurse') { return L.person(x, y, s, { coat: P.snow, hat: 'bonnet', hatColor: P.snow, skirt: true, skin: '#B07A52', cls }); }
export function civ(x, y, s = 1, i = 0, o = {}) {
  const c = [P.slate2, P.amber2, P.olive2, P.rose, P.brick2, P.slate][i % 6];
  return L.person(x, y, s, { coat: c, hat: i % 4 === 1 ? 'sari' : 'none', hatColor: c, skirt: i % 4 === 1, skin: ['#B07A52', '#9C6942', '#C48E62', '#E2B48C'][i % 4], pose: o.pose, child: o.child, cls: o.cls || 'person civ' });
}

export function candle(x, base, s = 1, cls = 'candle') {
  const k = s;
  return g(cls, `<circle class="cglow" cx="${x}" cy="${f(base - 110 * k)}" r="${f(70 * k)}" fill="url(#candleg)"/><rect x="${f(x - 16 * k)}" y="${f(base - 90 * k)}" width="${f(32 * k)}" height="${f(90 * k)}" fill="${P.snow}" ${Sthin}/><path class="flame" d="M${x} ${f(base - 136 * k)}q${f(14 * k)} ${f(22 * k)} 0 ${f(40 * k)}q${f(-14 * k)} ${f(-18 * k)} 0 ${f(-40 * k)}z" fill="#FFC24A" stroke="#E07A2B" stroke-width="2"/>`);
}
export function tv(x, y, w, h, inner = '', cls = 'tv') {
  return g(cls, `<rect x="${x - 26}" y="${y - 26}" width="${w + 52}" height="${h + 52}" rx="18" fill="${P.mol2}" ${S}/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#26313C"/>${inner}<g class="live"><rect x="${x + 20}" y="${y + 18}" width="120" height="46" rx="6" fill="#D23A2A"/>${L.label(x + 80, y + 52, 'LIVE', { font: 'Oswald', weight: 700, size: 32, color: P.snow })}</g><path d="M${x + w / 2 - 80} ${y + h + 26}l-40 70M${x + w / 2 + 80} ${y + h + 26}l40 70" stroke="${P.ink}" stroke-width="10"/>`, shadow);
}
export function satphone(x, y, s = 1, cls = 'satphone') {
  const k = s;
  return g(cls, `<rect x="${f(x - 30 * k)}" y="${f(y - 80 * k)}" width="${f(60 * k)}" height="${f(160 * k)}" rx="${f(14 * k)}" fill="${P.ink}" ${S}/><rect x="${f(x + 10 * k)}" y="${f(y - 150 * k)}" width="${f(14 * k)}" height="${f(74 * k)}" rx="5" fill="${P.ink2}" ${Sthin}/><rect x="${f(x - 20 * k)}" y="${f(y - 66 * k)}" width="${f(40 * k)}" height="${f(40 * k)}" fill="#9FD0E8"/>`, shadow);
}
export function mic(x, base, s = 1, cls = 'mic') {
  const k = s;
  return g(cls, `<path d="M${x} ${base}v${f(-150 * k)}q0 ${f(-30 * k)} ${f(30 * k)} ${f(-50 * k)}" stroke="${P.ink}" stroke-width="${f(8 * k)}" fill="none"/><rect x="${f(x + 18 * k)}" y="${f(base - 240 * k)}" width="${f(36 * k)}" height="${f(56 * k)}" rx="${f(18 * k)}" fill="${P.ink2}" ${Sthin}/><ellipse cx="${x}" cy="${base}" rx="${f(50 * k)}" ry="${f(12 * k)}" fill="${P.ink}"/>`);
}
export function medal(x, y, s = 1, cls = 'medal') {
  const k = s; let sp = '';
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; sp += `<line x1="${x}" y1="${y}" x2="${f(x + Math.cos(a) * 44 * k)}" y2="${f(y + Math.sin(a) * 44 * k)}" stroke="${P.mol2}" stroke-width="${f(2.5 * k)}"/>`; }
  return g(cls, `<path d="M${f(x - 40 * k)} ${f(y - 170 * k)}h${f(80 * k)}l${f(-10 * k)} ${f(110 * k)}h${f(-60 * k)}z" fill="#3E7C4A" ${Sthin}/><path d="M${x} ${f(y - 170 * k)}v${f(110 * k)}" stroke="${P.amber2}" stroke-width="${f(8 * k)}"/><circle cx="${x}" cy="${y}" r="${f(64 * k)}" fill="url(#goldg)" stroke="${P.ink}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${f(48 * k)}" fill="none" stroke="${P.mol2}" stroke-width="${f(4 * k)}"/>${sp}`, shadow);
}
export function car(x, y, s = 1, o = {}) {
  const k = s, c = o.color || P.slate2;
  const top = o.taxi ? `<rect x="${f(x - 120 * k)}" y="${f(y - 120 * k)}" width="${f(200 * k)}" height="${f(50 * k)}" fill="#E8C33A" ${Sthin}/>` : '';
  return g(o.cls || 'car', `<path d="M${f(x - 170 * k)} ${f(y - 30 * k)}v${f(-50 * k)}l${f(40 * k)} ${f(-50 * k)}h${f(190 * k)}l${f(50 * k)} ${f(50 * k)}h${f(30 * k)}v${f(50 * k)}z" fill="${o.taxi ? '#2A2622' : c}" ${S}/>${top}<rect x="${f(x - 115 * k)}" y="${f(y - 120 * k)}" width="${f(80 * k)}" height="${f(36 * k)}" fill="#9FB8C4" ${Sthin}/><rect x="${f(x - 20 * k)}" y="${f(y - 120 * k)}" width="${f(90 * k)}" height="${f(36 * k)}" fill="#9FB8C4" ${Sthin}/><circle cx="${f(x - 100 * k)}" cy="${f(y - 26 * k)}" r="${f(30 * k)}" fill="${P.ink}" stroke="${P.paper3}" stroke-width="${f(8 * k)}"/><circle cx="${f(x + 90 * k)}" cy="${f(y - 26 * k)}" r="${f(30 * k)}" fill="${P.ink}" stroke="${P.paper3}" stroke-width="${f(8 * k)}"/>`, shadow);
}
export function pulse(x, y, r = 46, cls = 'pulse') {
  return g(cls, `<circle class="ring" cx="${x}" cy="${y}" r="${r}" fill="url(#pulseg)"/><circle cx="${x}" cy="${y}" r="${r * 0.32}" fill="#D23A2A" stroke="${P.snow}" stroke-width="3"/>`);
}
export function barricade(x, base, s = 1, cls = 'barricade') {
  const k = s; let st = '';
  for (let i = 0; i < 6; i++) st += `<path d="M${f(x - 180 * k + i * 60 * k)} ${f(base - 80 * k)}h${f(30 * k)}l${f(-20 * k)} ${f(40 * k)}h${f(-30 * k)}z" fill="#E8C33A"/>`;
  return g(cls, `<rect x="${f(x - 190 * k)}" y="${f(base - 80 * k)}" width="${f(380 * k)}" height="${f(40 * k)}" fill="${P.ink}" ${Sthin}/>${st}<path d="M${f(x - 160 * k)} ${f(base - 40 * k)}v${f(40 * k)}M${f(x + 160 * k)} ${f(base - 40 * k)}v${f(40 * k)}" stroke="${P.ink}" stroke-width="${f(10 * k)}"/>`, shadow);
}
export function lamp(x, base, h = 300, cls = 'lamp') {
  return g(cls, `<circle cx="${x + 40}" cy="${base - h + 10}" r="90" fill="url(#candleg)" opacity="0.7"/><path d="M${x} ${base}v${-h}h40" stroke="${P.ink}" stroke-width="8" fill="none"/><path d="M${x + 22} ${base - h + 6}h40l-8 16h-24z" fill="${MB.lamp}" ${Sthin}/>`);
}

// ---------- schematic South Mumbai (not to scale) ----------
const smooth = (pts) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
  }
  return d;
};
const LAND = [[300, -120], [330, 120], [420, 250], [540, 236], [690, 262], [770, 320], [840, 440], [850, 560], [760, 640], [770, 740], [820, 880], [870, 990], [930, 1110], [1010, 1080], [1010, 960], [1040, 860], [1100, 770], [1150, 640], [1220, 480], [1290, 300], [1340, 100], [1360, -120]];
export const MPL = {
  chowpatty: [760, 300], cst: [1110, 420], cama: [1050, 360], rangbhavan: [1000, 395], wadibunder: [1250, 250], oberoi: [790, 630], leopold: [990, 800], taj: [1075, 775], gateway: [1110, 745], nariman: [930, 860], badhwar: [835, 915],
};
export function mumbaiMap(o = {}) {
  const roads = `<path d="${smooth([[1110, 420], [1060, 560], [1010, 700], [990, 800], [940, 900]])}M${smooth([[760, 300], [840, 440], [830, 560], [790, 630]])}M${smooth([[1000, 395], [880, 340], [760, 300]])}" stroke="${P.paper}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  return `<rect x="-200" y="-200" width="2320" height="1480" fill="${o.seaFill || '#7E96A0'}"/><rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.18"/>
  <path class="mland" d="${smooth(LAND)}L1500 -200L200 -200Z" fill="${o.landFill || P.paper2}" stroke="${P.ink}" stroke-width="5"/>${roads}
  ${L.label(380, 700, 'अरब सागर', { font: "'Baloo 2', Oswald", weight: 800, size: 56, color: '#3C5868', extra: 'letter-spacing="4" opacity="0.8"' })}${L.label(1500, 900, 'मुंबई बंदरगाह', { font: "'Baloo 2', Oswald", weight: 800, size: 46, color: '#3C5868', extra: 'opacity="0.8"' })}${L.label(560, 400, 'बैक बे', { font: "'Mukta', Oswald", weight: 700, size: 34, color: '#3C5868', extra: 'opacity="0.8"' })}
  ${L.label(1700, 1040, 'नक्शा सांकेतिक है, पैमाने पर नहीं', { font: "'Mukta', Oswald", weight: 500, size: 24, color: P.ink2, extra: 'opacity="0.75"' })}`;
}
export function mplace(name, key, o = {}) {
  const [x, y] = MPL[key];
  return g(o.cls || `mp mp-${key}`, `<circle cx="${x}" cy="${y}" r="${o.r || 12}" fill="${o.color || P.ink}" stroke="${P.snow}" stroke-width="3"/>${L.label(x + (o.dx ?? 22), y + (o.dy ?? 11), name, { font: "'Mukta', Oswald", weight: 700, size: o.size || 34, anchor: o.anchor || 'start', color: P.ink, extra: `paint-order="stroke" stroke="${P.paper}" stroke-width="7"` })}`);
}
export function mroute(from, to, cls = 'mroute', bend = 0.15) {
  const [x1, y1] = MPL[from] || from, [x2, y2] = MPL[to] || to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
  return `<path class="${cls}" d="M${x1} ${y1}Q${f(mx)} ${f(my)} ${x2} ${y2}" pathLength="1" stroke-dasharray="1" stroke="${P.brick}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
}
