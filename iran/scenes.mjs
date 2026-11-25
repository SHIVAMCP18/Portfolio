// Iran की पूरी History — scene builders.
import * as L from '../lib/inkamber.mjs';
import * as M from '../lib/maps.mjs';
import * as E from '../lib/epic.mjs';
import * as R from '../lib/persia.mjs';
import * as I from '../lib/india.mjs';
import { fonts, css, HF, HT, tag, big, txt, yr, LB, TO, C, B, cal, clip, letterbox, year, mapCam, ambientSky, arrowIn, chapterCard } from '../lib/hindi-film.mjs';
const { P, g, S, Sthin, shadow } = L;
export { fonts, css };
export const title = 'Iran की पूरी History';

const VIR = { center: [53.5, 32.5], scale: 2300 }, VME = { center: [45, 32], scale: 850 }, VW = { center: [48, 33], scale: 620 }, VIN = { center: [64, 28], scale: 900 };
const PL = { tehran: [51.39, 35.69], persepolis: [52.89, 29.93], pasargadae: [53.17, 30.2], isfahan: [51.67, 32.65], susa: [48.25, 32.19], babylon: [44.42, 32.54], marathon: [23.97, 38.15], thermopylae: [22.54, 38.8], athens: [23.73, 37.98], carrhae: [39.03, 36.86], ctesiphon: [44.58, 33.09], qadisiyyah: [44.4, 31.8], nahavand: [48.37, 34.19], sanjan: [72.75, 20.2], delhi: [77.21, 28.61], karnal: [76.99, 29.69], msoleyman: [49.29, 31.94], hormuz: [56.4, 26.6], chabahar: [60.64, 25.29], mashhad: [59.6, 36.3], baghdad: [44.36, 33.31], tabriz: [46.29, 38.08], sardis: [28.04, 38.48], indus: [70.5, 27], kabul: [69.17, 34.53], fordow: [50.99, 34.88], gwadar: [62.3, 25.1], kandahar: [65.71, 31.61], tus: [59.6, 36.5] };
const EMP = {
  achaemenid: [[20, 41], [28, 43], [40, 42], [50, 42], [60, 43], [70, 39], [73, 33], [70, 25], [60, 24], [52, 25], [40, 24], [33, 22], [26, 27], [25, 31], [30, 36]],
  parthian: [[38, 38], [46, 40], [55, 41], [64, 39], [68, 34], [64, 27], [57, 25], [49, 28], [43, 31]],
  sassanid: [[35, 40], [45, 42], [55, 42], [66, 40], [70, 34], [66, 25], [57, 24], [50, 26], [44, 30], [38, 33]],
  safavid: [[43, 40], [50, 41], [60, 38], [64, 35], [62, 26], [55, 25], [48, 28], [44, 33]],
};
const mc = {}; const mp = (v) => mc[JSON.stringify(v)] ||= M.makeMap(v);
const pl = (m, n, k, o) => M.place(m, n, ...PL[k], o);
const xy = (m, k) => m.xy(...PL[k]);

export const chapters = {
  s04: [1, 'आर्यों की धरती'], s08: [2, 'पहला सुपरपावर'], s15: [3, 'रोम से टक्कर'], s18: [4, 'भाषा जो बच गई'],
  s24: [5, 'मंगोल से नादिर शाह'], s27: [6, 'तेल का अभिशाप'], s31: [7, 'क्रांति और जंग'], s37: [8, 'जवाब'],
};
export const chapterSvg = (n, t) => chapterCard(n, t, '#3A1E14');

