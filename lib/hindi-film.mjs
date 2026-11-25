// Shared helpers for Hindi "पूरी History" films: fonts, CSS, labels, year stamps, letterbox, inset panels, chapter cards.
import * as L from './inkamber.mjs';
import * as E from './epic.mjs';
const { P } = L;
export const fonts = [['Baloo 2', 'baloo-2-devanagari-800-normal.woff2', 800], ['Mukta', 'mukta-devanagari-500-normal.woff2', 500], ['Mukta', 'mukta-devanagari-700-normal.woff2', 700]];
export const css = `.lower{font-family:'Mukta','Special Elite';font-weight:700;letter-spacing:0}
.yr{position:absolute;left:64px;bottom:128px;z-index:40;font:800 92px/1 'Baloo 2',Oswald;color:#F7F1E3;text-shadow:-3px -3px 0 #2B1D14,3px -3px 0 #2B1D14,-3px 3px 0 #2B1D14,3px 3px 0 #2B1D14,8px 10px 0 rgba(43,29,20,.5)}
.yr small{display:block;font:700 34px 'Mukta',Oswald;color:#F0B35A;margin-top:4px}
.lbt,.lbb{position:absolute;left:0;right:0;height:110px;background:#0B0806;z-index:45}.lbt{top:0}.lbb{bottom:0}`;
export const HF = "'Baloo 2', Oswald", HT = "'Mukta', Oswald";
export const tag = (x, y, t, o = {}) => L.tag(x, y, t, { font: HT, size: 40, w: o.w || [...t].length * (o.size || 40) * 0.52 + 70, ...o });
export const big = (x, y, t, o = {}) => L.label(x, y, t, { font: HF, weight: 800, size: 90, color: P.snow, extra: `paint-order="stroke" stroke="${P.ink}" stroke-width="10"`, ...o });
export const txt = (x, y, t, o = {}) => L.label(x, y, t, { font: HT, weight: 700, size: 40, ...o });
export const yr = (a, b = '') => `<div class="yr">${a}${b ? `<small>${b}</small>` : ''}</div>`;
export const LB = `<div class="lbt"></div><div class="lbb"></div>`;
export const TO = (o) => ({ transformOrigin: o });
export const C = TO('50% 50%'), B = TO('50% 100%');
export const cal = (x, y, a, b, c) => L.calendar(x, y, a, b, c).replace('class="calendar"', 'class="cal"').replace(/font-family="Oswald"/g, `font-family="${HT}"`).replace(/font-family="Special Elite"/g, `font-family="${HT}"`);
export const clip = (id, x, y, w, h, inner, o = '') => `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g ${o}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.paper}" ${L.S}/><g clip-path="url(#${id})">${inner}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${L.S}/></g>`;
export function letterbox(A, t0 = 0) { A.tween('.lbt', t0, 1, { y: -110 }, { y: 0 }, 'power2.out'); A.tween('.lbb', t0, 1, { y: 110 }, { y: 0 }, 'power2.out'); }
export function year(A, t = 0.3) { A.fadeIn('.yr', t, 0.7, -20); }
export function mapCam(A, s0 = 1.0, s1 = 1.07, x = -20) { A.camera({ scale: s0, x: 0 }, { scale: s1, x }); }
export function ambientSky(A) { A.drift('.c1', 0, A.dur, { x: -40 }, { x: 150 }); A.drift('.c2', 0, A.dur, { x: 0 }, { x: -120 }); }
// draw an arrow made by maps.arrow(): shaft then head
export function arrowIn(A, cls, t, d = 1.3) { A.draw(`${cls} .shaft`, t, d); A.pop(`${cls} .head`, t + d - 0.1, 0.3); }
export const chapterCard = (n, t, base = P.mol) => `${L.sky(base)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.25"/>${E.peaks(1080, n * 3, { fill: '#3A2A1E', h: 300 })}
  ${L.label(960, 400, `अध्याय ${n}`, { font: HT, weight: 700, size: 56, color: P.amber3, cls: 'chap-num' })}<line class="chap-rule" x1="660" y1="450" x2="1260" y2="450" stroke="${P.amber2}" stroke-width="4"/>
  ${L.label(960, 590, t, { font: HF, weight: 800, size: 130, color: P.snow, cls: 'chap-title' })}`;
