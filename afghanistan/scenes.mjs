// Afghanistan की पूरी History — scene builders.
import * as L from '../lib/inkamber.mjs';
import * as M from '../lib/maps.mjs';
import * as E from '../lib/epic.mjs';
import * as I from '../lib/india.mjs';
const { P, g, S, Sthin, shadow } = L;

export const title = 'Afghanistan की पूरी History';
export const fonts = [['Baloo 2', 'baloo-2-devanagari-800-normal.woff2', 800], ['Mukta', 'mukta-devanagari-500-normal.woff2', 500], ['Mukta', 'mukta-devanagari-700-normal.woff2', 700]];
export const css = `.lower{font-family:'Mukta','Special Elite';font-weight:700;letter-spacing:0}
.yr{position:absolute;left:64px;bottom:128px;z-index:40;font:800 92px/1 'Baloo 2',Oswald;color:#F7F1E3;text-shadow:-3px -3px 0 #2B1D14,3px -3px 0 #2B1D14,-3px 3px 0 #2B1D14,3px 3px 0 #2B1D14,8px 10px 0 rgba(43,29,20,.5)}
.yr small{display:block;font:700 34px 'Mukta',Oswald;color:#F0B35A;margin-top:4px}
.lbt,.lbb{position:absolute;left:0;right:0;height:110px;background:#0B0806;z-index:45}.lbt{top:0}.lbb{bottom:0}`;
const HF = "'Baloo 2', Oswald", HT = "'Mukta', Oswald";
const tag = (x, y, t, o = {}) => L.tag(x, y, t, { font: HT, size: 40, w: o.w || [...t].length * (o.size || 40) * 0.52 + 70, ...o });
const big = (x, y, t, o = {}) => L.label(x, y, t, { font: HF, weight: 800, size: 90, color: P.snow, extra: `paint-order="stroke" stroke="${P.ink}" stroke-width="10"`, ...o });
const yr = (a, b = '') => `<div class="yr">${a}${b ? `<small>${b}</small>` : ''}</div>`;
const LB = `<div class="lbt"></div><div class="lbb"></div>`;
const TO = (o) => ({ transformOrigin: o });
const C = TO('50% 50%'), B = TO('50% 100%');
const cal = (x, y, a, b, c) => L.calendar(x, y, a, b, c).replace('class="calendar"', 'class="cal"').replace(/font-family="Oswald"/g, `font-family="${HT}"`).replace(/font-family="Special Elite"/g, `font-family="${HT}"`);

// views
const VA = { center: [66.5, 34], scale: 2700 }, VR = { center: [66, 32], scale: 1250 }, VI = { center: [72.5, 29.5], scale: 1150 }, VW = { center: [54, 35], scale: 700 }, VM = { center: [78, 40], scale: 430 };
const PL = { kabul: [69.17, 34.53], kandahar: [65.71, 31.61], herat: [62.2, 34.35], balkh: [66.9, 36.76], ghazni: [68.42, 33.55], bamiyan: [67.83, 34.82], jalalabad: [70.45, 34.43], khyber: [71.1, 34.08], peshawar: [71.58, 34.01], delhi: [77.21, 28.61], panipat: [76.97, 29.39], somnath: [70.4, 20.89], mathura: [77.67, 27.49], kannauj: [79.92, 27.06], tarain: [76.8, 29.95], agra: [78.0, 27.18], andijan: [72.34, 40.78], pella: [22.52, 40.76], persepolis: [52.89, 29.93], ghor: [64.5, 34.4], karakorum: [102.8, 47.2], termez: [67.3, 37.2], mazar: [67.11, 36.71], kunduz: [68.86, 36.73] };
const HK = [[62.5, 34.6], [65, 34.9], [67.5, 35.2], [69.5, 35.6], [71, 36.3]];
const EMP = {
  persia: [[26, 40], [35, 42], [45, 41], [55, 40], [63, 41], [70, 38], [73, 33], [70, 27], [62, 25], [52, 26], [45, 29], [36, 30], [30, 31], [26, 37]],
  maurya: [[62, 34], [66, 37], [71, 36], [75, 34], [80, 30], [88, 27], [92, 24], [86, 20], [80, 14], [76, 15], [72, 20], [68, 24], [63, 28], [61, 31]],
  kushan: [[60, 38], [68, 41], [74, 39], [77, 35], [80, 29], [84, 26], [80, 24], [74, 27], [69, 27], [64, 30], [61, 34]],
  ghazni: [[52, 37], [60, 40], [68, 39], [72, 36], [76, 32], [74, 27], [66, 26], [58, 28], [52, 32]],
  mongol: [[30, 48], [60, 55], [100, 54], [130, 48], [125, 35], [105, 30], [80, 36], [65, 32], [50, 33], [38, 40]],
  durrani: [[54, 37], [62, 38], [68, 38], [75, 36], [77, 32], [74, 28], [68, 24], [62, 25], [56, 30]],
  mughal: [[66, 36], [72, 36], [77, 33], [85, 28], [92, 25], [88, 20], [80, 13], [76, 14], [72, 20], [67, 24], [65, 30]],
  british: [[67, 25], [71, 34], [75, 36], [80, 31], [88, 28], [97, 27], [94, 20], [86, 20], [80, 9], [76, 9], [72, 19]],
};
const clip = (id, x, y, w, h, inner, o = '') => `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath><g ${o}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.paper}" ${S}/><g clip-path="url(#${id})">${inner}</g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" ${S}/></g>`;
const mapCache = {};
const mp = (v) => mapCache[JSON.stringify(v)] ||= M.makeMap(v);
const pl = (m, n, key, o) => M.place(m, n, ...PL[key], o);
function ambientSky(A) { A.drift('.c1', 0, A.dur, { x: -40 }, { x: 150 }); A.drift('.c2', 0, A.dur, { x: 0 }, { x: -120 }); }
function letterbox(A, t0 = 0) { A.tween('.lbt', t0, 1, { y: -110 }, { y: 0 }, 'power2.out'); A.tween('.lbb', t0, 1, { y: 110 }, { y: 0 }, 'power2.out'); }
function year(A, t = 0.3) { A.fadeIn('.yr', t, 0.7, -20); }
function mapCam(A, s0 = 1.0, s1 = 1.07, x = -20) { A.camera({ scale: s0, x: 0 }, { scale: s1, x }); }

export const chapters = {
  s05: [1, 'चौराहे पर एक देश'], s07: [2, 'सिकंदर से बुद्ध तक'], s14: [3, 'सुल्तान और तूफ़ान'], s19: [4, 'बाबर से अब्दाली तक'],
  s23: [5, 'द ग्रेट गेम'], s29: [6, 'सोवियत जंग'], s33: [7, 'तालिबान और अमेरिका'], s42: [8, 'जवाब'],
};
export const chapterSvg = (n, t) => `${L.sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.25"/>${E.peaks(1080, n * 3, { fill: '#3A2A1E', h: 300 })}
  ${L.label(960, 400, `अध्याय ${n}`, { font: HT, weight: 700, size: 56, color: P.amber3, cls: 'chap-num' })}<line class="chap-rule" x1="660" y1="450" x2="1260" y2="450" stroke="${P.amber2}" stroke-width="4"/>
  ${L.label(960, 590, t, { font: HF, weight: 800, size: 130, color: P.snow, cls: 'chap-title' })}`;