export const scenes = {
  s01(A) {
    letterbox(A, 0);
    A.loop('.missile', { x: 0, y: 0 }, { x: 30, y: -16 }, 1.2);
    A.fadeIn('.news', 0.3, 0.8, 0);
    A.tween('.news', A.cue('लेकिन') - 0.4, 0.6, { opacity: 1 }, { opacity: 0 }, 'none');
    A.fadeIn('.old', A.cue('लेकिन'), 1, 0);
    A.drift('.old .persepolis', A.cue('लेकिन'), A.dur - A.cue('लेकिन'), { scale: 1.1, ...C }, { scale: 1, ...C }, 'sine.out');
    A.pop('.y2500', A.cue('ढाई हज़ार'));
    return { svg: `${g('news', `${L.sky('#2A2235')}${R.missile(700, 500, 1.2)}${R.missile(1200, 340, 0.9)}<rect x="-200" y="860" width="2320" height="500" fill="#3A2F45"/>${big(960, 240, 'ईरान', { size: 170 })}${tag(960, 960, 'जंग · मिसाइलें · परमाणु कार्यक्रम', { size: 44, fill: P.snow })}`)}
      ${g('old', `${L.sky('url(#dusk)')}${L.sun(1500, 320, 110)}<rect x="-200" y="900" width="2320" height="400" fill="#C9AE84" ${S}/>${R.persepolis(300, 1620, 960)}${tag(960, 200, '2500 साल पहले: दुनिया का सबसे बड़ा साम्राज्य', { size: 44, fill: P.amber3, cls: 'tag y2500' })}`)}`, over: LB };
  },

  s02(A) {
    const items = [['हिंदू', '.i1'], ['शतरंज', '.i2'], ['पारसी', '.i3'], ['कोहिनूर', '.i4']];
    for (const [w, c] of items) A.pop(c, A.cue(w), 0.5);
    A.pop('.ppl', A.cue('टाटा'), 0.4, 0.2);
    const card = (x, cls, title, inner) => g(cls, `<rect x="${x}" y="300" width="400" height="520" fill="${P.paper}" ${S}/>${inner}${txt(x + 200, 780, title, { size: 44 })}`, shadow);
    return { svg: `${L.sky()}${tag(960, 160, 'ईरान ↔ भारत', { size: 64, fill: P.snow })}
      ${card(60, 'i1', '"हिंदू" शब्द', `${big(260, 560, 'सिंधु → हिंदु', { size: 52, color: P.amber })}`)}
      ${card(520, 'i2', 'शतरंज', R.chess(570, 360, 0.75))}
      ${card(980, 'i3', 'पारसी', `${R.fireAltar(1180, 700, 0.9)}`)}
      ${card(1440, 'i4', 'कोहिनूर', E.diamond(1640, 540, 1))}
      ${g('ppl', `${tag(600, 920, 'टाटा', { size: 36, fill: P.amber3 })}${tag(960, 920, 'होमी भाभा', { size: 36, fill: P.amber3 })}${tag(1340, 920, 'सैम मानेकशॉ', { size: 36, fill: P.amber3 })}`)}` };
  },

  s03(A) {
    A.pop('.q1', A.cue('जिस धरती'), 0.7);
    A.pop('.q2', A.cue('और इतनी'), 0.7);
    A.fadeIn('.go', A.cue('चलिए'), 0.8, 20);
    A.loop('.flame', { scaleY: 0.85, ...B }, { scaleY: 1.15, ...B }, 0.4);
    return { svg: `${L.sky('#2A1A14')}${R.fireAltar(960, 1080, 1.2)}
      ${tag(960, 220, 'पहला सुपरपावर… आज इतना अकेला क्यों?', { size: 56, fill: P.snow, cls: 'tag q1' })}${tag(960, 380, 'इतनी हार के बाद भी, ईरान ईरान कैसे रहा?', { size: 50, fill: P.amber3, cls: 'tag q2' })}
      ${big(960, 560, 'चलिए, शुरुआत से…', { size: 76, color: P.amber3, cls: 'go' })}` };
  },

  s04(A) {
    const m = mp(VIR);
    A.fadeIn('.hl', 0.2, 0.8, 0);
    A.pop('.zag', A.cue('ज़ाग्रोस'), 0.6); A.pop('.alb', A.cue('अल्बोर्ज़'), 0.6);
    A.pop('.des', A.cue('रेगिस्तान'));
    A.pop('.hz', A.cue('होर्मुज़'));
    A.loop('.hz circle', { scale: 1, ...C }, { scale: 1.6, ...C }, 0.5, A.cue('होर्मुज़'));
    mapCam(A, 1.0, 1.08, -30);
    const zag = [[44.5, 38], [46, 35.5], [48, 33.5], [50, 31.5], [52, 29.5], [54.5, 27.8]], alb = [[47.5, 36.8], [50, 36.4], [52.5, 36], [55, 36.6], [57.5, 37.2]];
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.mountains(m, zag, { cls: 'mtns zag', size: 26 })}${M.mountains(m, alb, { cls: 'mtns alb', size: 26 })}
      ${M.regionLabel(m, 'ज़ाग्रोस', 47.2, 32, { size: 40, cls: 'rlabel zag', color: P.brick })}${M.regionLabel(m, 'अल्बोर्ज़', 52.5, 37.6, { size: 40, cls: 'rlabel alb', color: P.brick })}
      ${g('des', `${M.regionLabel(m, 'रेगिस्तान', 56, 33, { size: 44, color: P.mol3 })}`)}
      ${M.place(m, 'होर्मुज़ जलडमरूमध्य', ...PL.hormuz, { cls: 'place hz', color: P.brick, size: 34, anchor: 'end', dx: -20 })}${pl(m, 'तेहरान', 'tehran')}
      ${tag(1500, 980, 'दुनिया के तेल का बड़ा रास्ता', { size: 36, fill: P.snow, cls: 'tag hz' })}` };
  },

  s05(A) {
    A.fadeIn('.qanat', 0.2, 0.8, 0);
    A.pop('[class^="shaft"]', A.cue('ज़मीन'), 0.3, 0.1);
    A.draw('.tunnel', A.cue('नहरें'), 2.4);
    A.pop('.nm', A.cue('क़नात'));
    A.pop('.today', A.cue('आज भी'));
    return { svg: `${L.sky()}${R.qanat()}${tag(960, 150, 'क़नात: ज़मीन के नीचे की नहर', { size: 54, fill: P.amber3, cls: 'tag nm' })}${tag(1500, 330, 'कई आज भी चालू', { size: 40, fill: P.snow, cls: 'tag today' })}` };
  },

  s06(A) {
    A.pop('.ttl', A.cue('आर्यों'));
    A.pop('.sis', A.cue('बहनें'));
    A.pop('.w1', A.cue('सोम'), 0.5); A.pop('.w2', A.cue('असुर'), 0.5);
    A.pop('.link', A.cue('जुड़ी'));
    const row = (y, a, b, cls) => g(cls, `${tag(620, y, a, { size: 54, fill: P.paper })}${txt(960, y + 18, '↔', { size: 70 })}${tag(1300, y, b, { size: 54, fill: P.amber3 })}`);
    return { svg: `${L.sky()}${big(960, 190, 'ईरान = "आर्यों की धरती"', { size: 84, color: P.amber3, cls: 'ttl' })}
      ${txt(620, 330, 'वैदिक संस्कृत', { size: 44 })}${txt(1300, 330, 'प्राचीन ईरानी', { size: 44 })}
      ${row(470, 'सोम', 'होम', 'w1')}${row(620, 'असुर', 'अहुर', 'w2')}
      ${tag(960, 820, 'भारत और ईरान: शुरू से जुड़े', { size: 46, fill: P.snow, cls: 'tag link' })}${tag(960, 920, 'जैसे दो बहनें', { size: 36, fill: P.paper, cls: 'tag sis' })}` };
  },

  s07(A) {
    A.fadeIn('.altar', 0.2, 1, 0);
    A.loop('.flame', { scaleY: 0.85, ...B }, { scaleY: 1.15, ...B }, 0.4);
    A.pop('.zr', A.cue('ज़रथुस्त्र'));
    A.pop('.am', A.cue('अहुर मज़्दा'));
    A.pop('.r1', A.cue('अच्छे विचार')); A.pop('.r2', A.cue('अच्छे शब्द')); A.pop('.r3', A.cue('अच्छे कर्म'));
    return { svg: `${L.sky('#2A1A14')}<rect x="-200" y="900" width="2320" height="400" fill="#4A3424" ${S}/>${R.fireAltar(500, 960, 1.4)}
      ${tag(1350, 180, 'ज़रथुस्त्र का धर्म', { size: 52, fill: P.snow, cls: 'tag zr' })}${tag(1350, 300, 'एक भगवान: अहुर मज़्दा', { size: 40, fill: P.amber3, cls: 'tag am' })}
      ${tag(1350, 480, 'अच्छे विचार', { size: 50, fill: P.paper, cls: 'tag r1' })}${tag(1350, 610, 'अच्छे शब्द', { size: 50, fill: P.paper, cls: 'tag r2' })}${tag(1350, 740, 'अच्छे कर्म', { size: 50, fill: P.paper, cls: 'tag r3' })}` };
  },

  s08(A) {
    const m = mp(VME);
    year(A);
    A.pop('.cy', A.cue('साइरस'));
    A.tween('.blob', A.cue('जीत लिए') - 1.5, 2.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.bab', A.cue('बेबीलोन'));
    arrowIn(A, '.a1', A.cue('यहूदियों'), 1.3);
    A.pop('.ret', A.cue('इजाज़त'));
    mapCam(A, 1.0, 1.1, 40);
    return { svg: `${m.base()}${M.blob(m, EMP.achaemenid, { fill: P.brick, op: 0.3 })}${m.country('Iran', P.amber2)}${pl(m, 'पसारगाडे', 'pasargadae')}${pl(m, 'बेबीलोन', 'babylon', { cls: 'place bab', color: P.brick })}
      ${M.arrow(m, PL.babylon, [35.2, 31.8], { cls: 'arrow a1', color: P.slate, bend: 0.2, w: 10 })}${tag(xy(m, 'babylon')[0] - 220, xy(m, 'babylon')[1] - 170, 'यहूदियों को घर लौटने दिया', { size: 34, fill: P.snow, cls: 'tag ret' })}
      ${tag(1500, 160, 'साइरस महान', { size: 56, fill: P.amber3, cls: 'tag cy' })}`, over: yr('~550', 'ईसा पूर्व') };
  },

  s09(A) {
    A.pop('.cyl', A.cue('सिलेंडर'));
    A.loop('.cyl', { y: 0 }, { y: -8 }, 1.4, A.cue('सिलेंडर'));
    A.pop('.bm', A.cue('ब्रिटिश म्यूज़ियम'));
    A.pop('.hr', A.cue('मानवाधिकार'));
    A.pop('.deb', A.cue('बहस'));
    A.pop('.tol', A.cue('सहनशीलता'));
    return { svg: `${L.sky('#E6D6B4')}${R.cylinder(800, 560, 1.4)}
      ${tag(800, 220, 'साइरस सिलेंडर · ब्रिटिश म्यूज़ियम', { size: 42, fill: P.snow, cls: 'tag bm' })}${tag(800, 860, '"पहला मानवाधिकार घोषणापत्र"?', { size: 46, fill: P.amber3, cls: 'tag hr' })}
      ${tag(1580, 420, 'इतिहासकारों में बहस', { size: 36, fill: P.paper, cls: 'tag deb' })}${tag(1580, 560, 'डर कम, सहनशीलता ज़्यादा', { size: 36, fill: P.snow, cls: 'tag tol' })}` };
  },

  s10(A) {
    const m = mp(VW);
    year(A);
    A.pop('.dr', A.cue('दारा'));
    A.tween('.blob', A.cue('मिस्र'), 2.2, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.eg', A.cue('मिस्र')); A.pop('.ind', A.cue('सिंधु'));
    A.pop('.pop', A.cue('पाँच करोड़'));
    A.pop('.sp', A.cue('सुपरपावर'));
    mapCam(A, 1.12, 1.0, 0);
    return { svg: `${m.base()}${M.blob(m, EMP.achaemenid, { fill: P.brick, op: 0.4 })}${m.country('Iran', P.amber2)}${M.regionLabel(m, 'हख़ामनी साम्राज्य', 46, 35, { size: 46 })}
      ${M.place(m, 'मिस्र', 31.2, 27, { cls: 'place eg', size: 34 })}${M.place(m, 'सिंधु', ...PL.indus, { cls: 'place ind', size: 34, color: P.brick })}
      ${tag(560, 160, 'दारा (डेरियस प्रथम)', { size: 46, fill: P.snow, cls: 'tag dr' })}${tag(1450, 160, '~5 करोड़ लोग, एक राजा', { size: 44, fill: P.amber3, cls: 'tag pop' })}
      ${big(1450, 980, 'पहला सुपरपावर', { size: 70, color: P.amber3, cls: 'sp' })}`, over: yr('~500', 'ईसा पूर्व') };
  },

  s11(A) {
    A.pop('.s1', A.cue('स अक्षर'));
    A.pop('.arr', A.cue('हिंदु'));
    A.pop('.s2', A.cue('हिंदु'));
    A.pop('.ins', A.cue('शिलालेखों'));
    A.pop('.s3', A.cue('इंडिया'));
    A.pop('.both', A.cue('दोनों'));
    return { svg: `${L.sky()}${big(380, 520, 'सिंधु', { size: 140, color: P.slate, cls: 's1' })}${big(960, 520, '→', { size: 140, color: P.ink, cls: 'arr' })}${big(1500, 520, 'हिंदु', { size: 140, color: P.amber, cls: 's2' })}
      ${tag(960, 200, 'फ़ारसी में "स" → "ह"', { size: 52, fill: P.snow })}${tag(960, 700, 'दारा के शिलालेख: "हिंदुश"', { size: 42, fill: P.paper, cls: 'tag ins' })}
      ${tag(960, 830, 'यूनानी: Indos → INDIA', { size: 42, fill: P.amber3, cls: 'tag s3' })}${tag(960, 960, '"हिंदू" और "इंडिया": दोनों ईरान के रास्ते', { size: 38, fill: P.snow, cls: 'tag both' })}` };
  },

  s12(A) {
    const m = mp(VME);
    year(A);
    A.draw('.road', A.cue('शाही सड़क') - 0.3, 2.5);
    A.pop('.k25', A.cue('ढाई हज़ार'));
    A.drift('.horse', A.cue('डाक'), 4, { x: 0 }, { x: 900 }, 'power1.inOut');
    A.fadeIn('.pers', A.cue('पर्सेपोलिस') - 0.3, 0.9, 0);
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${pl(m, 'सार्दिस', 'sardis')}${pl(m, 'सूसा', 'susa')}
      <path class="road" d="M${xy(m, 'sardis').join(' ')}Q${m.xy(36, 39).join(' ')} ${m.xy(40, 37).join(' ')}T${xy(m, 'susa').join(' ')}" stroke="${P.brick}" stroke-width="9" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      <g class="horse">${E.rider(xy(m, 'sardis')[0], xy(m, 'sardis')[1] + 120, 0.35, { gear: 'turban', coat: P.amber, gallop: true })}</g>
      ${tag(1450, 160, 'शाही सड़क: ~2,500 किमी', { size: 44, fill: P.amber3, cls: 'tag k25' })}
      ${clip('cp12', 1060, 560, 820, 440, `${L.sky('url(#dusk)')}${R.persepolis(1150, 1800, 1000, 'persepolis', { n: 6 })}`, 'class="pers"')}${txt(1470, 540, 'पर्सेपोलिस', { size: 44, cls: 'pers' })}`, over: yr('~500', 'ईसा पूर्व') };
  },

  s13(A) {
    const m = mp(VW);
    year(A);
    A.pop('.gr', A.cue('यूनान'));
    A.pop('.mar', A.cue('मैराथन'));
    A.pop('.th', A.cue('थर्मोपिली'));
    A.pop('.n300', A.cue('तीन सौ'));
    A.draw('.a1 .shaft', A.cue('एथेंस') - 0.8, 1.2); A.pop('.a1 .head', A.cue('एथेंस') + 0.3, 0.3);
    A.smoke('.sm', A.cue('जला'), 2.5, 160);
    A.pop('.nope', A.cue('पूरी तरह'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${m.country('Greece', P.slate3, 'gr')}${M.arrow(m, PL.susa, PL.athens, { cls: 'arrow a1', bend: -0.2 })}
      ${M.place(m, 'मैराथन', ...PL.marathon, { cls: 'place mar', size: 30, dx: 14 })}${M.place(m, 'थर्मोपिली', ...PL.thermopylae, { cls: 'place th', size: 30, anchor: 'end', dx: -14 })}
      ${L.smoke(xy(m, 'athens')[0], xy(m, 'athens')[1], 5, 'smoke sm', 0.8)}
      ${g('n300', `${[0, 1, 2, 3, 4].map((i) => E.figure(1180 + i * 120, 1000, 0.8, { gear: 'greek', coat: P.brick, weapon: 'spear', shield: P.amber2, skin: '#E2B48C' })).join('')}${tag(1420, 600, '300 स्पार्टन', { size: 44, fill: P.snow })}`)}
      ${tag(560, 160, 'यूनान की चुनौती', { size: 46, fill: P.snow, cls: 'tag gr' })}${tag(560, 270, 'एथेंस जला… पर यूनान नहीं जीता', { size: 34, fill: P.amber3, cls: 'tag nope' })}`, over: yr('490–480', 'ईसा पूर्व') };
  },

  s14(A) {
    year(A);
    letterbox(A, 0);
    A.slideIn('.alx', 0.3, 1, -400);
    A.tween('.fire', A.cue('जला दिया') - 0.3, 1.5, { opacity: 0 }, { opacity: 0.35 }, 'power2.out');
    A.smoke('.sm1', A.cue('जला दिया'), 2.4, 240); A.smoke('.sm2', A.cue('जला दिया') + 0.6, 2.8, 260);
    A.tween('.c1, .c4', A.cue('जला दिया') + 0.5, 1.5, { rotation: 0, ...B }, { rotation: 12, ...B }, 'power3.in');
    A.pop('.end', A.cue('ख़त्म'));
    return { svg: `${L.sky('url(#dusk)')}<rect x="-200" y="900" width="2320" height="400" fill="#B49A78" ${S}/>${R.persepolis(500, 1700, 960)}
      <rect class="fire" x="-200" y="-200" width="2320" height="1480" fill="${P.brick}" opacity="0.35"/>${L.smoke(800, 500, 5, 'smoke sm1', 2)}${L.smoke(1400, 480, 5, 'smoke sm2', 2.2)}
      ${E.figure(240, 1010, 1.5, { gear: 'greek', coat: P.brick, weapon: 'spear', shield: P.amber2, cls: 'fig alx', skin: '#E2B48C' })}${tag(960, 220, 'पहला सुपरपावर ख़त्म', { size: 54, fill: P.snow, cls: 'tag end' })}`, over: `${LB}${yr('330', 'ईसा पूर्व · पर्सेपोलिस')}` };
  },

  s15(A) {
    const m = mp(VME);
    year(A);
    A.tween('.blob', 0.4, 1.8, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.rome', A.cue('रोम'));
    A.pop('.car', A.cue('कैरी'));
    A.fadeIn('.shot', A.cue('घुड़सवार') - 0.3, 0.6, 0);
    A.loop('.shot .rider', { y: 0 }, { y: -10 }, 0.3, A.cue('घुड़सवार'));
    A.draw('.arrowshot', A.cue('तीर'), 0.6);
    A.pop('.ps', A.cue('पार्थियन शॉट'));
    return { svg: `${m.base()}${M.blob(m, EMP.parthian, { fill: P.olive, op: 0.35 })}${m.country('Iran', P.amber2)}${M.regionLabel(m, 'पार्थियन', 54, 36)}${M.place(m, 'कैरी', ...PL.carrhae, { cls: 'place car', color: P.brick, size: 34 })}
      ${tag(560, 160, 'रोम को टक्कर', { size: 46, fill: P.snow, cls: 'tag rome' })}
      ${clip('cp15', 1000, 520, 880, 480, `<rect x="1000" y="520" width="880" height="480" fill="#C9AE84"/>${E.rider(1600, 960, 0.75, { gear: 'mongol', coat: P.olive, gallop: true })}<path class="arrowshot" d="M1500 800L1080 720" stroke="${P.ink}" stroke-width="6" pathLength="1" stroke-dasharray="1 1"/>`, 'class="shot"')}
      ${tag(1440, 470, '"पार्थियन शॉट"', { size: 42, fill: P.amber3, cls: 'tag ps' })}`, over: yr('53', 'ईसा पूर्व · कैरी') };
  },

  s16(A) {
    year(A);
    A.fadeIn('.relief', 0.3, 1, 0);
    A.pop('.sh', A.cue('शापूर'));
    A.slideIn('.val', A.cue('वेलेरियन'), 0.9, 400);
    A.pop('.shame', A.cue('शर्मनाक'));
    A.pop('.rock', A.cue('चट्टानों'));
    return { svg: `${L.sky()}${g('relief', `<rect x="160" y="180" width="1600" height="760" fill="#B49A78" ${S}/><rect x="160" y="180" width="1600" height="760" fill="url(#hatch)" opacity="0.25"/>`, shadow)}
      ${E.rider(760, 880, 1.2, { gear: 'crown', coat: '#9A8A72', horse: '#8A7E6C', cls: 'rider sh' })}${E.figure(1240, 900, 1.3, { gear: 'greek', coat: '#9A8A72', pose: 'arms', cls: 'fig val', skin: '#A89880' })}
      ${tag(760, 140, 'राजा शापूर', { size: 44, fill: P.snow, cls: 'tag sh' })}${tag(1300, 140, 'रोमन बादशाह वेलेरियन: बंदी', { size: 40, fill: P.amber3, cls: 'tag val' })}
      ${tag(960, 1010, 'चट्टान पर खुदा दृश्य, आज भी मौजूद', { size: 36, fill: P.paper, cls: 'tag rock' })}${tag(960, 260, 'रोम की सबसे शर्मनाक घटनाओं में से एक', { size: 34, fill: P.snow, cls: 'tag shame' })}`, over: yr('260', 'ईसवी') };
  },

  s17(A) {
    const m = mp(VIN);
    A.draw('.a1 .shaft', A.cue('शतरंज') - 0.4, 1.3); A.pop('.a1 .head', A.cue('शतरंज') + 0.8, 0.3);
    A.pop('.ch', A.cue('चतुरंग'));
    A.pop('.cm', A.cue('चेकमेट'));
    A.draw('.a2 .shaft', A.cue('पंचतंत्र') - 0.3, 1.3); A.pop('.a2 .head', A.cue('पंचतंत्र') + 0.9, 0.3);
    A.pop('.pt', A.cue('पंचतंत्र'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.arrow(m, [76, 26], [55, 32.5], { cls: 'arrow a1', color: P.olive, bend: -0.2 })}${M.arrow(m, [77, 22], [54, 30], { cls: 'arrow a2', color: P.slate, bend: 0.2 })}
      ${clip('cp17', 1240, 160, 600, 540, `<rect x="1240" y="160" width="600" height="540" fill="${P.paper}"/>${R.chess(1340, 200, 0.95)}`, 'class="ch"')}
      ${tag(1540, 760, 'चतुरंग → शतरंज', { size: 44, fill: P.amber3, cls: 'tag ch' })}${tag(1540, 870, '"शाह मात" → Checkmate', { size: 40, fill: P.snow, cls: 'tag cm' })}
      ${tag(560, 900, 'पंचतंत्र की कहानियाँ', { size: 44, fill: P.paper, cls: 'tag pt' })}` };
  },

  s18(A) {
    const m = mp(VME);
    year(A);
    arrowIn(A, '.a1', A.cue('अरब'), 1.5);
    A.pop('.qd', A.cue('क़ादिसिया')); A.pop('.nh', A.cue('नहावंद'));
    A.pop('.fall', A.cue('गिर गया'));
    A.pop('.but', A.cue('कमाल'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.arrow(m, [40, 25], [46, 31.5], { cls: 'arrow a1', color: P.olive, bend: 0.15 })}${M.place(m, 'क़ादिसिया', ...PL.qadisiyyah, { cls: 'place qd', size: 32, anchor: 'end', dx: -16 })}${M.place(m, 'नहावंद', ...PL.nahavand, { cls: 'place nh', size: 32 })}
      ${tag(1450, 160, 'सासानी साम्राज्य गिरा', { size: 46, fill: P.snow, cls: 'tag fall' })}${tag(1450, 980, 'लेकिन एक कमाल हुआ…', { size: 44, fill: P.amber3, cls: 'tag but' })}`, over: yr('636–651', 'ईसवी') };
  },

  s19(A) {
    const m = mp(VME);
    year(A);
    A.pop('.ar', A.cue('अरबी भाषा'));
    A.pop('.fa', A.cue('नहीं छोड़ी'));
    A.fadeIn('.book', A.cue('फ़िरदौसी') - 0.3, 0.8, 30);
    A.pop('.n50', A.cue('पचास हज़ार'));
    A.pop('.saved', A.cue('बचा लिया'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${m.country('Egypt', P.slate3, 'ar')}${m.country('Iraq', P.slate3, 'ar')}${m.country('Syria', P.slate3, 'ar')}
      ${M.regionLabel(m, 'अरबी', 36, 29, { size: 48, cls: 'rlabel ar', color: P.slate })}${M.regionLabel(m, 'फ़ारसी ✓', 54, 32, { size: 56, cls: 'rlabel fa', color: P.brick })}
      ${R.book(1560, 560, 'शाहनामा', 1)}${tag(1560, 900, '~50,000 शेर · फ़िरदौसी', { size: 38, fill: P.amber3, cls: 'tag n50' })}${tag(560, 980, '"फ़िरदौसी ने फ़ारसी बचा ली"', { size: 40, fill: P.snow, cls: 'tag saved' })}`, over: yr('~1010', 'ईसवी') };
  },

  s20(A) {
    const m = mp(VIN);
    year(A);
    A.draw('.route', A.cue('समुद्र'), 2.5);
    A.drift('.ship', A.cue('समुद्र'), 2.5, { x: -400, y: -100 }, { x: 0, y: 0 }, 'power1.inOut');
    A.pop('.sj', A.cue('संजान'));
    A.fadeIn('.story', A.cue('कहानी') - 0.3, 0.8, 0);
    A.pop('.bowl', A.cue('दूध'));
    A.pop('.sugar', A.cue('चीनी'));
    A.drift('.grains', A.cue('चीनी') + 0.3, 1.2, { y: -120, opacity: 0 }, { y: 0, opacity: 1 }, 'power1.in');
    A.pop('.msg', A.cue('घुल'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}<path class="route" d="M${m.xy(56.5, 26.8).join(' ')}Q${m.xy(64, 21).join(' ')} ${xy(m, 'sanjan').join(' ')}" stroke="${P.slate}" stroke-width="8" fill="none" stroke-dasharray="1 1" pathLength="1"/>${M.place(m, 'संजान, गुजरात', ...PL.sanjan, { cls: 'place sj', color: P.brick, size: 34 })}
      <g class="ship">${R.dhow(xy(m, 'sanjan')[0] - 200, xy(m, 'sanjan')[1] + 30, 0.35)}</g>
      ${clip('cp20', 1160, 160, 700, 600, `<rect x="1160" y="160" width="700" height="600" fill="${P.paper}"/>${R.bowl(1510, 560, 1.4)}<g class="grains">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${1450 + i * 20}" cy="${500 - (i % 3) * 14}" r="6" fill="#FFF"/>`).join('')}</g>${tag(1510, 260, 'दूध से भरा कटोरा', { size: 38, fill: P.snow, cls: 'tag bowl' })}${tag(1510, 360, '+ चीनी', { size: 42, fill: P.amber3, cls: 'tag sugar' })}`, 'class="story"')}
      ${tag(1510, 840, '"दूध में चीनी की तरह घुल जाएँगे"', { size: 34, fill: P.snow, cls: 'tag msg' })}`, over: yr('8वीं–10वीं सदी', 'परंपरा के अनुसार') };
  },

  s21(A) {
    A.pop('.small', A.cue('छोटा'));
    const ppl = ['टाटा', 'नौरोजी', 'भाभा', 'मानेकशॉ'];
    ppl.forEach((p, i) => A.pop(`.p${i}`, A.cue(p), 0.5));
    const names = ['जमशेदजी टाटा', 'दादाभाई नौरोजी', 'होमी भाभा', 'सैम मानेकशॉ'], roles = ['उद्योग', 'स्वतंत्रता आंदोलन', 'परमाणु कार्यक्रम', 'फ़ील्ड मार्शल'];
    const gear = ['pakol', 'pakol', 'none', 'kevlar'];
    return { svg: `${L.sky()}${L.ground(900)}${tag(960, 140, 'पारसी: छोटा समुदाय, बड़ा योगदान', { size: 52, fill: P.amber3, cls: 'tag small' })}
      ${names.map((n, i) => g(`p${i}`, `<rect x="${110 + i * 440}" y="280" width="380" height="600" fill="${P.paper}" ${S}/>${E.figure(300 + i * 440, 760, 1.4, { gear: gear[i], hatColor: P.ink, coat: [P.ink2, P.slate, P.paper3, P.olive][i], skin: '#E2B48C' })}${txt(300 + i * 440, 820, n, { size: 36 })}${txt(300 + i * 440, 860, roles[i], { size: 28, color: P.ink2 })}`, shadow)).join('')}` };
  },

  s22(A) {
    A.pop('.c0', A.cue('इब्न सीना'), 0.5); A.pop('.c1', A.cue('उमर ख़य्याम'), 0.5); A.pop('.c2', A.cue('रूमी'), 0.5);
    const card = (x, cls, name, what) => g(cls, `<rect x="${x}" y="300" width="520" height="560" fill="${P.paper}" ${S}/>${R.book(x + 260, 560, '', 0.6)}${txt(x + 260, 760, name, { size: 44 })}${txt(x + 260, 810, what, { size: 30, color: P.ink2 })}`, shadow);
    return { svg: `${L.sky('#E6D6B4')}${tag(960, 160, 'ज्ञान का केंद्र', { size: 56, fill: P.amber3 })}
      ${card(100, 'c0', 'इब्न सीना', 'चिकित्सा')}${card(700, 'c1', 'उमर ख़य्याम', 'कविता · गणित · कैलेंडर')}${card(1300, 'c2', 'रूमी · हाफ़िज़', 'कविता')}` };
  },

  s23(A) {
    const m = mp(VIN);
    A.draw('.a1 .shaft', A.cue('भारत पहुँची') - 0.5, 1.4); A.pop('.a1 .head', A.cue('भारत पहुँची') + 0.8, 0.3);
    A.pop('.court', A.cue('दरबार'));
    const ws = ['बाज़ार', 'दरवाज़ा', 'ज़मीन', 'आसमान', 'दोस्त', 'हिंदुस्तान'];
    ws.forEach((w, i) => A.pop(`.w${i}`, A.cue(w), 0.4));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.arrow(m, [54, 32], [76.5, 28.4], { cls: 'arrow a1', color: P.brick, bend: -0.12 })}${pl(m, 'दिल्ली', 'delhi')}
      ${tag(1450, 160, 'सदियों तक दरबार की भाषा: फ़ारसी', { size: 38, fill: P.snow, cls: 'tag court' })}
      ${ws.map((w, i) => tag(330 + (i % 3) * 380, 800 + Math.floor(i / 3) * 120, w, { size: 48, fill: P.amber3, cls: `tag w${i}` })).join('')}` };
  },

  s24(A) {
    year(A);
    letterbox(A, 0);
    A.slideIn('.cav', 0.2, 1.5, -600);
    A.loop('.cav .rider', { y: 0 }, { y: -10 }, 0.3);
    A.smoke('.sm', A.cue('तबाह'), 2.6, 200);
    A.fadeOut('.cav, .sm', A.cue('लेकिन') - 0.3, 0.5);
    A.fadeIn('.convert', A.cue('लेकिन'), 0.8, 0);
    A.pop('.rang', A.cue('रंग'));
    return { svg: `${L.sky('url(#dusk)')}${E.peaks(820, 201, { h: 260 })}<rect x="-200" y="900" width="2320" height="400" fill="#B49A78" ${S}/>${E.cavalry(60, 1000, 6, 0.6, { gear: 'mongol', coat: P.mol3, weapon: 'spear', gallop: true })}${L.smoke(1300, 760, 5, 'smoke sm', 2)}
      ${g('convert', `${E.figure(760, 1000, 1.4, { gear: 'mongol', coat: P.mol3 })}${txt(960, 860, '→', { size: 110 })}${E.figure(1160, 1000, 1.4, { gear: 'turban', hatColor: P.snow, coat: '#3E7C8C', beard: P.ink })}${tag(960, 300, 'जीतने वाले ख़ुद ईरानी रंग में रंग गए', { size: 44, fill: P.amber3, cls: 'tag rang' })}`)}`, over: `${LB}${yr('1219–1258', 'मंगोल')}` };
  },

  s25(A) {
    const m = mp(VME);
    year(A);
    A.tween('.blob', 0.4, 1.6, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.shia', A.cue('शिया'));
    A.fadeIn('.isf', A.cue('इस्फ़हान') - 0.4, 0.9, 0);
    A.pop('.half', A.cue('आधी दुनिया'));
    return { svg: `${m.base()}${M.blob(m, EMP.safavid, { fill: '#3E7C8C', op: 0.35 })}${m.country('Iran', P.amber2)}${M.regionLabel(m, 'सफ़वी साम्राज्य', 53, 34)}
      ${tag(560, 160, 'शिया इस्लाम: राज्य का धर्म', { size: 40, fill: P.snow, cls: 'tag shia' })}
      ${clip('cp25', 1040, 380, 840, 620, `${L.sky('url(#dusk)')}<rect x="1040" y="880" width="840" height="200" fill="#C9AE84"/>${E.dome(1460, 900, 0.9)}${E.minaret(1200, 920, 0.8)}${E.minaret(1720, 920, 0.8)}`, 'class="isf"')}
      ${tag(1460, 330, '"इस्फ़हान, निस्फ़े जहान"', { size: 42, fill: P.amber3, cls: 'tag half' })}`, over: yr('1501', 'सफ़वी') };
  },

  s26(A) {
    const m = mp(VIN);
    year(A);
    arrowIn(A, '.a1', 0.5, 1.6);
    A.pop('.kr', A.cue('करनाल'));
    A.pop('.dl', A.cue('दिल्ली'));
    A.tween('.red', A.cue('क़त्ले आम'), 1, { opacity: 0 }, { opacity: 0.4 }, 'none');
    A.pop('.thrn', A.cue('मयूर सिंहासन'));
    A.pop('.diamond', A.cue('कोहिनूर'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.arrow(m, [53, 33], PL.delhi, { cls: 'arrow a1', bend: -0.1 })}${M.place(m, 'करनाल', ...PL.karnal, { cls: 'place kr', size: 30, dy: -10 })}${M.place(m, 'दिल्ली', ...PL.delhi, { cls: 'place dl', size: 36, color: P.brick })}
      <rect class="red" x="-200" y="-200" width="2320" height="1480" fill="${P.brick}"/>
      ${tag(560, 160, 'नादिर शाह', { size: 54, fill: P.snow })}${R.peacockThrone(700, 1000, 0.8)}${tag(700, 520, 'मयूर सिंहासन', { size: 40, fill: P.amber3, cls: 'tag thrn' })}${E.diamond(1500, 760, 1.1)}${tag(1500, 960, 'कोहिनूर', { size: 44, fill: P.snow, cls: 'tag diamond' })}`, over: yr('1739', 'दिल्ली') };
  },

  s27(A) {
    const m = mp(VME);
    year(A);
    arrowIn(A, '.ru', A.cue('रूस'), 1.3);
    arrowIn(A, '.br', A.cue('अंग्रेज़ों'), 1.3);
    A.pop('.derrick', A.cue('तेल मिला'));
    A.tween('.gush', A.cue('तेल मिला') + 0.4, 1, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power2.out');
    A.pop('.fate', A.cue('किस्मत'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.arrow(m, [46, 45], [49, 38.5], { cls: 'arrow ru', color: P.slate, bend: 0.1 })}${M.arrow(m, [60, 20], [56, 27], { cls: 'arrow br', color: P.brick, bend: 0.1 })}
      ${tag(m.xy(46, 45)[0], m.xy(46, 45)[1] - 50, 'रूस', { size: 38, fill: P.snow, cls: 'tag ru' })}${tag(m.xy(60, 20)[0], m.xy(60, 20)[1] + 50, 'अंग्रेज़', { size: 38, fill: P.snow, cls: 'tag br' })}
      ${R.derrick(1500, 980, 1.2)}${tag(1500, 260, '1908: तेल मिला', { size: 46, fill: P.amber3, cls: 'tag fate' })}`, over: yr('1800s–1908', 'क़ाजार') };
  },

  s28(A) {
    year(A);
    A.pop('.co', A.cue('ब्रिटिश कंपनी'));
    A.pop('.bp', A.cue('बीपी'));
    A.drift('.barrels', A.cue('मुनाफ़े'), 3, { x: 0 }, { x: 900 }, 'power1.in');
    A.pop('.name', A.cue('पर्शिया'));
    return { svg: `${L.sky()}${L.ground(900)}${R.derrick(400, 960, 1.1)}<g class="barrels">${[0, 1, 2].map((i) => L.barrel(700 + i * 120, 960, 0.8, 'barrel', P.ink2)).join('')}</g>${E.unionFlag ? '' : ''}${I.unionFlag(1700, 520, 130)}
      ${tag(1100, 200, 'ब्रिटिश तेल कंपनी → बाद में BP', { size: 42, fill: P.snow, cls: 'tag co bp' })}${big(1150, 760, 'PERSIA → IRAN', { size: 84, color: P.amber3, cls: 'name' })}`, over: yr('1935', '') };
  },

  s29(A) {
    year(A);
    A.slideIn('.mos', 0.3, 1, -400);
    A.pop('.nat', A.cue('राष्ट्रीयकरण'));
    A.pop('.cia', A.cue('सीआईए'));
    A.loop('.cia', { rotation: -2, ...C }, { rotation: 2, ...C }, 0.2, A.cue('सीआईए') + 0.5);
    A.pop('.adm', A.cue('ख़ुद'));
    A.pop('.never', A.cue('भूला'));
    return { svg: `${L.sky()}${L.ground(900)}${E.figure(400, 990, 1.6, { coat: P.ink2, cls: 'fig mos', skin: '#D9A57A' })}${tag(400, 520, 'मोहम्मद मोसद्दिक़', { size: 40, fill: P.snow, cls: 'tag mos' })}
      ${L.stamp(1200, 260, 'तेल का राष्ट्रीयकरण · 1951', { size: 46, cls: 'stamp nat', color: P.olive })}${L.stamp(1200, 480, 'तख़्तापलट · 1953', { size: 56, cls: 'stamp cia' })}
      ${tag(1200, 680, 'CIA + ब्रिटेन (अमेरिका ने बाद में माना)', { size: 34, fill: P.paper, cls: 'tag adm' })}${tag(1200, 820, 'ईरान ये कभी नहीं भूला', { size: 46, fill: P.amber3, cls: 'tag never' })}`, over: yr('1951–1953', '') };
  },

  s30(A) {
    year(A);
    A.pop('.mod', A.cue('आधुनिक'));
    A.pop('.sav', A.cue('सावाक'));
    A.fadeIn('.party', A.cue('जश्न') - 0.4, 0.8, 0);
    A.pop('.money', A.cue('बेहिसाब'));
    return { svg: `${L.sky('url(#dusk)')}<rect x="-200" y="900" width="2320" height="400" fill="#B49A78" ${S}/>${R.persepolis(260, 1100, 960, 'persepolis', { n: 5 })}
      ${g('party', `${[0, 1, 2].map((i) => `<path d="M${1220 + i * 200} 900l100 -220l100 220z" fill="${[P.amber3, P.snow, P.brick2][i]}" ${S}/>`).join('')}${txt(1520, 960, '2500 साल का जश्न', { size: 40 })}`)}
      ${tag(560, 160, 'शाह: तेज़ आधुनिकीकरण', { size: 40, fill: P.snow, cls: 'tag mod' })}${tag(560, 270, 'सावाक: विरोधियों पर ज़ुल्म', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag sav' })}${tag(1520, 300, 'बेहिसाब खर्च', { size: 44, fill: P.amber3, cls: 'tag money' })}`, over: yr('1953–1978', 'शाह का दौर') };
  },

  s31(A) {
    year(A);
    letterbox(A, 0);
    A.fadeIn('.protest', 0.2, 0.8, 0);
    A.loop('.protest .pp', { y: 0 }, { y: -12 }, 0.4);
    A.pop('.shah', A.cue('शाह'));
    A.pop('.kh', A.cue('ख़ुमैनी'));
    A.pop('.ir', A.cue('इस्लामी गणराज्य'));
    return { svg: `${L.sky('#C98A70')}<rect x="-200" y="880" width="2320" height="400" fill="#7A5A46" ${S}/>${R.protest(80, 1840, 1000, 22, 0.75)}
      ${tag(560, 220, 'जनवरी 1979: शाह देश छोड़कर गए', { size: 38, fill: P.snow, cls: 'tag shah' })}${tag(1360, 220, '1 फ़रवरी: ख़ुमैनी की वापसी', { size: 38, fill: P.snow, cls: 'tag kh' })}${big(960, 450, 'इस्लामी गणराज्य', { size: 96, color: P.amber3, cls: 'ir' })}`, over: `${LB}${yr('1979', 'क्रांति')}` };
  },

  s32(A) {
    year(A);
    A.fadeIn('.embassy', 0.3, 0.8, 0);
    A.fadeIn('.protest', A.cue('छात्रों') - 0.3, 0.6, 0);
    A.loop('.protest .pp', { y: 0 }, { y: -10 }, 0.45, A.cue('छात्रों'));
    A.pop('.n52', A.cue('बावन'));
    A.pop('.d444', A.cue('चार सौ चवालीस'));
    A.pop('.enmity', A.cue('दुश्मनी'));
    return { svg: `${L.sky()}<rect x="-200" y="900" width="2320" height="400" fill="#9A8A72" ${S}/>${R.embassy(960, 900, 1.2)}${R.protest(100, 1820, 1040, 18, 0.6)}
      ${tag(480, 160, 'तेहरान: अमेरिकी दूतावास', { size: 40, fill: P.snow })}${tag(1450, 160, '52 बंधक', { size: 50, fill: P.brick2, color: P.snow, cls: 'tag n52' })}${tag(1450, 270, '444 दिन', { size: 50, fill: P.amber3, cls: 'tag d444' })}
      ${tag(960, 380, 'ईरान–अमेरिका दुश्मनी की शुरुआत', { size: 40, fill: P.snow, cls: 'tag enmity' })}`, over: yr('नवंबर 1979', '') };
  },

  s33(A) {
    const m = mp(VME);
    year(A);
    arrowIn(A, '.a1', A.cue('हमला'), 1.3);
    A.pop('.y8', A.cue('आठ साल'));
    A.fadeIn('.war', A.cue('लाखों') - 0.3, 0.6, 0);
    A.drift('.tanks', A.cue('लाखों'), 4, { x: -300 }, { x: 0 }, 'power1.out');
    A.pop('.chem', A.cue('रासायनिक'));
    A.pop('.same', A.cue('वहीं'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${m.country('Iraq', P.slate3, 'iq')}${M.arrow(m, [44.4, 33.3], [48.5, 31.8], { cls: 'arrow a1', color: P.brick, bend: 0.2 })}
      ${tag(560, 160, 'सद्दाम हुसैन का हमला', { size: 42, fill: P.snow })}${tag(1450, 160, 'जंग: 8 साल', { size: 50, fill: P.amber3, cls: 'tag y8' })}
      ${clip('cp33', 1000, 560, 880, 440, `<rect x="1000" y="560" width="880" height="440" fill="#B49A78"/><g class="tanks">${E.tank(1300, 960, 0.6)}${E.tank(1650, 970, 0.6)}</g>`, 'class="war"')}
      ${tag(1440, 520, 'रासायनिक हथियार भी', { size: 36, fill: P.brick2, color: P.snow, cls: 'tag chem' })}${tag(560, 980, 'आख़िर में: लगभग वहीं के वहीं', { size: 38, fill: P.paper, cls: 'tag same' })}`, over: yr('1980–1988', 'ईरान–इराक़ युद्ध') };
  },

  s34(A) {
    year(A);
    A.pop('.sanc', A.cue('पाबंदियाँ'));
    A.pop('.deal', A.cue('समझौता'));
    A.draw('.deal .xmark path', A.cue('बाहर'), 0.5);
    A.fadeIn('.wlf', A.cue('महसा') - 0.3, 0.8, 0);
    A.loop('.wlf .pp', { y: 0 }, { y: -10 }, 0.4, A.cue('महसा'));
    A.pop('.slogan', A.cue('औरत'));
    return { svg: `${L.sky()}<rect x="-200" y="900" width="2320" height="400" fill="#9A8A72" ${S}/>${L.stamp(500, 260, 'पाबंदियाँ', { size: 70, cls: 'stamp sanc' })}
      ${g('deal', `${tag(1350, 220, '2015: परमाणु समझौता', { size: 40, fill: P.snow })}${tag(1350, 320, '2018: अमेरिका बाहर', { size: 40, fill: P.paper })}${L.cross(1350, 220, 50)}`)}
      ${g('wlf', R.protest(200, 1720, 1040, 16, 0.65))}${big(960, 600, 'औरत · ज़िंदगी · आज़ादी', { size: 84, color: P.amber3, cls: 'slogan' })}`, over: yr('2015–2022', '') };
  },

  s35(A) {
    const m = mp(VME);
    year(A);
    A.pop('.d25', A.cue('बारह दिन'));
    arrowIn(A, '.a1', A.cue('बमबारी') - 0.5, 1.2);
    A.pop('.fd', A.cue('परमाणु ठिकानों'));
    A.pop('.d26', A.cue('फ़रवरी'));
    A.loop('.missile', { x: 0, y: 0 }, { x: 24, y: -14 }, 1.1, A.cue('फ़रवरी'));
    A.pop('.kh', A.cue('अली ख़ामेनेई'));
    A.pop('.mj', A.cue('मोजतबा'));
    A.pop('.on', A.cue('ख़त्म नहीं'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${M.place(m, 'फ़ोर्दो', ...PL.fordow, { cls: 'place fd', color: P.brick, size: 32 })}${M.arrow(m, [38, 26], [50.7, 34.6], { cls: 'arrow a1', color: P.slate, bend: -0.15 })}
      ${R.missile(1500, 820, 0.7)}${tag(560, 160, 'जून 2025: 12 दिन की जंग', { size: 40, fill: P.snow, cls: 'tag d25' })}
      ${tag(1450, 160, 'फ़रवरी 2026: नई जंग', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag d26' })}${tag(1450, 270, 'सर्वोच्च नेता अली ख़ामेनेई मारे गए', { size: 34, fill: P.paper, cls: 'tag kh' })}${tag(1450, 370, 'नए सर्वोच्च नेता: मोजतबा ख़ामेनेई', { size: 34, fill: P.amber3, cls: 'tag mj' })}
      ${tag(960, 1000, 'लड़ाई अब तक पूरी तरह ख़त्म नहीं (नवंबर 2026)', { size: 34, fill: P.snow, cls: 'tag on' })}`, over: yr('2025–2026', '') };
  },

  s36(A) {
    const m = mp(VIN);
    A.pop('.ch', A.cue('चाबहार'));
    A.draw('.route', A.cue('रास्ता') - 0.6, 2);
    A.pop('.af', A.cue('अफ़ग़ानिस्तान'));
    return { svg: `${m.base()}${m.country('Iran', P.amber2)}${m.country('Afghanistan', P.olive2, 'af')}${M.place(m, 'चाबहार', ...PL.chabahar, { cls: 'place ch', color: P.brick, size: 40 })}
      <path class="route" d="M${m.xy(73, 19).join(' ')}Q${m.xy(66, 21).join(' ')} ${xy(m, 'chabahar').join(' ')}Q${m.xy(62, 29).join(' ')} ${xy(m, 'kandahar').join(' ')}" stroke="${P.brick}" stroke-width="9" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      ${tag(1450, 160, 'भारत → चाबहार → अफ़ग़ानिस्तान, मध्य एशिया', { size: 34, fill: P.snow, cls: 'tag af' })}` };
  },

  s37(A) {
    A.pop('.q', 0.2);
    A.pop('.geo', A.cue('जगह')); A.pop('.oil', A.cue('तेल'));
    A.pop('.pow', A.cue('रूस'), 0.4, 0.2);
    A.pop('.chain', A.cue('गुस्सा'));
    return { svg: `${L.sky()}${tag(960, 140, 'पहला सुपरपावर, आज इतना अकेला क्यों?', { size: 52, fill: P.snow, cls: 'tag q' })}
      ${tag(560, 320, 'जगह (होर्मुज़)', { size: 46, fill: P.amber3, cls: 'tag geo' })}${tag(1360, 320, 'तेल', { size: 46, fill: P.amber3, cls: 'tag oil' })}
      ${g('pow', `${tag(500, 500, 'रूस', { size: 42, fill: P.paper })}${tag(960, 500, 'ब्रिटेन', { size: 42, fill: P.paper })}${tag(1420, 500, 'अमेरिका', { size: 42, fill: P.paper })}`)}
      ${g('chain', `${tag(960, 680, 'विदेशी दख़ल → गुस्सा → क्रांति → दुश्मनी', { size: 44, fill: P.brick2, color: P.snow })}`)}` };
  },

  s38(A) {
    A.pop('.army', A.cue('सेना'));
    A.draw('.army .xmark path', A.cue('सेना') + 0.2, 0.4);
    A.pop('.cult', A.cue('संस्कृति'));
    ['भाषा', 'कविता', 'नौरोज़'].forEach((w, i) => A.pop(`.k${i}`, A.cue(w), 0.4));
    A.pop('.inv', A.cue('यूनानी'), 0.4, 0.2);
    A.pop('.became', A.cue('ख़ुद ईरानी'));
    return { svg: `${L.sky('url(#dusk)')}${R.persepolis(1300, 1900, 1000, 'persepolis', { n: 4, ruin: true })}
      ${g('army', `${tag(500, 180, 'सेना', { size: 50 })}${L.cross(500, 180, 60)}`)}${big(500, 360, 'संस्कृति ✓', { size: 96, color: P.amber3, cls: 'cult' })}
      ${['भाषा', 'कविता', 'नौरोज़'].map((w, i) => tag(260 + i * 250, 520, w, { size: 44, fill: P.paper, cls: `tag k${i}` })).join('')}
      ${g('inv', `${tag(300, 700, 'यूनानी', { size: 36, fill: P.snow })}${tag(560, 700, 'अरब', { size: 36, fill: P.snow })}${tag(800, 700, 'मंगोल', { size: 36, fill: P.snow })}`)}
      ${tag(560, 860, 'हर बार जीतने वाले ख़ुद ईरानी बन गए', { size: 40, fill: P.amber3, cls: 'tag became' })}` };
  },

  s39(A) {
    letterbox(A, 0);
    ambientSky(A);
    A.camera({ scale: 1.0 }, { scale: 1.1 });
    A.pop('.ch', A.cue('शह और मात'));
    A.pop('.bz', A.cue('बाज़ार'));
    A.pop('.tt', A.cue('टाटा'));
    A.fadeIn('.ttl', A.cue('अगर आपको') - 0.3, 1, 30);
    A.pop('.sub', A.cue('सब्सक्राइब'));
    A.pop('.cm', A.cue('कमेंट'));
    return { svg: `${L.sky('url(#dusk)')}${L.sun(960, 620, 150)}${L.cloud(300, 220, 1, 'cloud c1')}${L.cloud(1300, 170, 0.8, 'cloud c2')}<rect x="-200" y="900" width="2320" height="400" fill="#B49A78" ${S}/>${R.persepolis(200, 1720, 1060, 'persepolis', { n: 7, ruin: true })}
      ${tag(560, 620, 'शह और मात', { size: 46, fill: P.paper, cls: 'tag ch' })}${tag(960, 620, 'बाज़ार', { size: 46, fill: P.paper, cls: 'tag bz' })}${tag(1360, 620, 'टाटा', { size: 46, fill: P.paper, cls: 'tag tt' })}
      ${big(960, 250, 'Iran · 5000 सालों की कहानी', { size: 90, color: P.snow, cls: 'ttl' })}${tag(640, 430, 'सब्सक्राइब करें', { size: 46, fill: P.brick2, color: P.snow, cls: 'tag sub' })}${tag(1280, 430, 'अगली पूरी हिस्ट्री: कौन सा देश?', { size: 40, fill: P.amber3, cls: 'tag cm' })}`, over: LB };
  },
};

export function sfx(clips) {
  const total = clips.at(-1).start + clips.at(-1).dur;
  const by = Object.fromEntries(clips.map((c) => [c.id, c]));
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(1290, total), vol: 0.17, fadeIn: 2, fadeOut: 5 },
    { id: 'fx_w1', file: 'drums.wav', start: by.s13.start, dur: by.s13.dur, vol: 0.45, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_w2', file: 'drums.wav', start: by.s15.start, dur: by.s15.dur, vol: 0.45, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_w3', file: 'drums.wav', start: by.s24.start, dur: by.s24.dur, vol: 0.5, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_fire', file: 'boom.wav', start: by.s14.start + 6, dur: 5, vol: 0.6 },
    { id: 'fx_war', file: 'boom.wav', start: by.s35.start + 2, dur: 5, vol: 0.6 },
    { id: 'fx_wind', file: 'wind.wav', start: by.s01.start, dur: by.s01.dur, vol: 0.3, fadeIn: 1, fadeOut: 2 },
  ];
}