export const scenes = {
  s01(A) {
    letterbox(A, 0);
    A.drift('.snow', 0, A.dur, { y: 0 }, { y: 1080 * 0.4 }, 'none');
    A.loop('.dust', { x: 0, y: 0 }, { x: 60, y: -20 }, 4);
    A.camera({ scale: 1.15, y: 40 }, { scale: 1.0, y: 0 });
    A.fadeIn('.ttl', 0.5, 1.5, 30);
    A.fadeOut('.ttl', A.dur - 1.5, 0.8);
    A.slideIn('.lone', A.cue('बंजर'), 1.5, -200);
    return { svg: `${L.sky('url(#dusk)')}${L.sun(1500, 300, 90)}${E.peaks(780, 11, { h: 420, fill: '#9A8A72' })}${E.peaks(920, 12, { h: 300, fill: '#7A6A56' })}<rect x="-200" y="900" width="2320" height="400" fill="#6E5E4A"/>
      ${E.figure(700, 980, 1.1, { gear: 'pakol', coat: P.olive2, cls: 'fig lone', beard: P.ink2 })}${E.snow(70, 4)}${E.dust(40, 6)}
      ${big(960, 300, 'अफ़ग़ानिस्तान', { size: 150, cls: 'ttl' })}`, over: LB };
  },

  s02(A) {
    const m = mp(VW);
    A.fadeIn('.hl', 0, 0.6, 0);
    const cues = [['सिकंदर', '.a1', '.t1'], ['चंगेज़', '.a2', '.t2'], ['अंग्रेज़', '.a3', '.t3'], ['सोवियत', '.a4', '.t4'], ['अमेरिका', '.a5', '.t5']];
    for (const [w, a, t] of cues) { const tc = A.cue(w); A.draw(`${a} .shaft`, tc, 1.1); A.pop(`${a} .head`, tc + 1, 0.3); A.pop(t, tc + 0.4, 0.5); }
    A.pop('.grave', A.cue('कब्रिस्तान'), 0.8);
    mapCam(A, 1.0, 1.12, -60);
    const [ax, ay] = m.xy(...PL.kabul);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}
      ${M.arrow(m, PL.pella, [64, 35], { cls: 'arrow a1', bend: -0.1 })}${M.arrow(m, [95, 50], [69, 36], { cls: 'arrow a2', color: P.mol3, bend: 0.1 })}${M.arrow(m, [80, 24], [70, 33], { cls: 'arrow a3', color: P.brick2, bend: 0.2 })}${M.arrow(m, [66, 52], [67, 37], { cls: 'arrow a4', color: P.olive, bend: 0.1 })}${M.arrow(m, [58, 16], [65, 31], { cls: 'arrow a5', color: P.slate, bend: -0.2 })}
      ${tag(m.xy(...PL.pella)[0] + 40, m.xy(...PL.pella)[1] - 60, 'सिकंदर', { cls: 'tag t1', fill: P.snow })}${tag(m.xy(95, 50)[0] - 60, m.xy(95, 50)[1] - 40, 'चंगेज़ ख़ान', { cls: 'tag t2', fill: P.snow })}${tag(m.xy(80, 24)[0] + 60, m.xy(80, 24)[1] + 40, 'अंग्रेज़', { cls: 'tag t3', fill: P.snow })}${tag(m.xy(66, 52)[0], m.xy(66, 52)[1] - 40, 'सोवियत संघ', { cls: 'tag t4', fill: P.snow })}${tag(m.xy(58, 16)[0], m.xy(58, 16)[1] + 50, 'अमेरिका', { cls: 'tag t5', fill: P.snow })}
      ${L.stamp(ax, ay - 230, 'साम्राज्यों का कब्रिस्तान', { size: 58, cls: 'stamp grave' })}` };
  },

  s03(A) {
    const m = mp(VI);
    A.fadeIn('.hl', 0, 0.5, 0);
    A.draw('.a1 .shaft', A.cue('हमलावर'), 1.2); A.pop('.a1 .head', A.cue('हमलावर') + 1.1, 0.3);
    A.pop('.mug', A.cue('मुग़ल'));
    A.fadeIn('.split', A.cue('पंद्रह अगस्त') - 0.3, 0.6, 0);
    A.pop('.cal', A.cue('पंद्रह अगस्त'));
    A.pop('.ind', A.cue('जश्न')); A.pop('.kab', A.cue('तालिबान'));
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${pl(m, 'काबुल', 'kabul')}${pl(m, 'दिल्ली', 'delhi')}${M.arrow(m, PL.kabul, PL.delhi, { cls: 'arrow a1', bend: 0.15 })}
      ${tag(m.xy(...PL.kabul)[0] + 40, m.xy(...PL.kabul)[1] - 120, 'मुग़ल साम्राज्य की शुरुआत: काबुल', { size: 34, fill: P.amber3, cls: 'tag mug' })}
      ${g('split', `<rect x="-200" y="-200" width="2320" height="1480" fill="${P.ink}" opacity="0.75"/>
        ${g('ind', `<rect x="160" y="260" width="700" height="560" fill="${P.paper}" ${S}/><rect x="310" y="380" width="400" height="80" fill="${P.amber2}"/><rect x="310" y="460" width="400" height="80" fill="${P.snow}" ${Sthin}/><rect x="310" y="540" width="400" height="80" fill="${P.olive}"/><circle cx="510" cy="500" r="30" fill="none" stroke="${P.slate}" stroke-width="5"/>${L.label(510, 720, 'भारत: आज़ादी का जश्न', { font: HT, weight: 700, size: 44 })}`, shadow)}
        ${g('kab', `<rect x="1060" y="260" width="700" height="560" fill="#B8AFA0" ${S}/>${E.peaks(700, 40, { h: 200, fill: '#7A6A56' })}${L.label(1410, 400, 'काबुल', { font: HF, weight: 800, size: 90, color: P.ink })}${L.label(1410, 720, 'तालिबान का कब्ज़ा', { font: HT, weight: 700, size: 44 })}`, shadow)}
        ${cal(810, 40, 'अगस्त', '15', '2021')}`)}` };
  },

  s04(A) {
    A.pop('.q1', A.cue('ये पहाड़ी देश'), 0.7);
    A.pop('.q2', A.cue('और अगर'), 0.7);
    A.fadeIn('.go', A.cue('चलिए'), 0.8, 20);
    A.drift('.snow', 0, A.dur, { y: 0 }, { y: 400 }, 'none');
    return { svg: `${L.sky('#2A2235')}${E.peaks(1000, 21, { h: 360, fill: '#4A3E52' })}${E.snow(60, 9)}
      ${tag(960, 300, 'साम्राज्यों को बार-बार कैसे थका देता है?', { size: 58, fill: P.snow, cls: 'tag q1' })}${tag(960, 470, 'और आज इतना गरीब क्यों?', { size: 58, fill: P.amber3, cls: 'tag q2' })}
      ${big(960, 700, 'चलिए, शुरुआत से…', { size: 80, color: P.amber3, cls: 'go' })}` };
  },

  s05(A) {
    const m = mp(VR);
    A.fadeIn('.hl', 0.2, 0.8, 0);
    A.pop('.r1', A.cue('ईरान')); A.pop('.r2', A.cue('मध्य एशिया')); A.pop('.r3', A.cue('चीन')); A.pop('.r4', A.cue('उपमहाद्वीप'));
    A.pop('.mtns', A.cue('हिंदू कुश'), 0.8);
    A.pop('.h7', A.cue('सात हज़ार'));
    mapCam(A, 1.0, 1.1, 30);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.mountains(m, HK, { size: 22 })}
      ${M.regionLabel(m, 'ईरान', 57, 32, { cls: 'rlabel r1' })}${M.regionLabel(m, 'मध्य एशिया', 64, 40, { cls: 'rlabel r2' })}${M.regionLabel(m, 'चीन', 78, 37, { cls: 'rlabel r3' })}${M.regionLabel(m, 'भारतीय उपमहाद्वीप', 74, 27, { cls: 'rlabel r4' })}
      ${tag(1500, 960, 'हिंदू कुश: 7,000+ मीटर', { size: 40, fill: P.snow, cls: 'tag h7' })}` };
  },

  s06(A) {
    const m = mp(VR);
    A.draw('.route', A.cue('ईरान'), 2); A.draw('.route2', A.cue('मध्य एशिया'), 2);
    A.draw('.ak .shaft', A.cue('ख़ैबर'), 1.2); A.pop('.ak .head', A.cue('ख़ैबर') + 1.1, 0.3);
    A.pop('.kh', A.cue('ख़ैबर'));
    A.slideIn('.cavalry', A.cue('सेनाएँ'), 1.5, -500);
    A.pop('.fate', A.cue('किस्मत'));
    const [kx, ky] = m.xy(...PL.khyber);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.mountains(m, HK, { size: 22 })}
      <path class="route" d="M${m.xy(50, 35).join(' ')}Q${m.xy(58, 36).join(' ')} ${m.xy(...PL.herat).join(' ')}T${m.xy(...PL.kabul).join(' ')}" stroke="${P.brick}" stroke-width="7" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      <path class="route2" d="M${m.xy(66, 41).join(' ')}Q${m.xy(67, 38).join(' ')} ${m.xy(...PL.balkh).join(' ')}T${m.xy(...PL.kabul).join(' ')}" stroke="${P.brick}" stroke-width="7" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      ${M.arrow(m, PL.kabul, [74, 31.5], { cls: 'arrow ak', bend: 0.2 })}${pl(m, 'काबुल', 'kabul')}${M.place(m, 'ख़ैबर दर्रा', ...PL.khyber, { color: P.brick, cls: 'place kh', size: 40 })}
      <g transform="translate(0 0)">${E.cavalry(1200, 1060, 4, 0.45, { gear: 'turban' })}</g>
      ${tag(1500, 160, 'भूगोल ही इसकी किस्मत', { size: 44, fill: P.amber3, cls: 'tag fate' })}` };
  },

  s07(A) {
    const m = mp(VW);
    year(A);
    A.fadeIn('.hl', 0.2, 0.5, 0);
    A.tween('.blob', A.cue('हख़ामनी'), 1.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.ename', A.cue('हख़ामनी') + 0.5);
    A.pop('.bac', A.cue('बैक्ट्रिया')); A.pop('.ara', A.cue('अराकोसिया'));
    A.pop('.thou', A.cue('हज़ार शहरों'));
    mapCam(A, 1.0, 1.2, -120);
    return { svg: `${m.base()}${M.blob(m, EMP.persia, { fill: P.brick })}${m.country('Afghanistan', P.amber2)}${M.regionLabel(m, 'हख़ामनी साम्राज्य', 48, 33, { cls: 'rlabel ename', size: 46 })}
      ${pl(m, 'बैक्ट्रिया', 'balkh', { cls: 'place bac' })}${pl(m, 'अराकोसिया', 'kandahar', { cls: 'place ara' })}
      ${tag(1450, 900, '"हज़ार शहरों की धरती"', { size: 44, fill: P.snow, cls: 'tag thou' })}`, over: yr('550', 'ईसा पूर्व के आसपास') };
  },

  s08(A) {
    const m = mp(VW);
    year(A);
    A.draw('.a1 .shaft', 0.5, 2.5); A.pop('.a1 .head', 2.9, 0.3);
    A.draw('.a2 .shaft', A.cue('यहाँ पहुँचा') - 0.5, 1.5); A.pop('.a2 .head', A.cue('यहाँ पहुँचा') + 0.9, 0.3);
    A.pop('.alx', A.cue('सिकंदर'));
    A.pop('.y3', A.cue('तीन साल'));
    A.fadeIn('.war', A.cue('गाँव गाँव') - 0.3, 0.6, 0);
    A.loop('.war .rider', { y: 0 }, { y: -10 }, 0.35, A.cue('गाँव गाँव'));
    mapCam(A, 1.0, 1.15, -100);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.arrow(m, PL.pella, PL.persepolis, { cls: 'arrow a1', bend: -0.15 })}${M.arrow(m, PL.persepolis, PL.balkh, { cls: 'arrow a2', bend: -0.25 })}
      ${E.figure(640, 1010, 1.5, { gear: 'greek', coat: P.brick, weapon: 'spear', shield: P.amber2, cls: 'fig alx', skin: '#E2B48C' })}${tag(640, 560, 'सिकंदर', { size: 44, fill: P.snow, cls: 'tag alx' })}
      ${tag(1500, 200, '~3 साल की लड़ाई', { size: 50, fill: P.amber3, cls: 'tag y3' })}
      ${clip('cw8', 900, 560, 980, 440, `${E.peaks(1000, 31, { h: 300, fill: '#9A8A72' })}${E.rider(1150, 960, 0.6, { gear: 'greek', coat: P.brick, weapon: 'spear', gallop: true })}${E.rider(1600, 960, 0.6, { gear: 'turban', coat: P.olive, weapon: 'sword', gallop: true })}`, 'class="war"')}`, over: yr('330', 'ईसा पूर्व') };
  },

  s09(A) {
    A.slideIn('.alx', 0.2, 1, -300); A.slideIn('.rox', A.cue('रुख़साना') - 0.4, 1, 300);
    A.pop('.ring', A.cue('शादी'));
    A.pop('.nm', A.cue('रुख़साना'));
    A.pop('.swd', A.cue('तलवार'));
    A.fadeIn('.hk', A.cue('हिंदू कुश') - 0.3, 0.6, 0);
    return { svg: `${L.sky('url(#dusk)')}${E.peaks(820, 41, { h: 340 })}<rect x="-200" y="820" width="2320" height="500" fill="#7A6A56"/>
      ${E.figure(760, 1000, 1.7, { gear: 'crown', coat: P.brick, cls: 'fig alx', skin: '#E2B48C' })}${E.figure(1160, 1000, 1.6, { gear: 'turban', hatColor: P.amber2, coat: P.rose, skirt: true, cls: 'fig rox' })}
      ${g('ring', `<circle cx="960" cy="560" r="34" fill="none" stroke="${P.amber3}" stroke-width="10"/><circle cx="960" cy="560" r="90" fill="url(#glow)"/>`)}
      ${tag(1160, 300, 'रुख़साना, बैक्ट्रिया की राजकुमारी', { size: 38, fill: P.snow, cls: 'tag nm' })}${tag(560, 200, 'तलवार नहीं, रिश्ता', { size: 44, fill: P.amber3, cls: 'tag swd' })}
      ${tag(960, 130, 'आगे: हिंदू कुश पार, भारत की ओर', { size: 38, fill: P.snow, cls: 'tag hk' })}`, over: yr('327', 'ईसा पूर्व') };
  },

  s10(A) {
    const m = mp(VI);
    year(A);
    A.pop('.sel', A.cue('सेल्यूकस')); A.pop('.cg', A.cue('चंद्रगुप्त'));
    A.tween('.blob', A.cue('समझौता'), 1.6, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.mn', A.cue('समझौता') + 0.6);
    A.drift('.ele', A.cue('पाँच सौ'), A.dur - A.cue('पाँच सौ'), { x: 700 }, { x: 0 }, 'power2.out');
    A.loop('.ele .elephant', { y: 0 }, { y: -6 }, 0.6, A.cue('पाँच सौ'));
    A.pop('.n500', A.cue('पाँच सौ'));
    return { svg: `${m.base()}${M.blob(m, EMP.maurya, { fill: P.olive })}${m.country('Afghanistan', P.amber2)}${M.regionLabel(m, 'मौर्य साम्राज्य', 80, 24, { cls: 'rlabel mn' })}
      ${tag(330, 300, 'सेल्यूकस', { size: 44, fill: P.snow, cls: 'tag sel' })}${tag(1500, 300, 'चंद्रगुप्त मौर्य', { size: 44, fill: P.amber3, cls: 'tag cg' })}
      <g class="ele">${E.elephant(1150, 1040, 0.55)}${E.elephant(1450, 1050, 0.6)}${E.elephant(1750, 1040, 0.55)}</g>${tag(1450, 680, 'बदले में: 500 हाथी', { size: 46, fill: P.snow, cls: 'tag n500' })}`, over: yr('~303', 'ईसा पूर्व') };
  },

  s11(A) {
    year(A);
    A.pop('.edict', A.cue('शिलालेख'));
    A.pop('.loc', A.cue('कंधार'));
    A.pop('.lang', A.cue('यूनानी'));
    A.fadeIn('.msg', A.cue('संदेश'), 0.8, 20);
    A.camera({ scale: 1.1, x: 40 }, { scale: 1.0, x: 0 });
    return { svg: `${L.sky()}${L.ground(900)}${E.edictStone(620, 900, 1.6)}
      ${tag(1350, 220, 'सम्राट अशोक का शिलालेख, कंधार', { size: 42, fill: P.snow, cls: 'tag loc' })}${tag(1350, 340, 'यूनानी + अरामी भाषा', { size: 46, fill: P.amber3, cls: 'tag lang' })}
      ${g('msg', `<rect x="1020" y="460" width="680" height="220" fill="${P.snow}" ${S}/>${L.label(1360, 560, '"हिंसा छोड़ो,', { font: HF, weight: 800, size: 54 })}${L.label(1360, 630, 'जीवों पर दया करो"', { font: HF, weight: 800, size: 54 })}`, shadow)}`, over: yr('~260', 'ईसा पूर्व') };
  },

  s12(A) {
    const m = mp(VI);
    year(A);
    A.tween('.blob', A.cue('कुषाण'), 1.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.kn', A.cue('कनिष्क'));
    A.fadeIn('.art', A.cue('गांधार') - 0.3, 0.8, 30);
    A.pop('.mix', A.cue('यूनानी'));
    return { svg: `${m.base()}${M.blob(m, EMP.kushan, { fill: P.slate })}${m.country('Afghanistan', P.amber2)}${M.regionLabel(m, 'कुषाण साम्राज्य', 70, 37.5, { cls: 'rlabel' })}
      ${tag(560, 160, 'सम्राट कनिष्क', { size: 44, fill: P.snow, cls: 'tag kn' })}
      ${g('art', `<rect x="1180" y="160" width="620" height="820" fill="${P.paper}" ${S}/>${E.gandharaBuddha(1490, 900, 1.25)}${L.label(1490, 960, 'गांधार कला', { font: HF, weight: 800, size: 50 })}`, shadow)}
      ${tag(1490, 120, 'यूनानी + भारतीय शैली', { size: 38, fill: P.amber3, cls: 'tag mix' })}`, over: yr('~127', 'ईसवी') };
  },

  s13(A) {
    A.camera({ scale: 1.25, y: 120 }, { scale: 1.0, y: 0 });
    letterbox(A, 0);
    A.draw('.m1', A.cue('पचपन'), 0.8); A.pop('.l1', A.cue('पचपन'));
    A.draw('.m2', A.cue('अड़तीस'), 0.8); A.pop('.l2', A.cue('अड़तीस'));
    A.pop('.yrs', A.cue('डेढ़ हज़ार'));
    A.pop('.remember', A.cue('याद रखिएगा'));
    A.loop('.dust', { x: 0, y: 0 }, { x: 50, y: -20 }, 4);
    return { svg: `${L.sky('url(#skyg)')}${E.peaks(500, 51, { h: 260, fill: '#A89880' })}${E.buddhaCliff(960, 1000, 1)}<rect x="-200" y="990" width="2320" height="300" fill="#7A6A56"/>
      <path class="m1" d="M${960 - 380 - 140} 1000V480" stroke="${P.brick}" stroke-width="6" stroke-dasharray="1 1" pathLength="1"/>${tag(260, 600, '~55 मीटर', { size: 44, fill: P.snow, cls: 'tag l1' })}
      <path class="m2" d="M${960 + 330 + 120} 1000V620" stroke="${P.brick}" stroke-width="6" stroke-dasharray="1 1" pathLength="1"/>${tag(1660, 700, '~38 मीटर', { size: 44, fill: P.snow, cls: 'tag l2' })}
      ${tag(960, 190, '~1500 साल तक खड़ी रहीं', { size: 44, fill: P.amber3, cls: 'tag yrs' })}${tag(960, 300, 'याद रखिएगा…', { size: 40, fill: P.snow, cls: 'tag remember' })}${E.dust(40, 3)}`, over: `${LB}${yr('~600', 'ईसवी · बामियान')}` };
  },

  s14(A) {
    const m = mp(VR);
    year(A);
    A.draw('.a1 .shaft', A.cue('अरब'), 1.5); A.pop('.a1 .head', A.cue('अरब') + 1.4, 0.3);
    A.pop('.ar', A.cue('अरब'));
    A.pop('.slow', A.cue('सदियों'));
    A.pop('.shahi', A.cue('हिंदू शाही'));
    A.pop('.jp', A.cue('जयपाल'));
    A.pop('.q', A.cue('भूला'));
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.arrow(m, [50, 30], [62.5, 33.5], { cls: 'arrow a1', color: P.olive, bend: 0.1 })}${tag(m.xy(50, 30)[0], m.xy(50, 30)[1] + 60, 'अरब सेनाएँ · 7वीं सदी', { size: 34, fill: P.snow, cls: 'tag ar' })}
      ${tag(m.xy(60, 37)[0], m.xy(60, 37)[1], 'धीरे-धीरे, कई सदियों में', { size: 32, fill: P.paper, cls: 'tag slow' })}
      ${M.place(m, 'काबुल · हिंदू शाही राजा', ...PL.kabul, { cls: 'place shahi', color: P.amber, size: 38 })}${tag(m.xy(...PL.peshawar)[0] + 60, m.xy(...PL.peshawar)[1] + 120, 'आख़िरी बड़ा राजा: जयपाल', { size: 34, fill: P.amber3, cls: 'tag jp' })}
      ${tag(960, 1000, 'और फिर आया एक सुल्तान…', { size: 42, fill: P.snow, cls: 'tag q' })}`, over: yr('650+', 'ईसवी') };
  },

  s15(A) {
    const m = mp(VI);
    year(A);
    A.pop('.gz', A.cue('ग़ज़नवी'));
    A.pop('.d1001', A.cue('एक हज़ार एक'));
    A.pop('.n17', A.cue('सत्रह'));
    const ws = [['मथुरा', '.a1'], ['कन्नौज', '.a2'], ['सोमनाथ', '.a3']];
    for (const [w, a] of ws) { const t = A.cue(w); A.draw(`${a} .shaft`, t - 0.3, 1.2); A.pop(`${a} .head`, t + 0.8, 0.3); }
    A.pop('.gold', A.cue('सोना'));
    mapCam(A, 1.0, 1.08, 40);
    return { svg: `${m.base()}${M.blob(m, EMP.ghazni, { fill: P.mol3, op: 0.25 })}${m.country('Afghanistan', P.amber2)}${M.place(m, 'ग़ज़नी', ...PL.ghazni, { size: 40, color: P.brick, cls: 'place gz' })}
      ${M.arrow(m, PL.ghazni, PL.mathura, { cls: 'arrow a1', bend: 0.12 })}${M.arrow(m, PL.ghazni, PL.kannauj, { cls: 'arrow a2', bend: 0.18 })}${M.arrow(m, PL.ghazni, PL.somnath, { cls: 'arrow a3', bend: -0.15 })}
      ${pl(m, 'मथुरा', 'mathura')}${pl(m, 'कन्नौज', 'kannauj')}${pl(m, 'सोमनाथ', 'somnath')}
      ${tag(380, 160, 'महमूद ग़ज़नवी', { size: 50, fill: P.snow, cls: 'tag gz' })}${tag(380, 270, '1001: जयपाल की हार', { size: 36, fill: P.paper, cls: 'tag d1001' })}${tag(1550, 160, '~17 हमले', { size: 56, fill: P.brick2, color: P.snow, cls: 'tag n17' })}
      ${tag(1550, 280, 'हर बार सोना लूटकर वापस', { size: 36, fill: P.amber3, cls: 'tag gold' })}`, over: yr('1001–1026', 'ईसवी') };
  },

  s16(A) {
    const m = mp(VI);
    year(A);
    A.pop('.gh', A.cue('ग़ोर'));
    A.draw('.a1 .shaft', A.cue('तराइन') - 0.5, 1.4); A.pop('.a1 .head', A.cue('तराइन') + 0.8, 0.3);
    A.pop('.pc', A.cue('पृथ्वीराज'));
    A.pop('.ds', A.cue('दिल्ली सल्तनत'));
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.place(m, 'ग़ोर', ...PL.ghor, { size: 40, color: P.brick, cls: 'place gh' })}${M.arrow(m, PL.ghor, PL.tarain, { cls: 'arrow a1', bend: 0.12 })}
      ${pl(m, 'तराइन', 'tarain', { dx: -18, anchor: 'end' })}${M.place(m, 'दिल्ली', ...PL.delhi, { cls: 'place ds', color: P.brick })}
      ${tag(1500, 160, 'मुहम्मद ग़ोरी vs पृथ्वीराज चौहान', { size: 36, fill: P.snow, cls: 'tag pc' })}${tag(1500, 900, '1206: दिल्ली सल्तनत की नींव', { size: 38, fill: P.amber3, cls: 'tag ds' })}`, over: yr('1192', 'ईसवी') };
  },

  s17(A) {
    const m = mp(VM);
    year(A);
    A.tween('.blob', 0.5, 2, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.ck', A.cue('चंगेज़'));
    A.draw('.a1 .shaft', A.cue('मंगोल'), 1.4); A.pop('.a1 .head', A.cue('मंगोल') + 1.3, 0.3);
    A.pop('.cities', A.cue('तबाह'), 0.5, 0.2);
    A.fadeIn('.burn', A.cue('बामियान में') - 0.3, 0.8, 0);
    A.smoke('.sm1', A.cue('बामियान में'), 2.8, 200); A.smoke('.sm2', A.cue('बामियान में') + 1, 3.2, 220);
    A.pop('.gg', A.cue('ग़ुलग़ुला'));
    return { svg: `${m.base()}${M.blob(m, EMP.mongol, { fill: P.mol3, op: 0.3 })}${m.country('Afghanistan', P.amber2)}${M.arrow(m, PL.karakorum, [68, 36], { cls: 'arrow a1', color: P.mol3, bend: 0.1 })}
      ${M.regionLabel(m, 'मंगोल साम्राज्य', 98, 44, { cls: 'rlabel' })}${tag(m.xy(...PL.karakorum)[0], m.xy(...PL.karakorum)[1] - 80, 'चंगेज़ ख़ान', { size: 40, fill: P.snow, cls: 'tag ck' })}
      ${g('cities', `${M.place(m, 'हेरात', ...PL.herat, { color: P.brick, size: 28, anchor: 'end', dx: -18 })}${M.place(m, 'बल्ख़', ...PL.balkh, { color: P.brick, size: 28 })}`)}
      ${clip('cb17', 960, 560, 900, 440, `<rect x="960" y="560" width="900" height="440" fill="${P.mol}"/>${E.peaks(1000, 61, { h: 220, fill: '#4A3A2E' })}${E.fortWall(1000, 1820, 1000, 120, 'fort', '#6E5A44')}${L.smoke(1200, 860, 5, 'smoke sm1', 1.4)}${L.smoke(1600, 860, 5, 'smoke sm2', 1.6)}`, 'class="burn"')}
      ${tag(1410, 500, 'शहरे ग़ुलग़ुला: "चीख़ों का शहर"', { size: 38, fill: P.amber3, cls: 'tag gg' })}`, over: yr('1221', 'ईसवी') };
  },

  s18(A) {
    year(A);
    ambientSky(A);
    A.camera({ scale: 1.1, y: 40 }, { scale: 1.0, y: 0 });
    A.pop('.m1', A.cue('हेरात'), 0.6, 0.15);
    A.pop('.ppl', A.cue('कवि'));
    A.pop('.gs', A.cue('गौहर शाद'));
    return { svg: `${L.sky('url(#dusk)')}${L.sun(1500, 380, 120)}${L.cloud(300, 220, 1, 'cloud c1')}${L.cloud(1200, 160, 0.8, 'cloud c2')}<rect x="-200" y="900" width="2320" height="400" fill="#B49A78" ${S}/>
      ${E.dome(960, 900, 1.2)}<g class="m1">${E.minaret(420, 920, 1.2)}</g><g class="m1">${E.minaret(600, 920, 1.05)}</g><g class="m1">${E.minaret(1320, 920, 1.05)}</g><g class="m1">${E.minaret(1500, 920, 1.2)}</g>
      ${tag(960, 1000, 'कवि · चित्रकार · विद्वान', { size: 40, fill: P.snow, cls: 'tag ppl' })}${tag(960, 140, 'रानी गौहर शाद की मीनारें', { size: 44, fill: P.amber3, cls: 'tag gs' })}`, over: yr('1400s', 'हेरात · तैमूरी दौर') };
  },

  s19(A) {
    const m = mp(VR);
    year(A);
    A.pop('.bb', A.cue('बाबर'));
    A.pop('.fg', A.cue('फ़रग़ाना'));
    A.draw('.a1 .shaft', A.cue('पंद्रह सौ चार') - 0.4, 1.4); A.pop('.a1 .head', A.cue('पंद्रह सौ चार') + 0.9, 0.3);
    A.fadeIn('.book', A.cue('बाबरनामा') - 0.3, 0.8, 30);
    A.pop('.fruit circle', A.cue('फलों'), 0.4, 0.1);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.place(m, 'फ़रग़ाना (अंदिजान)', ...PL.andijan, { cls: 'place fg' })}${M.arrow(m, PL.andijan, PL.kabul, { cls: 'arrow a1', bend: -0.2 })}${pl(m, 'काबुल', 'kabul')}
      ${tag(380, 160, 'बाबर', { size: 56, fill: P.snow, cls: 'tag bb' })}
      ${g('book', `<rect x="1180" y="560" width="600" height="400" fill="${P.brick}" ${S}/><rect x="1200" y="580" width="560" height="360" fill="${P.paper}" ${Sthin}/>${L.label(1480, 720, 'बाबरनामा', { font: HF, weight: 800, size: 70 })}${g('fruit', `<circle cx="1330" cy="860" r="40" fill="${P.brick}" ${S}/><circle cx="1440" cy="870" r="36" fill="${P.amber2}" ${S}/><circle cx="1550" cy="860" r="40" fill="${P.brick}" ${S}/><circle cx="1650" cy="870" r="32" fill="${P.olive2}" ${S}/>`)}`, shadow)}`, over: yr('1504', 'ईसवी') };
  },

  s20(A) {
    const m = mp(VI);
    year(A);
    A.draw('.a1 .shaft', 0.6, 1.6); A.pop('.a1 .head', 2.1, 0.3);
    A.pop('.il', A.cue('इब्राहीम'));
    A.tween('.blob', A.cue('मुग़ल'), 1.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.fadeIn('.grave', A.cue('आख़िरी इच्छा') - 0.3, 0.8, 0);
    A.draw('.back', A.cue('आगरा'), 1.5);
    return { svg: `${m.base()}${M.blob(m, EMP.mughal, { fill: P.olive, op: 0.3 })}${m.country('Afghanistan', P.amber2)}${pl(m, 'काबुल', 'kabul')}${pl(m, 'पानीपत', 'panipat')}${pl(m, 'आगरा', 'agra')}${M.arrow(m, PL.kabul, PL.panipat, { cls: 'arrow a1', bend: 0.15 })}
      <path class="back" d="M${m.xy(...PL.agra).join(' ')}Q${m.xy(70, 33).join(' ')} ${m.xy(...PL.kabul).join(' ')}" stroke="${P.amber}" stroke-width="6" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      ${tag(1500, 160, 'पानीपत: इब्राहीम लोदी की हार', { size: 38, fill: P.snow, cls: 'tag il' })}${M.regionLabel(m, 'मुग़ल साम्राज्य', 80, 22, { cls: 'rlabel' })}
      ${g('grave', `<rect x="1180" y="620" width="620" height="380" fill="${P.olive2}" ${S}/><rect x="1400" y="840" width="180" height="60" fill="${P.snow}" ${S}/><path d="M1380 900h220" ${S}/>${L.mangoTree ? '' : ''}${I.mangoTree(1260, 900, 0.6)}${I.mangoTree(1700, 900, 0.6)}${L.label(1490, 980, 'बाबर का बाग़, काबुल', { font: HT, weight: 700, size: 38 })}`, shadow)}`, over: yr('1526', 'पानीपत की पहली लड़ाई') };
  },

  s21(A) {
    year(A);
    A.fadeIn('.jirga', 0.3, 1, 0);
    A.pop('.ah', A.cue('अहमद शाह'));
    A.pop('.crown', A.cue('बादशाह'));
    A.pop('.birth', A.cue('जन्म'));
    A.pop('.diamond', A.cue('कोहिनूर'));
    A.loop('.diamond', { rotation: -3, ...C }, { rotation: 3, ...C }, 1.2, A.cue('कोहिनूर'));
    let ring = ''; for (let i = 0; i < 10; i++) { const a = Math.PI + (i / 9) * Math.PI; ring += E.figure(960 + Math.cos(a) * 560, 1020 + Math.sin(a) * -140, 0.85, { gear: 'turban', hatColor: [P.snow, P.paper2, P.amber3][i % 3], coat: [P.olive, P.slate, P.mol3, P.brick][i % 4], pose: 'sit', beard: P.ink2, i }); }
    return { svg: `${L.sky('url(#dusk)')}<rect x="-200" y="860" width="2320" height="500" fill="#B49A78" ${S}/>${g('jirga', ring)}
      ${E.figure(960, 1010, 1.3, { gear: 'turban', hatColor: P.snow, coat: P.amber, cls: 'fig ahmad', beard: P.ink })}<g class="crown" transform="translate(0 -46)"><path d="M931.4 809.8l7.8 -33.8l13 18.2l7.8 -26l7.8 26l13 -18.2l7.8 33.8z" fill="#F0B35A" stroke="#2B1D14" stroke-width="2.5" stroke-linejoin="round"/></g>
      ${tag(560, 170, 'अहमद शाह अब्दाली (दुर्रानी)', { size: 42, fill: P.snow, cls: 'tag ah' })}${tag(560, 290, 'आधुनिक अफ़ग़ानिस्तान का जन्म', { size: 36, fill: P.amber3, cls: 'tag birth' })}${E.diamond(1550, 330, 1)}${tag(1550, 520, 'कोहिनूर', { size: 44, fill: P.snow, cls: 'tag diamond' })}`, over: yr('1747', 'कंधार') };
  },

  s22(A) {
    const m = mp(VI);
    year(A);
    A.draw('.a1 .shaft', 0.5, 1.6); A.pop('.a1 .head', 2, 0.3);
    A.pop('.mr', A.cue('मराठों'));
    A.fadeIn('.battle', A.cue('ख़ूनी') - 0.4, 0.8, 0);
    A.drift('.left', A.cue('ख़ूनी'), 3, { x: -400 }, { x: 0 }, 'power2.out'); A.drift('.right', A.cue('ख़ूनी'), 3, { x: 400 }, { x: 0 }, 'power2.out');
    A.loop('.battle .rider', { y: 0 }, { y: -10 }, 0.3, A.cue('ख़ूनी'));
    A.pop('.tens', A.cue('दसियों हज़ार'));
    A.pop('.back', A.cue('लौट गया'));
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.place(m, 'कंधार', ...PL.kandahar)}${pl(m, 'पानीपत', 'panipat')}${M.arrow(m, PL.kandahar, PL.panipat, { cls: 'arrow a1', bend: 0.12 })}
      ${tag(1500, 160, 'अब्दाली vs मराठे', { size: 46, fill: P.snow, cls: 'tag mr' })}
      ${g('battle', `<rect x="-200" y="420" width="2320" height="900" fill="#B49A78" ${S}/><g class="left">${E.cavalry(-60, 1010, 4, 0.55, { gear: 'turban', hatColor: P.snow, coat: P.olive, weapon: 'sword', gallop: true })}</g><g class="right"><g transform="translate(1920 0) scale(-1 1)">${E.cavalry(-60, 1010, 4, 0.55, { gear: 'turban', hatColor: P.amber2, coat: P.amber, weapon: 'banner', flag: P.amber2, gallop: true })}</g></g>`)}
      ${tag(960, 520, 'एक ही दिन में दसियों हज़ार मौतें', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag tens' })}${tag(960, 640, 'अब्दाली जीता… और लौट गया', { size: 40, fill: P.amber3, cls: 'tag back' })}`, over: yr('1761', 'पानीपत की तीसरी लड़ाई') };
  },

  s23(A) {
    const m = mp({ center: [68, 40], scale: 560 });
    year(A);
    A.tween('.blob', A.cue('अंग्रेज़'), 1.4, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.bi', A.cue('अंग्रेज़'));
    A.draw('.ru .shaft', A.cue('रूस'), 1.4); A.pop('.ru .head', A.cue('रूस') + 1.3, 0.3); A.pop('.rl', A.cue('रूस'));
    A.pop('.gg', A.cue('ग्रेट गेम'));
    A.fadeIn('.chess', A.cue('शतरंज') - 0.3, 0.8, 0);
    let sq = ''; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) sq += `<rect x="${1300 + i * 60}" y="${520 + j * 60}" width="60" height="60" fill="${(i + j) % 2 ? P.ink2 : P.paper}"/>`;
    return { svg: `${m.base()}${M.blob(m, EMP.british, { fill: P.brick, op: 0.3 })}${m.country('Afghanistan', P.amber2)}${M.arrow(m, [62, 52], [66, 39], { cls: 'arrow ru', color: P.slate, bend: 0.05 })}
      ${M.regionLabel(m, 'ब्रिटिश भारत', 79, 22, { cls: 'rlabel bi', size: 48 })}${M.regionLabel(m, 'रूसी साम्राज्य', 66, 53, { cls: 'rlabel rl', size: 48 })}
      ${tag(560, 160, 'द ग्रेट गेम', { size: 60, fill: P.amber3, cls: 'tag gg' })}
      ${g('chess', `<rect x="1280" y="500" width="520" height="520" fill="${P.mol3}" ${S}/>${sq}<path d="M1440 760h40l10 -60h-60zM1630 640h40l10 -60h-60z" fill="${P.brick}" ${Sthin}/><circle cx="1460" cy="690" r="18" fill="${P.brick}"/><circle cx="1650" cy="570" r="18" fill="${P.slate}"/>`, shadow)}`, over: yr('1800s', '') };
  },

  s24(A) {
    year(A);
    letterbox(A, 0);
    A.drift('.snow', 0, A.dur, { y: 0 }, { y: 600 }, 'none');
    A.drift('.col', 0, A.dur, { x: -300 }, { x: 400 });
    A.loop('.col .fig', { y: 0 }, { y: -5 }, 0.6);
    A.pop('.kb', A.cue('कब्ज़ा'));
    A.pop('.rev', A.cue('बग़ावत'));
    A.pop('.n45', A.cue('साढ़े चार हज़ार')); A.pop('.n12', A.cue('बारह हज़ार'));
    let col = ''; for (let i = 0; i < 12; i++) col += E.figure(100 + i * 110, 960 + (i % 2) * 12, 0.75, { gear: i % 3 ? 'shako' : 'turban', hatColor: P.snow, coat: i % 3 ? P.brick : P.paper2, weapon: i % 2 ? 'rifle' : undefined, skin: i % 3 ? '#E2B48C' : '#B07A52' });
    return { svg: `${L.sky('#C9CFD2')}${E.peaks(760, 71, { h: 420, fill: '#B8BEC0' })}<rect x="-200" y="880" width="2320" height="400" fill="${P.snow}" ${S}/><g class="col">${col}</g>${E.snow(110, 7)}
      ${tag(1450, 230, 'काबुल पर अंग्रेज़ी कब्ज़ा (1839)', { size: 36, fill: P.snow, cls: 'tag kb' })}${tag(1450, 340, 'पूरे देश में बग़ावत', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag rev' })}
      ${tag(560, 230, '~4,500 सैनिक', { size: 44, fill: P.amber3, cls: 'tag n45' })}${tag(560, 340, '+ ~12,000 साथ चलने वाले', { size: 36, fill: P.snow, cls: 'tag n12' })}`, over: `${LB}${yr('1842', 'जनवरी · काबुल से वापसी')}` };
  },

  s25(A) {
    year(A);
    letterbox(A, 0);
    A.drift('.snow', 0, A.dur, { y: 0 }, { y: 500 }, 'none');
    A.fadeIn('.fort', 0.2, 0.8, 0);
    A.drift('.lone', A.cue('घुड़सवार') - 1, A.dur - A.cue('घुड़सवार') + 1, { x: -900 }, { x: 0 }, 'power1.out');
    A.loop('.lone', { y: 0 }, { y: -6 }, 0.5);
    A.pop('.wb', A.cue('ब्राइडन'));
    A.pop('.only', A.cue('अकेला'));
    A.pop('.worst', A.cue('सबसे बुरी'));
    return { svg: `${L.sky('#B8B0A8')}${E.peaks(640, 81, { h: 300, fill: '#A8A6A0' })}<rect x="-200" y="900" width="2320" height="400" fill="${P.snow}" ${S}/>${E.fortWall(1100, 2120, 900, 300, 'fort', '#B49A78')}
      <g class="lone">${E.rider(800, 990, 0.8, { gear: 'shako', coat: P.brick, skin: '#E2B48C' })}</g>${E.snow(80, 12)}
      ${tag(560, 220, 'डॉ. विलियम ब्राइडन', { size: 44, fill: P.snow, cls: 'tag wb' })}${tag(560, 330, '"जलालाबाद पहुँचने वाला अकेला अंग्रेज़"', { size: 32, fill: P.amber3, cls: 'tag only' })}
      ${tag(1500, 220, 'ब्रिटिश साम्राज्य की सबसे बुरी हारों में से एक', { size: 32, fill: P.brick2, color: P.snow, cls: 'tag worst' })}`, over: `${LB}${yr('13 जनवरी 1842', 'जलालाबाद')}` };
  },

  s26(A) {
    const m = mp(VA);
    year(A);
    A.fadeIn('.hl', 0.2, 0.6, 0);
    A.pop('.fp', A.cue('विदेश नीति'));
    A.draw('.ol', A.cue('डूरंड लाइन') - 0.6, 3);
    A.pop('.dl', A.cue('डूरंड लाइन'));
    A.pop('.ps', A.cue('पश्तून'), 0.5, 0.3);
    A.pop('.nv', A.cue('कभी पूरी तरह'));
    mapCam(A, 1.0, 1.08, -40);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}<path class="ol" d="M${[[73.6,37.1],[71.6,36.5],[71.2,35.6],[71.6,35.0],[71.1,34.4],[70.0,33.9],[69.9,33.0],[69.3,32.0],[69.3,31.4],[68.2,31.6],[66.9,31.3],[66.4,30.0],[62.6,29.4],[60.9,29.9]].map((p) => m.xy(...p).join(' ')).join('L')}" stroke="${P.brick}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>${pl(m, 'काबुल', 'kabul')}${pl(m, 'पेशावर', 'peshawar')}
      ${tag(560, 150, 'विदेश नीति: अंग्रेज़ों के हाथ', { size: 36, fill: P.snow, cls: 'tag fp' })}${tag(1450, 150, 'डूरंड लाइन · 1893', { size: 50, fill: P.amber3, cls: 'tag dl' })}
      ${g('ps', M.regionLabel(m, 'पश्तून', 67.5, 31.2, { size: 46, color: P.brick }))}${g('ps', M.regionLabel(m, 'पश्तून', 70.6, 31.4, { size: 46, color: P.brick }))}
      ${tag(1450, 980, 'अफ़ग़ानिस्तान ने कभी पूरी तरह नहीं माना', { size: 34, fill: P.snow, cls: 'tag nv' })}`, over: yr('1893', '') };
  },

  s27(A) {
    year(A);
    ambientSky(A);
    A.pop('.free', A.cue('आज़ाद'));
    A.pop('.y28', A.cue('अट्ठाईस'));
    A.slideIn('.am', A.cue('अमानुल्लाह'), 0.9, -400);
    A.pop('.ref', A.cue('स्कूल'), 0.5, 0.3);
    A.pop('.rev', A.cue('बग़ावत'));
    return { svg: `${L.sky()}${L.cloud(300, 200, 1, 'cloud c1')}${L.cloud(1300, 150, 0.8, 'cloud c2')}${L.ground(900)}${E.figure(400, 980, 1.6, { gear: 'crown', coat: P.ink2, cls: 'fig am', skin: '#D9A57A' })}${tag(400, 530, 'राजा अमानुल्लाह ख़ान', { size: 36, fill: P.snow, cls: 'tag am' })}
      ${tag(1250, 180, 'पूरी आज़ादी · 1919', { size: 54, fill: P.amber3, cls: 'tag free' })}${tag(1250, 300, 'भारत से ~28 साल पहले', { size: 40, fill: P.snow, cls: 'tag y28' })}
      ${g('ref', tag(900, 520, 'स्कूल', { size: 40, fill: P.paper }))}${g('ref', tag(1200, 620, 'सड़कें', { size: 40, fill: P.paper }))}${g('ref', tag(1500, 520, 'औरतों के अधिकार', { size: 40, fill: P.paper }))}
      ${L.stamp(1250, 820, 'कबीलों की बग़ावत', { size: 56, cls: 'stamp rev' })}`, over: yr('1919', 'आज़ादी') };
  },

  s28(A) {
    year(A);
    ambientSky(A);
    A.fadeIn('.uni', 0.3, 0.8, 30);
    A.pop('.zs', A.cue('ज़ाहिर शाह'));
    A.pop('.std .fig', A.cue('यूनिवर्सिटी'), 0.4, 0.1);
    A.drift('.bus', A.cue('सैलानी'), A.dur - A.cue('सैलानी'), { x: -800 }, { x: 300 }, 'power1.out');
    A.pop('.hard', A.cue('यक़ीन'));
    let st = ''; for (let i = 0; i < 6; i++) st += E.figure(560 + i * 160, 1000, 0.85, { coat: [P.slate, P.rose, P.olive, P.amber2, P.brick, P.slate3][i], skirt: i % 2 === 1, gear: i % 2 ? '' : '', i });
    return { svg: `${L.sky()}${L.cloud(300, 200, 1, 'cloud c1')}${L.cloud(1300, 150, 0.8, 'cloud c2')}${E.peaks(700, 91, { h: 260 })}${L.ground(900)}
      ${g('uni', E.parliament(960, 900, 1.1).replace('class="parl"', 'class="parl"'))}<g class="std">${st}</g>
      <g class="bus">${L.trainCar(200, 1000, 360, 'tc', P.amber2)}</g>
      ${tag(560, 150, 'राजा ज़ाहिर शाह · ~40 साल', { size: 38, fill: P.snow, cls: 'tag zs' })}${tag(1450, 150, 'आज यक़ीन करना मुश्किल', { size: 38, fill: P.amber3, cls: 'tag hard' })}`, over: yr('1960s', 'काबुल') };
  },

  s29(A) {
    year(A);
    A.fadeIn('.red', 0.2, 0.8, 0);
    A.pop('.d73', A.cue('तख़्तापलट'));
    A.pop('.c78', A.cue('कम्युनिस्टों'));
    A.drift('.tank2', A.cue('कम्युनिस्टों') - 0.5, 3, { x: -600 }, { x: 0 }, 'power2.out');
    A.pop('.rev', A.cue('बग़ावत'));
    A.tween('.cam', A.cue('बग़ावत'), 0.08, { x: 0 }, { x: 8 }, 'none', { repeat: 11, yoyo: true });
    return { svg: `${L.sky('#C98A70')}<rect class="red" x="-200" y="-200" width="2320" height="1480" fill="${P.brick}" opacity="0.25"/>${E.peaks(760, 95, { h: 260, fill: '#8A6A56' })}<rect x="-200" y="900" width="2320" height="400" fill="#7A5A46" ${S}/>${E.tank(800, 960, 1)}
      ${tag(560, 170, '1973: दाऊद ख़ान का तख़्तापलट', { size: 38, fill: P.snow, cls: 'tag d73' })}${tag(1400, 170, '1978: कम्युनिस्ट क्रांति', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag c78' })}
      ${tag(1400, 300, 'गाँवों में बग़ावत', { size: 42, fill: P.amber3, cls: 'tag rev' })}`, over: yr('1973–1978', '') };
  },

  s30(A) {
    const m = mp(VR);
    year(A);
    letterbox(A, 0);
    A.draw('.a1 .shaft', 0.6, 1.5); A.pop('.a1 .head', 2.0, 0.3);
    A.fadeIn('.war', A.cue('टैंक') - 0.4, 0.6, 0);
    A.drift('.tanks', A.cue('टैंक'), A.dur - A.cue('टैंक'), { x: -500 }, { x: 200 }, 'none');
    A.drift('.helis', A.cue('हेलिकॉप्टर'), A.dur - A.cue('हेलिकॉप्टर'), { x: 600, y: -60 }, { x: -200, y: 0 }, 'none');
    A.loop('.rotor', { scaleX: 1, ...C }, { scaleX: 0.2, ...C }, 0.08, A.cue('हेलिकॉप्टर'), 'none');
    A.pop('.mj', A.cue('मुजाहिदीन'));
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.arrow(m, [67, 41], PL.kabul, { cls: 'arrow a1', color: P.brick, bend: 0.1 })}${tag(m.xy(67, 41)[0], m.xy(67, 41)[1] - 50, 'सोवियत सेना', { size: 36, fill: P.snow })}
      ${g('war', `<rect x="-200" y="480" width="2320" height="900" fill="#B49A78" ${S}/>${E.peaks(820, 101, { h: 260, fill: '#9A8A72' })}<rect x="-200" y="900" width="2320" height="400" fill="#8A7A62"/><g class="tanks">${E.tank(500, 1000, 0.7)}${E.tank(1000, 1010, 0.7)}</g><g class="helis">${E.helicopter(1300, 640, 0.6)}${E.helicopter(1650, 560, 0.5)}</g>${E.figure(1750, 900, 0.7, { gear: 'pakol', coat: P.olive2, weapon: 'rifle', beard: P.ink2 })}${E.figure(1830, 905, 0.65, { gear: 'turban', coat: P.paper3, weapon: 'rifle', beard: P.ink2 })}`)}
      ${tag(1700, 780, 'मुजाहिदीन', { size: 40, fill: P.amber3, cls: 'tag mj' })}`, over: `${LB}${yr('दिसंबर 1979', 'सोवियत हमला')}` };
  },

  s31(A) {
    const m = mp(VR);
    year(A);
    A.pop('.cw', A.cue('शीत युद्ध'));
    A.draw('.a1 .shaft', A.cue('अमेरिका'), 1.4); A.pop('.a1 .head', A.cue('अमेरिका') + 1.3, 0.3);
    A.pop('.sup', A.cue('पैसा'));
    A.fadeIn('.sting', A.cue('स्टिंगर') - 0.3, 0.6, 0);
    A.draw('.trail', A.cue('कंधे'), 1.4);
    A.tween('.fall', A.cue('गिरा'), 2.5, { rotation: 0, y: 0, ...C }, { rotation: 30, y: 300, ...C }, 'power2.in');
    A.smoke('.sm', A.cue('गिरा'), 2, 160);
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${pl(m, 'पेशावर', 'peshawar')}${M.arrow(m, PL.peshawar, [68.5, 33], { cls: 'arrow a1', color: P.slate, bend: -0.3 })}
      ${tag(560, 150, 'शीत युद्ध का मैदान', { size: 46, fill: P.snow, cls: 'tag cw' })}${tag(560, 260, 'अमेरिका · पाकिस्तान · सऊदी अरब', { size: 34, fill: P.amber3, cls: 'tag sup' })}
      ${clip('cs31', 1060, 440, 820, 560, `<rect x="1060" y="440" width="820" height="560" fill="#C9CFD2"/>${E.peaks(1000, 111, { h: 220, fill: '#9A8A72' })}${E.figure(1180, 990, 0.9, { gear: 'pakol', coat: P.olive2, beard: P.ink2 })}<path class="trail" d="M1210 860Q1400 600 1560 560" stroke="${P.snow}" stroke-width="10" fill="none" stroke-dasharray="1 1" pathLength="1"/><g class="fall">${E.helicopter(1600, 560, 0.55)}</g>${L.smoke(1580, 540, 5, 'smoke sm', 0.9)}`, 'class="sting"')}${L.label(1470, 420, 'स्टिंगर मिसाइल · 1986', { font: HT, weight: 700, size: 36, cls: 'sting' })}`, over: yr('1980s', '') };
  },

  s32(A) {
    year(A);
    A.pop('.s15', A.cue('पंद्रह हज़ार'));
    A.pop('.a1m', A.cue('दस लाख'));
    A.pop('.r5', A.cue('पचास लाख'));
    A.drift('.ref', A.cue('शरणार्थी'), A.dur - A.cue('शरणार्थी'), { x: 0 }, { x: 600 }, 'none');
    A.loop('.ref .fig', { y: 0 }, { y: -4 }, 0.6, A.cue('शरणार्थी'));
    A.drift('.out', A.cue('आख़िरी सोवियत'), 4, { x: 0 }, { x: -1200 }, 'power1.in');
    A.pop('.ussr', A.cue('टूट गया'));
    let ref = ''; for (let i = 0; i < 14; i++) ref += E.figure(-400 + i * 90, 1000 + (i % 2) * 14, 0.6, { coat: [P.olive2, P.paper3, P.rose, P.slate3][i % 4], gear: i % 3 ? 'turban' : '', hatColor: P.snow, skirt: i % 3 === 0, child: i % 5 === 0, i });
    return { svg: `${L.sky('#C9B89A')}${E.peaks(800, 121, { h: 300 })}<rect x="-200" y="900" width="2320" height="400" fill="#9A8A72" ${S}/><g class="out">${E.tank(1400, 950, 0.6)}</g><g class="ref">${ref}</g>
      ${tag(480, 160, '~15,000 सोवियत सैनिक मारे गए', { size: 36, fill: P.snow, cls: 'tag s15' })}${tag(480, 270, '~10 लाख अफ़ग़ान मारे गए (अनुमान)', { size: 36, fill: P.brick2, color: P.snow, cls: 'tag a1m' })}${tag(480, 380, '50 लाख+ शरणार्थी', { size: 40, fill: P.amber3, cls: 'tag r5' })}
      ${tag(1450, 220, '1991: सोवियत संघ ख़ुद टूट गया', { size: 38, fill: P.snow, cls: 'tag ussr' })}`, over: yr('1989', 'फ़रवरी · सोवियत वापसी') };
  },

  s33(A) {
    year(A);
    A.smoke('.sm1', 0, 3, 240); A.smoke('.sm2', 1.2, 3.4, 260);
    A.pop('.fall', A.cue('गिर गई'));
    A.pop('.fight', A.cue('आपस में'));
    A.pop('.ruin', A.cue('खंडहर'));
    A.camera({ scale: 1.0 }, { scale: 1.08, x: -40 });
    let ruins = ''; for (let i = 0; i < 9; i++) { const x = 60 + i * 210, h = 160 + (i * 53) % 200; ruins += `<path d="M${x} 960V${960 - h}l40 30l30 -50l40 60l30 -20l40 40V960z" fill="${['#9A8A72', '#8A7A62', '#A89880'][i % 3]}" ${S}/>`; }
    return { svg: `${L.sky('#8A7E74')}${E.peaks(700, 131, { h: 260, fill: '#6E6458' })}${g('ruins', ruins, shadow)}<rect x="-200" y="960" width="2320" height="400" fill="#6E5E4A" ${S}/>${L.smoke(500, 760, 5, 'smoke sm1', 1.6)}${L.smoke(1300, 740, 5, 'smoke sm2', 1.8)}
      ${tag(560, 160, 'कम्युनिस्ट सरकार गिरी (1992)', { size: 38, fill: P.snow, cls: 'tag fall' })}${tag(1400, 160, 'मुजाहिदीन आपस में लड़े', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag fight' })}${tag(960, 1030, 'काबुल खंडहर बन गया', { size: 44, fill: P.amber3, cls: 'tag ruin' })}`, over: yr('1992–1996', 'गृहयुद्ध') };
  },

  s34(A) {
    const m = mp(VA);
    year(A);
    A.pop('.kd', A.cue('कंधार'));
    A.loop('.kd circle', { scale: 1, ...C }, { scale: 1.6, ...C }, 0.5, A.cue('कंधार'));
    A.pop('.tl', A.cue('तालिबान'));
    A.pop('.st', A.cue('छात्र'));
    A.draw('.a1 .shaft', A.cue('काबुल पर'), 1.4); A.pop('.a1 .head', A.cue('काबुल पर') + 1.3, 0.3);
    A.fadeIn('.bans', A.cue('पाबंदी') - 1.5, 0.6, 0);
    A.pop('.b1', A.cue('लड़कियों')); A.pop('.b2', A.cue('संगीत')); A.pop('.b3', A.cue('टीवी'));
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${M.place(m, 'कंधार', ...PL.kandahar, { size: 44, color: P.brick, cls: 'place kd' })}${pl(m, 'काबुल', 'kabul')}${M.arrow(m, PL.kandahar, PL.kabul, { cls: 'arrow a1', color: P.ink2, bend: -0.15 })}
      ${tag(560, 150, 'तालिबान (1994)', { size: 50, fill: P.snow, cls: 'tag tl' })}${tag(560, 260, 'मतलब: "छात्र"', { size: 38, fill: P.amber3, cls: 'tag st' })}
      ${g('bans', `<rect x="1300" y="560" width="560" height="440" fill="${P.paper}" ${S}/>${g('b1', `${L.label(1580, 660, 'लड़कियों के स्कूल', { font: HT, weight: 700, size: 40 })}${L.cross(1580, 650, 30)}`)}${g('b2', `${L.label(1580, 790, 'संगीत', { font: HT, weight: 700, size: 40 })}${L.cross(1580, 780, 30)}`)}${g('b3', `${L.label(1580, 920, 'टीवी', { font: HT, weight: 700, size: 40 })}${L.cross(1580, 910, 30)}`)}`, shadow)}`, over: yr('1996', 'तालिबान का काबुल पर कब्ज़ा') };
  },

  s35(A) {
    year(A);
    letterbox(A, 0);
    const tb = A.cue('डाइनामाइट');
    A.tween('.flash', tb, 0.5, { opacity: 0 }, { opacity: 0.9 }, 'power4.out');
    A.tween('.flash', tb + 0.5, 1.5, { opacity: 0.9 }, { opacity: 0 }, 'power1.in');
    A.tween('.cliff .b1, .cliff .b2', tb + 0.2, 1.2, { opacity: 1, scaleY: 1, ...B }, { opacity: 0, scaleY: 0.2, ...B }, 'power3.in');
    A.tween('.boom', tb, 3, { scale: 0.2, opacity: 0, ...B }, { scale: 1.4, opacity: 0.9, ...B }, 'power2.out');
    A.tween('.cam', tb, 0.07, { x: 0 }, { x: 12 }, 'none', { repeat: 15, yoyo: true });
    A.tween('.boom', tb + 3.5, 2.5, { opacity: 0.9 }, { opacity: 0 }, 'power1.in');
    A.pop('.mongol', A.cue('मंगोल'));
    return { svg: `${L.sky('url(#skyg)')}${E.peaks(500, 51, { h: 260, fill: '#A89880' })}${E.buddhaCliff(960, 1000, 1)}<rect x="-200" y="990" width="2320" height="300" fill="#7A6A56"/>
      <g class="boom">${[0, 1, 2, 3, 4].map((i) => `<circle cx="${500 + i * 200}" cy="${780 - (i % 2) * 80}" r="${130 + (i % 3) * 40}" fill="#C9B89A" stroke="${P.ink2}" stroke-width="3"/>`).join('')}</g>
      <rect class="flash" x="-200" y="-200" width="2320" height="1480" fill="#FFF6D8"/>
      ${tag(960, 200, 'जो मंगोल नहीं कर पाए…', { size: 48, fill: P.snow, cls: 'tag mongol' })}`, over: `${LB}${yr('मार्च 2001', 'बामियान')}` };
  },

  s36(A) {
    year(A);
    A.pop('.ob', A.cue('ओसामा'));
    A.fadeIn('.ny', A.cue('ग्यारह सितंबर') - 0.3, 1, 0);
    A.smoke('.sm', A.cue('ग्यारह सितंबर'), 3.5, 300, 5);
    A.pop('.n3', A.cue('तीन हज़ार'));
    A.pop('.cal', A.cue('एक महीने'));
    A.pop('.fallT', A.cue('गिर गई'));
    return { svg: `${L.sky('url(#skyg)')}${L.ground(900)}${tag(560, 160, 'ओसामा बिन लादेन · अल क़ायदा', { size: 38, fill: P.snow, cls: 'tag ob' })}
      ${g('ny', `<rect x="-200" y="300" width="2320" height="1000" fill="#C9CFD2"/>${E.towers(960, 960, 1)}${L.smoke(1000, 400, 5, 'smoke sm', 2.2)}<rect x="-200" y="960" width="2320" height="300" fill="#8C939A"/>`)}
      ${tag(960, 1030, '~3,000 लोग मारे गए', { size: 44, fill: P.snow, cls: 'tag n3' })}${cal(1560, 340, 'अक्टूबर', '7', '2001')}${tag(1650, 260, 'तालिबान सरकार गिरी', { size: 34, fill: P.amber3, cls: 'tag fallT' })}`, over: yr('11 सितंबर 2001', 'अमेरिका') };
  },

  s37(A) {
    year(A);
    ambientSky(A);
    A.pop('.vote', A.cue('चुनाव'));
    A.slideIn('.girls', A.cue('लड़कियाँ'), 1, -400);
    A.loop('.girls .fig', { y: 0 }, { y: -5 }, 0.5, A.cue('लड़कियाँ'));
    A.fadeIn('.india', A.cue('भारत ने') - 0.3, 0.8, 0);
    A.pop('.parl', A.cue('संसद'));
    A.pop('.dam', A.cue('बाँध'));
    return { svg: `${L.sky()}${L.cloud(300, 200, 1, 'cloud c1')}${L.cloud(1300, 150, 0.8, 'cloud c2')}${L.ground(900)}
      ${g('vote', `<rect x="160" y="560" width="200" height="200" fill="${P.snow}" ${S}/><rect x="210" y="540" width="100" height="20" fill="${P.ink}"/><path d="M230 520h60v30h-60z" fill="${P.paper}" ${Sthin}/>${L.label(260, 690, 'चुनाव', { font: HT, weight: 700, size: 40 })}`, shadow)}
      <g class="girls">${[0, 1, 2, 3].map((i) => E.figure(480 + i * 130, 1000, 0.8, { coat: P.slate, skirt: true, gear: 'turban', hatColor: P.snow, child: true, i })).join('')}</g>
      ${g('india', `${E.parliament(1300, 760, 0.7)}${E.dam(1500, 1040, 0.5)}${L.label(1300, 840, 'संसद भवन, काबुल (2015)', { font: HT, weight: 700, size: 30 })}${tag(1500, 200, 'भारत की मदद', { size: 50, fill: P.amber3 })}${tag(1660, 1000, 'अफ़ग़ान–भारत दोस्ती बाँध', { size: 30, fill: P.snow, cls: 'tag dam' })}`)}`, over: yr('2001–2016', '') };
  },

  s38(A) {
    year(A);
    letterbox(A, 0);
    A.loop('.dust', { x: 0, y: 0 }, { x: 60, y: -20 }, 4);
    A.drift('.patrol', 0, A.dur, { x: -200 }, { x: 300 });
    A.loop('.patrol .fig', { y: 0 }, { y: -5 }, 0.6);
    A.pop('.y20', A.cue('बीस साल'));
    A.pop('.tr', A.cue('खरबों'));
    A.pop('.cas', A.cue('मारे गए'));
    let pt = ''; for (let i = 0; i < 6; i++) pt += E.figure(200 + i * 140, 990, 0.8, { gear: 'kevlar', coat: '#9A8A5A', weapon: 'rifle', skin: ['#E2B48C', '#7A4E30', '#C48E62'][i % 3] });
    return { svg: `${L.sky('url(#dusk)')}${E.peaks(780, 141, { h: 420, fill: '#9A8A72' })}<rect x="-200" y="900" width="2320" height="400" fill="#8A7A62" ${S}/><g class="patrol">${pt}</g>${E.dust(50, 8)}
      ${tag(1450, 220, 'अमेरिका की सबसे लंबी जंग: 20 साल', { size: 38, fill: P.snow, cls: 'tag y20' })}${tag(1450, 330, 'खरबों डॉलर का खर्च', { size: 42, fill: P.amber3, cls: 'tag tr' })}${tag(1450, 440, 'हज़ारों सैनिक · 1 लाख+ अफ़ग़ान मारे गए', { size: 32, fill: P.brick2, color: P.snow, cls: 'tag cas' })}`, over: `${LB}${yr('2001–2021', '')}` };
  },

  s39(A) {
    const m = mp(VA);
    year(A);
    A.pop('.doha', A.cue('समझौता'));
    const cities = ['herat', 'kandahar', 'mazar', 'kunduz', 'ghazni', 'jalalabad'];
    const t0 = A.cue('एक के बाद एक');
    cities.forEach((c, i) => A.pop(`.c${i}`, t0 + i * 0.6, 0.4));
    A.pop('.kab', A.cue('काबुल गिर गया'));
    A.loop('.kab circle', { scale: 1, ...C }, { scale: 1.8, ...C }, 0.4, A.cue('काबुल गिर गया'));
    A.pop('.pres', A.cue('राष्ट्रपति'));
    const flags = cities.map((c, i) => { const [x, y] = m.xy(...PL[c]); return `<g class="c${i}"><circle cx="${x}" cy="${y}" r="22" fill="${P.snow}" stroke="${P.ink}" stroke-width="4"/><path d="M${x} ${y}v-60h44l-10 14l10 14h-44" fill="${P.snow}" ${Sthin}/></g>`; }).join('');
    return { svg: `${m.base()}${m.country('Afghanistan', P.amber2)}${flags}${M.place(m, 'काबुल', ...PL.kabul, { size: 50, color: P.brick, cls: 'place kab' })}
      ${tag(560, 150, '2020: अमेरिका–तालिबान समझौता', { size: 38, fill: P.snow, cls: 'tag doha' })}${tag(1450, 980, 'राष्ट्रपति देश छोड़कर भागे', { size: 38, fill: P.amber3, cls: 'tag pres' })}`, over: yr('15 अगस्त 2021', 'काबुल') };
  },

  s40(A) {
    year(A);
    letterbox(A, 0);
    A.loop('.crowd .person', { y: 0 }, { y: -8 }, 0.4);
    A.drift('.plane', A.cue('लटक') - 1, A.dur - A.cue('लटक') + 1, { x: 0, y: 0, rotation: 0 }, { x: 1300, y: -380, rotation: -10 }, 'power2.in');
    A.pop('.n1', A.cue('हज़ारों'));
    A.pop('.ret', A.cue('महाशक्ति'));
    let cr = ''; for (let i = 0; i < 30; i++) cr += L.person(-40 + i * 68, 1000 + (i % 3) * 16, 0.7, { coat: [P.olive2, P.paper3, P.slate3, P.rose][i % 4], hat: 'none', skin: E ? ['#C48E62', '#B07A52', '#9C6942'][i % 3] : '' });
    return { svg: `${L.sky('url(#dusk)')}${E.peaks(820, 151, { h: 240, fill: '#9A8A72' })}<rect x="-200" y="880" width="2320" height="400" fill="#7C7468" ${S}/><rect x="-200" y="900" width="2320" height="30" fill="#5A544A"/>${E.bigPlane(900, 840, 1)}${g('crowd', cr)}
      ${tag(560, 220, 'हज़ारों लोग, एक ही रास्ता', { size: 40, fill: P.snow, cls: 'tag n1' })}${tag(1450, 220, 'एक और महाशक्ति लौट रही थी', { size: 38, fill: P.amber3, cls: 'tag ret' })}`, over: `${LB}${yr('अगस्त 2021', 'काबुल एयरपोर्ट')}` };
  },

  s41(A) {
    year(A);
    A.fadeIn('.door', 0.2, 0.8, 0);
    A.pop('.lock', A.cue('रोक'));
    A.pop('.crisis', A.cue('आर्थिक संकट'));
    A.pop('.aid', A.cue('मदद'));
    return { svg: `${L.sky('#B8B0A8')}${L.ground(900)}${g('door', `<rect x="460" y="300" width="560" height="600" fill="${P.paper2}" ${S}/><rect x="600" y="440" width="280" height="460" fill="${P.mol3}" ${S}/>${L.label(740, 400, 'स्कूल', { font: HF, weight: 800, size: 60 })}`, shadow)}
      ${g('lock', `<rect x="700" y="640" width="80" height="70" rx="10" fill="${P.amber}" ${S}/><path d="M715 640v-30a25 25 0 0 1 50 0v30" stroke="${P.ink}" stroke-width="10" fill="none"/>`)}${E.figure(1150, 990, 1, { coat: P.slate, skirt: true, gear: 'turban', hatColor: P.snow, child: true })}
      ${tag(1500, 300, 'लड़कियों की ऊँची पढ़ाई पर रोक', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag lock' })}${tag(1500, 420, 'गहरा आर्थिक संकट', { size: 40, fill: P.snow, cls: 'tag crisis' })}${tag(1500, 540, 'लाखों लोग मदद पर निर्भर', { size: 38, fill: P.amber3, cls: 'tag aid' })}`, over: yr('आज', '') };
  },

  s42(A) {
    A.pop('.q', 0.2);
    A.pop('.truth', A.cue('सच ये है'));
    const emp = ['ईरानी', 'यूनानी', 'मौर्य', 'कुषाण', 'मुग़ल'];
    emp.forEach((e, i) => A.pop(`.e${i}`, A.cue(e), 0.4));
    A.pop('.hold', A.cue('संभाले'));
    return { svg: `${L.sky()}${E.peaks(1080, 161, { h: 240, fill: '#B8A888' })}${tag(960, 140, 'साम्राज्यों का कब्रिस्तान?', { size: 58, fill: P.snow, cls: 'tag q' })}
      ${tag(960, 280, 'जीतना मुश्किल नहीं था', { size: 46, fill: P.amber3, cls: 'tag truth' })}
      ${emp.map((e, i) => tag(400 + i * 280, 470, e + ' ✓', { size: 42, fill: P.paper, cls: `tag e${i}` })).join('')}
      ${big(960, 720, 'मुश्किल था इसे संभालना', { size: 96, color: P.brick, cls: 'hold' })}` };
  },

  s43(A) {
    A.pop('.p1', A.cue('पहली'));
    A.pop('.p2', A.cue('दूसरी'));
    A.pop('.p3', A.cue('तीसरी'));
    A.draw('.p3 .arrow .shaft', A.cue('तीसरी') + 0.3, 1);
    A.pop('.dots circle', A.cue('गाँवों'), 0.2, 0.02);
    let dots = ''; for (let i = 0; i < 40; i++) dots += `<circle cx="${760 + (i * 47) % 400}" cy="${480 + (i * 83) % 300}" r="12" fill="${P.amber}" ${Sthin}/>`;
    const card = (x, cls, title, inner) => g(cls, `<rect x="${x}" y="300" width="560" height="660" fill="${P.paper}" ${S}/>${inner}${L.label(x + 280, 900, title, { font: HF, weight: 800, size: 60 })}`, shadow);
    return { svg: `${L.sky()}${tag(960, 160, 'तीन वजहें', { size: 60, fill: P.snow })}
      ${card(80, 'p1', '1. पहाड़', `<clipPath id="cp43"><rect x="80" y="300" width="560" height="520"/></clipPath><g clip-path="url(#cp43)"><g transform="translate(80 230) scale(0.3)">${E.peaks(2000, 171, { h: 900 })}</g></g>`)}
      ${card(680, 'p2', '2. कबीले', `<g class="dots">${dots}</g>`)}
      ${card(1280, 'p3', '3. पड़ोसी', `<circle cx="1560" cy="600" r="90" fill="${P.amber2}" ${S}/><g class="arrow"><path class="shaft" d="M1340 400L1490 540M1780 400L1630 540M1560 830V700" stroke="${P.brick}" stroke-width="14" fill="none" pathLength="1" stroke-dasharray="1 1"/></g>`)}` };
  },

  s44(A) {
    A.pop('.str', A.cue('ताकत'));
    A.pop('.weak', A.cue('कमज़ोरी'));
    A.tween('.bar', A.cue('सदियों'), 2, { scaleX: 0, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power1.inOut');
    A.pop('.poor', A.cue('गरीब'));
    return { svg: `${L.sky('#C9B89A')}${E.peaks(1000, 181, { h: 300, fill: '#9A8A72' })}
      ${tag(560, 200, 'सबसे बड़ी ताकत', { size: 50, fill: P.amber3, cls: 'tag str' })}${tag(1360, 200, 'सबसे बड़ी कमज़ोरी', { size: 50, fill: P.brick2, color: P.snow, cls: 'tag weak' })}
      <rect x="260" y="480" width="1400" height="70" fill="${P.paper}" ${S}/><rect class="bar" x="260" y="480" width="1400" height="70" fill="${P.brick}" ${Sthin}/>${L.label(960, 620, '1978 → 2021: लगभग लगातार जंग', { font: HT, weight: 700, size: 44 })}
      ${tag(960, 780, 'दुनिया के सबसे गरीब देशों में', { size: 50, fill: P.snow, cls: 'tag poor' })}` };
  },

  s45(A) {
    letterbox(A, 0);
    ambientSky(A);
    A.camera({ scale: 1.0 }, { scale: 1.12, y: -30 });
    A.fadeIn('.cliff', A.cue('बुद्ध'), 1, 0);
    A.slideIn('.kw', A.cue('काबुलीवाले') - 0.4, 1.2, 400);
    A.pop('.tg', A.cue('टैगोर'));
    A.fadeIn('.ttl', A.cue('अगर आपको') - 0.3, 1, 30);
    A.pop('.sub', A.cue('सब्सक्राइब'));
    A.pop('.cm', A.cue('कमेंट'));
    return { svg: `${L.sky('url(#dusk)')}${L.sun(960, 560, 140)}${L.cloud(300, 200, 1, 'cloud c1')}${L.cloud(1300, 150, 0.8, 'cloud c2')}<g transform="translate(0 120) scale(1 0.8)">${E.buddhaCliff(960, 1000, 0.8, { empty: true })}</g><rect x="-200" y="900" width="2320" height="400" fill="#6E5E4A" ${S}/>
      ${g('kw', `${E.figure(1500, 1000, 1.3, { gear: 'turban', hatColor: P.snow, coat: P.paper3, beard: P.ink })}<path d="M1560 860q40 -10 50 60h-60z" fill="${P.mol3}" ${Sthin}/><circle cx="1580" cy="900" r="16" fill="${P.brick}"/>`)}${tag(1450, 620, '"काबुलीवाला" — रवींद्रनाथ टैगोर', { size: 34, fill: P.snow, cls: 'tag tg' })}
      ${L.label(960, 270, 'Afghanistan', { font: HF, weight: 800, size: 110, color: P.snow, cls: 'ttl', extra: `paint-order="stroke" stroke="${P.ink}" stroke-width="10"` })}${L.label(960, 360, '2500 सालों की कहानी', { font: HF, weight: 800, size: 64, color: P.amber3, cls: 'ttl', extra: `paint-order="stroke" stroke="${P.ink}" stroke-width="8"` })}
      ${tag(620, 480, 'सब्सक्राइब करें', { size: 46, fill: P.brick2, color: P.snow, cls: 'tag sub' })}${tag(1260, 480, 'अगली पूरी हिस्ट्री: कौन सा देश?', { size: 40, fill: P.amber3, cls: 'tag cm' })}`, over: LB };
  },
};

export function sfx(clips) {
  const total = clips.at(-1).start + clips.at(-1).dur;
  const by = Object.fromEntries(clips.map((c) => [c.id, c]));
  const w = (id, word) => { const c = by[id]; const x = c.sc.words.find((q) => q.w.includes(word)); return c.start + (x ? x.s : 0); };
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(1240, total), vol: 0.17, fadeIn: 2, fadeOut: 5 },
    { id: 'fx_wind1', file: 'wind.wav', start: 0, dur: by.s01.dur + by.s02.dur, vol: 0.35, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_wind2', file: 'wind.wav', start: by.s24.start, dur: by.s24.dur + by.s25.dur, vol: 0.4, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_war1', file: 'drums.wav', start: by.s08.start, dur: by.s08.dur, vol: 0.45, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_war2', file: 'drums.wav', start: by.s22.start, dur: by.s22.dur, vol: 0.5, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_war3', file: 'drums.wav', start: by.s30.start, dur: by.s30.dur, vol: 0.4, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_boom', file: 'boom.wav', start: w('s35', 'डाइनामाइट'), dur: 5, vol: 0.8 },
    { id: 'fx_jet', file: 'rush.wav', start: w('s40', 'लटक') - 1, dur: 6, vol: 0.6 },
  ];
}
