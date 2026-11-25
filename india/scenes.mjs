// भारत की पूरी History — scene builders. Maps: coastlines, rivers and places only (no political borders).
import * as L from '../lib/inkamber.mjs';
import * as M from '../lib/maps.mjs';
import * as E from '../lib/epic.mjs';
import * as R from '../lib/persia.mjs';
import * as I from '../lib/india.mjs';
import * as X from '../lib/space.mjs';
import * as BH from '../lib/bharat.mjs';
import { fonts, css, HF, HT, tag, big, txt, yr, LB, TO, C, B, cal, clip, letterbox, year, mapCam, ambientSky, arrowIn, chapterCard } from '../lib/hindi-film.mjs';
const { P, g, S, Sthin, shadow } = L;
export { fonts, css };
export const defs = X.spaceDefs;
export const title = 'भारत की पूरी History';

const VI = { center: [80, 23], scale: 1350 }, VS = { center: [80, 22], scale: 1000 }, VA = { center: [88, 17], scale: 560 }, VWD = { center: [55, 25], scale: 300 }, VN = { center: [79, 27], scale: 2100 };
const PL = { harappa: [72.86, 30.63], mohenjo: [68.14, 27.33], dholavira: [70.21, 23.89], lothal: [72.25, 22.52], pataliputra: [85.14, 25.6], bodhgaya: [84.99, 24.7], kalinga: [85.84, 20.19], nalanda: [85.44, 25.14], ujjain: [75.78, 23.18], thanjavur: [79.13, 10.79], hampi: [76.46, 15.33], delhi: [77.21, 28.61], agra: [78.0, 27.18], panipat: [76.97, 29.39], somnath: [70.4, 20.89], ghazni: [68.42, 33.55], calicut: [75.78, 11.25], plassey: [88.27, 23.8], kolkata: [88.36, 22.57], meerut: [77.7, 28.98], jhansi: [78.57, 25.45], lucknow: [80.95, 26.85], kanpur: [80.33, 26.45], champaran: [84.92, 26.65], dandi: [72.8, 20.9], mumbai: [72.88, 19.08], bengaluru: [77.59, 12.97], hyderabad: [78.49, 17.39], raigad: [73.44, 18.23], lahore: [74.35, 31.55], pokhran: [71.9, 26.92], palembang: [104.75, -2.98], angkor: [103.87, 13.41], rome: [12.5, 41.9], lisbon: [-9.14, 38.72], tarain: [76.8, 29.95], sarnath: [83.02, 25.38], lumbini: [83.28, 27.48], vaishali: [85.13, 25.99] };
const EMP = {
  maurya: [[66, 35], [73, 35.5], [80, 30], [88, 27], [92, 24], [86, 20], [80, 14], [76, 13], [73, 18], [70, 22], [66, 25], [62, 30]],
  gupta: [[72, 30], [80, 30], [88, 27], [90, 24], [86, 21], [80, 20], [75, 22], [70, 24]],
  chola: [[76, 8], [80, 8], [81, 13], [81, 17], [77, 15], [76, 11]],
  sultanate: [[70, 31], [76, 31], [84, 27], [88, 25], [86, 22], [80, 22], [74, 22], [70, 25]],
  vijay: [[73, 16], [79, 17], [81, 14], [80, 9], [77, 8], [74, 12]],
  mughal: [[66, 35], [73, 36], [78, 32], [88, 28], [93, 25], [88, 21], [80, 14], [77, 12], [73, 16], [69, 22], [66, 26]],
  maratha: [[70, 22], [74, 30], [80, 29], [86, 23], [85, 19], [80, 15], [74, 15]],
  british: [[67, 25], [71, 34], [75, 36], [80, 31], [88, 28], [97, 27], [94, 20], [86, 20], [80, 8], [76, 8], [72, 19]],
};
const mc = {}; const mp = (v) => mc[JSON.stringify(v)] ||= M.makeMap(v);
const pl = (m, n, k, o) => M.place(m, n, ...PL[k], o);
const xy = (m, k) => m.xy(...PL[k]);

export const chapters = {
  s04: [1, 'सिंधु के शहर'], s08: [2, 'बुद्ध से अशोक'], s12: [3, 'स्वर्ण युग'], s15: [4, 'सल्तनत और साम्राज्य'],
  s20: [5, 'कंपनी राज'], s25: [6, 'आज़ादी'], s29: [7, 'नया भारत'], s34: [8, 'जवाब'],
};
export const chapterSvg = (n, t) => chapterCard(n, t, '#3A2414');

const coinPile = (x, base, n, cls = 'coins') => g(cls, Array.from({ length: n }, (_, i) => `<ellipse cx="${x + (i % 4) * 40 - 60}" cy="${base - Math.floor(i / 4) * 18}" rx="34" ry="12" fill="${P.amber3}" stroke="${P.ink}" stroke-width="2.5"/>`).join(''), shadow);

export const scenes = {
  s01(A) {
    const m = mp(VWD);
    letterbox(A, 0);
    A.fadeIn('.glow', 0.3, 1, 0);
    A.tween('.pie', 0.6, 2, { scale: 0, ...C }, { scale: 1, ...C }, 'back.out(1.4)');
    A.pop('.p25', A.cue('चौथाई'));
    A.pop('.goods .g', A.cue('कपड़े'), 0.4, 0.3);
    mapCam(A, 1.0, 1.1, -60);
    const [ix, iy] = m.xy(78, 22);
    return { svg: `${m.base()}<circle class="glow" cx="${ix}" cy="${iy}" r="220" fill="url(#glow)"/>${M.regionLabel(m, 'भारत', 79, 23, { size: 56, color: P.brick })}
      ${g('pie', `<circle cx="1560" cy="380" r="200" fill="${P.paper2}" ${S}/><path d="M1560 380V180A200 200 0 0 1 1760 380z" fill="${P.amber2}" ${S}/>${txt(1660, 300, '~25%', { size: 54 })}`, shadow)}${tag(1560, 640, '1700: दुनिया की दौलत का ~¼', { size: 40, fill: P.amber3, cls: 'tag p25' })}
      ${g('goods', `${g('g', tag(760, 900, 'कपड़े', { size: 40, fill: P.snow }))}${g('g', tag(1020, 900, 'मसाले', { size: 40, fill: P.snow }))}${g('g', tag(1280, 900, 'हीरे', { size: 40, fill: P.snow }))}`)}`, over: `${LB}${yr('~1700', '')}` };
  },

  s02(A) {
    A.tween('.bar1', 0.4, 1.2, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power2.out');
    A.tween('.bar2', A.cue('उन्नीस सौ सैंतालीस'), 1.4, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power2.out');
    A.pop('.l2', A.cue('चार प्रतिशत'));
    A.pop('.poor', A.cue('गरीबी'));
    A.pop('.break', A.cue('टूट जाएगा'));
    return { svg: `${L.sky()}${L.ground(900)}<rect class="bar1" x="420" y="300" width="260" height="600" fill="${P.amber2}" ${S}/>${txt(550, 970, '1700: ~25%', { size: 44 })}
      <rect class="bar2" x="1000" y="805" width="260" height="95" fill="${P.brick}" ${S}/>${txt(1130, 970, '1947: ~4%', { size: 44, cls: 'l2' })}
      ${tag(1550, 300, 'करोड़ों लोग गरीबी में', { size: 40, fill: P.snow, cls: 'tag poor' })}${tag(1550, 430, '"ये देश टूट जाएगा"', { size: 42, fill: P.brick2, color: P.snow, cls: 'tag break' })}` };
  },

  s03(A) {
    A.pop('.now1', A.cue('अर्थव्यवस्थाओं')); A.pop('.now2', A.cue('आबादी'));
    A.fadeOut('.now1, .now2', A.cue('तो सवाल') - 0.3, 0.4);
    A.pop('.q1', A.cue('जो देश'), 0.7); A.pop('.q2', A.cue('सैकड़ों'), 0.7);
    A.fadeIn('.go', A.cue('चलिए'), 0.8, 20);
    A.loop('.cloth', { skewY: 0 }, { skewY: 3 }, 0.9);
    return { svg: `${L.sky('url(#dusk)')}${BH.tricolor(1500, 300, 300)}
      ${tag(700, 300, 'आज: दुनिया की सबसे बड़ी अर्थव्यवस्थाओं में', { size: 40, fill: P.amber3, cls: 'tag now1' })}${tag(700, 430, 'सबसे ज़्यादा आबादी वाला देश', { size: 40, fill: P.snow, cls: 'tag now2' })}
      ${tag(700, 300, 'इतना अमीर देश, गरीब कैसे हुआ?', { size: 52, fill: P.snow, cls: 'tag q1' })}${tag(700, 450, 'इतनी विविधता… फिर भी एक कैसे?', { size: 50, fill: P.amber3, cls: 'tag q2' })}
      ${big(700, 640, 'चलिए, शुरुआत से…', { size: 76, color: P.amber3, cls: 'go' })}` };
  },

  s04(A) {
    const m = mp(VS);
    A.pop('.mtns', A.cue('हिमालय'), 0.8);
    A.pop('.him', A.cue('हिमालय'));
    A.pop('.sea', A.cue('समुद्र'), 0.5, 0.2);
    A.draw('.rv', A.cue('सिंधु'), 2, );
    A.pop('.rl', A.cue('सिंधु'), 0.4, 0.3);
    A.draw('.mon', A.cue('मानसून'), 2);
    A.pop('.chain', A.cue('ज़्यादा खाना'));
    mapCam(A, 1.0, 1.08, 30);
    const him = [[73, 35.8], [76, 33.6], [79, 31.5], [82, 29.6], [85, 28.2], [88, 27.8], [91, 27.8], [94, 28.6]];
    return { svg: `${m.base()}${M.mountains(m, him, { size: 26 })}${BH.rivers(m)}
      ${M.regionLabel(m, 'हिमालय', 84, 31.5, { cls: 'rlabel him', size: 48, color: P.brick })}${g('sea', M.regionLabel(m, 'अरब सागर', 64, 16, { size: 40, color: P.slate }))}${g('sea', M.regionLabel(m, 'बंगाल की खाड़ी', 89, 15, { size: 40, color: P.slate }))}${g('sea', M.regionLabel(m, 'हिंद महासागर', 80, 3, { size: 40, color: P.slate }))}
      ${g('rl', M.regionLabel(m, 'सिंधु', 69.5, 28.5, { size: 32, color: '#3E6E86' }))}${g('rl', M.regionLabel(m, 'गंगा', 82, 24.6, { size: 32, color: '#3E6E86' }))}${g('rl', M.regionLabel(m, 'ब्रह्मपुत्र', 93, 30.2, { size: 32, color: '#3E6E86' }))}
      <path class="mon" d="M${m.xy(62, 8).join(' ')}Q${m.xy(70, 14).join(' ')} ${m.xy(76, 20).join(' ')}" stroke="${P.slate}" stroke-width="10" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      ${tag(1500, 980, 'खाना → लोग → ताकत', { size: 40, fill: P.amber3, cls: 'tag chain' })}` };
  },

  s05(A) {
    const m = mp(VI);
    year(A);
    ['harappa', 'mohenjo', 'dholavira', 'lothal'].forEach((k, i) => A.pop(`.c${i}`, A.cue(['हड़प्पा', 'मोहनजोदड़ो', 'धोलावीरा', 'लोथल'][i]), 0.4));
    A.fadeIn('.city', A.cue('सीधी सड़कें') - 0.3, 0.8, 0);
    A.draw('.drain', A.cue('नालियाँ'), 1.5);
    A.pop('.rare', A.cue('बहुत कम'));
    return { svg: `${m.base()}${BH.rivers(m, ['indus'])}${pl(m, 'हड़प्पा', 'harappa', { cls: 'place c0' })}${pl(m, 'मोहनजोदड़ो', 'mohenjo', { cls: 'place c1' })}${pl(m, 'धोलावीरा', 'dholavira', { cls: 'place c2' })}${pl(m, 'लोथल', 'lothal', { cls: 'place c3' })}
      ${clip('cp5', 860, 300, 1020, 640, `<rect x="860" y="300" width="1020" height="640" fill="#E6D2AE"/><g transform="translate(860 300) scale(0.86)">${BH.harappa(80, 120)}</g>`, 'class="city"')}
      ${tag(1370, 250, 'नियोजित शहर · ढकी नालियाँ', { size: 40, fill: P.amber3 })}${tag(1370, 990, 'उस समय दुनिया में बहुत कम ऐसे शहर', { size: 34, fill: P.snow, cls: 'tag rare' })}`, over: yr('~2600', 'ईसा पूर्व') };
  },

  s06(A) {
    A.fadeIn('.bath', 0.3, 0.8, 0);
    A.loop('.ripple', { x: 0 }, { x: -30 }, 1.6);
    A.pop('.seal', A.cue('मुहरें'));
    A.pop('.q', A.cue('कोई नहीं'));
    A.tween('.dry', A.cue('वीरान'), 3, { opacity: 0 }, { opacity: 0.55 }, 'none');
    A.pop('.why', A.cue('शायद'));
    return { svg: `${L.sky()}${L.ground(900)}${BH.greatBath(560, 640)}${BH.seal(1400, 520, 1.3)}
      ${tag(560, 380, 'मोहनजोदड़ो का विशाल स्नानागार', { size: 36, fill: P.snow })}${tag(1400, 240, 'लिपि: आज तक अनपढ़ी', { size: 40, fill: P.amber3, cls: 'tag q' })}
      <rect class="dry" x="-200" y="-200" width="2320" height="1480" fill="#C9AE84"/>${tag(960, 980, 'शायद नदियाँ और जलवायु बदलीं', { size: 40, fill: P.snow, cls: 'tag why' })}` };
  },

  s07(A) {
    year(A);
    A.pop('.rv', A.cue('ऋग्वेद'));
    A.pop('.oral', A.cue('मुँह ज़बानी'));
    A.loop('.oral .person', { y: 0 }, { y: -4 }, 0.8, A.cue('मुँह ज़बानी'));
    A.pop('.mj', A.cue('महाजनपद'));
    return { svg: `${L.sky('url(#dusk)')}${L.ground(900)}${R.book(520, 560, 'ऋग्वेद', 1.1, 'book rv')}
      ${g('oral', `${[0, 1, 2, 3].map((i) => L.person(1060 + i * 170, 990, 1.1 - i * 0.1, { pose: 'sit', coat: [P.amber2, P.snow, P.amber3, P.paper2][i], hat: 'none', skin: I.SKIN[i % 5] })).join('')}${tag(1310, 600, 'पीढ़ी दर पीढ़ी, मुँह ज़बानी', { size: 38, fill: P.snow })}`)}
      ${tag(1310, 200, '16 महाजनपद', { size: 52, fill: P.amber3, cls: 'tag mj' })}`, over: yr('~1500–500', 'ईसा पूर्व') };
  },

  s08(A) {
    const m = mp(VA);
    year(A);
    A.slideIn('.bud', A.cue('गौतम बुद्ध'), 0.9, -300);
    A.pop('.mah', A.cue('महावीर'));
    A.pop('.ahimsa', A.cue('अहिंसा'));
    ['चीन', 'जापान', 'श्रीलंका', 'दक्षिण पूर्व'].forEach((w, i) => { A.draw(`.s${i} .shaft`, A.cue(w) - 0.2, 0.9); A.pop(`.s${i} .head`, A.cue(w) + 0.6, 0.3); });
    const dest = [[105, 35], [138, 36], [80.8, 7.5], [103, 14]];
    return { svg: `${m.base()}${pl(m, 'बोधगया', 'bodhgaya', { color: P.brick })}${dest.map((d, i) => M.arrow(m, PL.bodhgaya, d, { cls: `arrow s${i}`, color: P.amber, bend: 0.12, w: 9 })).join('')}
      ${M.regionLabel(m, 'चीन', 105, 37, { size: 38 })}${M.regionLabel(m, 'जापान', 138, 39, { size: 34 })}
      ${g('bud', `${I.gandhi ? '' : ''}${E.gandharaBuddha(330, 1000, 1)}`)}${tag(330, 620, 'गौतम बुद्ध', { size: 40, fill: P.snow, cls: 'tag bud' })}${tag(330, 520, 'महावीर', { size: 36, fill: P.paper, cls: 'tag mah' })}
      ${tag(1500, 160, 'अहिंसा · करुणा', { size: 50, fill: P.amber3, cls: 'tag ahimsa' })}`, over: yr('~500', 'ईसा पूर्व') };
  },

  s09(A) {
    const m = mp(VS);
    year(A);
    A.pop('.mg', A.cue('मगध'));
    A.tween('.blob', A.cue('एक कर दिया') - 1.5, 2.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.cg', A.cue('चंद्रगुप्त')); A.pop('.ch', A.cue('चाणक्य'));
    A.pop('.book', A.cue('अर्थशास्त्र'));
    return { svg: `${m.base()}${M.blob(m, EMP.maurya, { fill: P.olive, op: 0.35 })}${BH.rivers(m, ['indus', 'ganga'])}${M.place(m, 'पाटलिपुत्र (मगध)', ...PL.pataliputra, { cls: 'place mg', color: P.brick, size: 34 })}${M.regionLabel(m, 'मौर्य साम्राज्य', 77, 21, { size: 48 })}
      ${tag(420, 160, 'चंद्रगुप्त मौर्य', { size: 46, fill: P.snow, cls: 'tag cg' })}${tag(420, 270, 'गुरु: चाणक्य', { size: 40, fill: P.amber3, cls: 'tag ch' })}${R.book(1600, 700, 'अर्थशास्त्र', 0.75)}`, over: yr('~321', 'ईसा पूर्व') };
  },

  s10(A) {
    year(A);
    letterbox(A, 0);
    A.fadeIn('.war', 0.2, 0.6, 0);
    A.loop('.war .rider', { y: 0 }, { y: -8 }, 0.3);
    A.tween('.war', A.cue('दिल बदल') - 0.3, 1.2, { opacity: 1 }, { opacity: 0 }, 'none');
    A.fadeIn('.peace', A.cue('दिल बदल'), 1, 0);
    A.pop('.lions', A.cue('सिंह स्तंभ'));
    A.pop('.chakra', A.cue('अशोक चक्र'));
    A.loop('.chakra', { rotation: 0, ...C }, { rotation: 360, ...C }, 8, A.cue('अशोक चक्र'), 'none');
    return { svg: `${g('war', `${L.sky('#B0644A')}${E.peaks(800, 301, { h: 220, fill: '#7A4A36' })}<rect x="-200" y="880" width="2320" height="400" fill="#6E3E2E"/>${E.cavalry(60, 1000, 7, 0.6, { gear: 'turban', coat: P.brick, weapon: 'spear', gallop: true })}${tag(960, 260, 'कलिंग: लाखों की मौत', { size: 50, fill: P.snow })}`)}
      ${g('peace', `${L.sky('url(#skyg)')}<rect x="-200" y="900" width="2320" height="400" fill="#C9B48E" ${S}/>${BH.lionCapital(560, 960, 1.3)}${BH.chakra(1400, 520, 220, 'chakra')}${tag(560, 220, 'राष्ट्रीय चिह्न', { size: 40, fill: P.snow })}${tag(1400, 900, 'तिरंगे में अशोक चक्र', { size: 40, fill: P.amber3 })}`)}`, over: `${LB}${yr('~261', 'ईसा पूर्व · कलिंग')}` };
  },

  s11(A) {
    const m = mp(VWD);
    A.draw('.a1 .shaft', 0.6, 2); A.pop('.a1 .head', 2.5, 0.3);
    A.pop('.goods .g', A.cue('मसाले'), 0.4, 0.25);
    A.pop('.pliny', A.cue('प्लिनी'));
    A.drift('.coins', A.cue('सोना'), 3, { x: -500, opacity: 0 }, { x: 0, opacity: 1 }, 'power2.out');
    return { svg: `${m.base()}${pl(m, 'रोम', 'rome')}${M.regionLabel(m, 'भारत', 79, 21, { size: 44, color: P.brick })}${M.arrow(m, [75, 15], PL.rome, { cls: 'arrow a1', color: P.amber, bend: -0.2 })}
      ${g('goods', `${g('g', tag(380, 880, 'मसाले', { size: 38, fill: P.snow }))}${g('g', tag(620, 880, 'मोती', { size: 38, fill: P.snow }))}${g('g', tag(860, 880, 'कपड़े', { size: 38, fill: P.snow }))}`)}
      ${tag(1450, 160, 'प्लिनी: "रोम का सोना भारत जा रहा है"', { size: 34, fill: P.amber3, cls: 'tag pliny' })}${coinPile(1500, 900, 16)}` };
  },

  s12(A) {
    const m = mp(VS);
    year(A);
    A.tween('.blob', 0.3, 1.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.ab', A.cue('आर्यभट'));
    A.loop('.earthO', { rotation: 0, ...C }, { rotation: 360, ...C }, 4, A.cue('घूमती'), 'none');
    A.pop('.zero', A.cue('शून्य'));
    A.draw('.zr .shaft', A.cue('अरबों'), 1.4); A.pop('.zr .head', A.cue('अरबों') + 1.3, 0.3);
    A.pop('.kd', A.cue('कालिदास'));
    return { svg: `${m.base()}${M.blob(m, EMP.gupta, { fill: P.amber, op: 0.3 })}${M.regionLabel(m, 'गुप्त साम्राज्य', 81, 26, { size: 40 })}${M.arrow(m, [77, 24], [45, 30], { cls: 'arrow zr', color: P.slate, bend: -0.15 })}
      ${g('ab', `<rect x="1180" y="160" width="640" height="300" fill="${P.paper}" ${S}/><g class="earthO">${X.earth(1320, 310, 90)}</g>${txt(1600, 300, 'आर्यभट:', { size: 40 })}${txt(1600, 350, 'पृथ्वी घूमती है', { size: 34 })}`, shadow)}
      ${big(1500, 680, '0  1  2  3 … 9', { size: 96, color: P.amber, cls: 'zero' })}${tag(1500, 800, 'शून्य + दशमलव: पूरी दुनिया की गिनती', { size: 34, fill: P.snow, cls: 'tag zero' })}${tag(1500, 930, 'कालिदास', { size: 40, fill: P.paper, cls: 'tag kd' })}`, over: yr('~320–550', 'ईसवी · स्वर्ण युग') };
  },

  s13(A) {
    year(A);
    A.fadeIn('.nal', 0.3, 0.8, 0);
    A.pop('.std .person', A.cue('हज़ारों'), 0.3, 0.05);
    A.pop('.from', A.cue('चीन'));
    A.pop('.hs', A.cue('ह्वेनसांग'));
    A.pop('.old', A.cue('पुराने'));
    let cells = ''; for (let i = 0; i < 8; i++) cells += `<rect x="${200 + i * 200}" y="460" width="140" height="300" fill="#C47E52" ${S}/><rect x="${200 + i * 200}" y="460" width="140" height="300" fill="url(#bricks)"/><path d="M${235 + i * 200} 760v-120a35 35 0 0 1 70 0v120z" fill="${P.ink2}"/>`;
    let std = ''; for (let i = 0; i < 10; i++) std += L.person(180 + i * 170, 1010, 0.8, { coat: [P.amber2, P.amber3, P.brick2][i % 3], hat: 'none', skin: I.SKIN[i % 5] });
    return { svg: `${L.sky()}<rect x="-200" y="880" width="2320" height="400" fill="#C9AE84" ${S}/>${g('nal', cells, shadow)}<g class="std">${std}</g>
      ${tag(560, 220, 'नालंदा विश्वविद्यालय', { size: 50, fill: P.amber3 })}${tag(1400, 220, 'चीन · कोरिया · तिब्बत से छात्र', { size: 38, fill: P.snow, cls: 'tag from' })}${tag(1400, 340, 'ह्वेनसांग ने यहाँ पढ़ाई की', { size: 36, fill: P.paper, cls: 'tag hs' })}`, over: yr('~427', 'ईसवी · नालंदा') };
  },

  s14(A) {
    const m = mp(VA);
    year(A);
    A.tween('.blob', 0.3, 1.2, { opacity: 0 }, { opacity: 1 }, 'none');
    arrowIn(A, '.a1', A.cue('समुद्र पार'), 1.6);
    A.drift('.fleet', A.cue('समुद्र पार'), 3, { x: -200 }, { x: 0 }, 'power1.out');
    A.pop('.temple', A.cue('बृहदेश्वर'));
    A.pop('.angkor', A.cue('अंकोरवाट'));
    return { svg: `${m.base()}${M.blob(m, EMP.chola, { fill: P.brick, op: 0.4 })}${M.regionLabel(m, 'चोल', 79, 12, { size: 36 })}${M.arrow(m, [81, 11], PL.palembang, { cls: 'arrow a1', color: P.brick, bend: 0.15 })}${pl(m, 'अंकोर', 'angkor')}
      <g class="fleet">${R.dhow(m.xy(92, 6)[0], m.xy(92, 6)[1], 0.3)}${R.dhow(m.xy(95, 3)[0], m.xy(95, 3)[1], 0.25)}</g>
      ${clip('cp14a', 80, 300, 560, 640, `${L.sky('url(#dusk)')}<rect x="80" y="880" width="560" height="100" fill="#C9AE84"/>${BH.gopuram(360, 900, 0.75)}`, 'class="temple"')}${tag(360, 250, 'बृहदेश्वर मंदिर, तंजावुर', { size: 32, fill: P.snow, cls: 'tag temple' })}
      ${clip('cp14b', 1280, 600, 600, 380, `${L.sky('url(#dusk)')}${BH.angkor(1580, 930, 0.6)}`, 'class="angkor"')}${tag(1580, 560, 'अंकोरवाट, कंबोडिया', { size: 32, fill: P.amber3, cls: 'tag angkor' })}`, over: yr('~1010–1025', 'ईसवी · चोल') };
  },

  s15(A) {
    const m = mp(VS);
    year(A);
    arrowIn(A, '.a1', A.cue('ग़ज़नवी'), 1.3);
    A.pop('.sm', A.cue('सोमनाथ'));
    arrowIn(A, '.a2', A.cue('ग़ोरी'), 1.3);
    A.pop('.pc', A.cue('पृथ्वीराज'));
    A.tween('.blob', A.cue('सल्तनत'), 1.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.nl', A.cue('नालंदा'));
    return { svg: `${m.base()}${M.blob(m, EMP.sultanate, { fill: P.mol3, op: 0.3 })}${pl(m, 'ग़ज़नी', 'ghazni')}${M.arrow(m, PL.ghazni, PL.somnath, { cls: 'arrow a1', bend: -0.15 })}${M.arrow(m, [64.5, 34.4], PL.tarain, { cls: 'arrow a2', color: P.mol3, bend: 0.15 })}
      ${pl(m, 'सोमनाथ', 'somnath', { cls: 'place sm', color: P.brick })}${pl(m, 'तराइन', 'tarain', { cls: 'place pc' })}${M.regionLabel(m, 'दिल्ली सल्तनत', 80, 25.5, { size: 38 })}${M.place(m, 'नालंदा', ...PL.nalanda, { cls: 'place nl', color: P.brick })}
      ${tag(1500, 160, '1192: पृथ्वीराज चौहान की हार', { size: 38, fill: P.snow, cls: 'tag pc' })}${tag(1500, 270, '1206: दिल्ली सल्तनत', { size: 40, fill: P.amber3 })}`, over: yr('1000–1206', 'ईसवी') };
  },

  s16(A) {
    const m = mp(VS);
    year(A);
    A.tween('.blob', 0.4, 1.4, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.hm', A.cue('हम्पी'));
    A.fadeIn('.bazaar', A.cue('बाज़ारों') - 0.3, 0.8, 0);
    A.pop('.gems circle', A.cue('हीरे'), 0.3, 0.05);
    return { svg: `${m.base()}${M.blob(m, EMP.vijay, { fill: P.amber2, op: 0.4 })}${M.regionLabel(m, 'विजयनगर', 77, 13.5, { size: 38 })}${M.place(m, 'हम्पी', ...PL.hampi, { cls: 'place hm', color: P.brick, size: 38 })}
      ${clip('cp16', 1080, 200, 800, 760, `${L.sky('url(#dusk)')}<rect x="1080" y="760" width="800" height="200" fill="#C9AE84"/>${BH.gopuram(1300, 780, 0.55)}${BH.gopuram(1660, 780, 0.45)}<g class="gems">${Array.from({ length: 24 }, (_, i) => `<circle cx="${1140 + (i % 12) * 60}" cy="${850 + Math.floor(i / 12) * 50}" r="16" fill="${['#E6F2F4', P.snow, '#BFE0EE'][i % 3]}" stroke="${P.ink}" stroke-width="2"/>`).join('')}</g>`, 'class="bazaar"')}
      ${tag(1480, 150, '"हीरे-मोती अनाज की तरह बिकते थे"', { size: 34, fill: P.amber3 })}`, over: yr('1336–1565', 'विजयनगर') };
  },

  s17(A) {
    const m = mp(VS);
    year(A);
    A.pop('.pn', A.cue('पानीपत'));
    A.pop('.ak', A.cue('अकबर'));
    A.fadeIn('.taj', A.cue('ताजमहल') - 0.3, 0.8, 0);
    A.tween('.blob', A.cue('औरंगज़ेब'), 1.6, { opacity: 0 }, { opacity: 1 }, 'none');
    return { svg: `${m.base()}${M.blob(m, EMP.mughal, { fill: P.olive, op: 0.35 })}${M.regionLabel(m, 'मुग़ल साम्राज्य', 79, 20, { size: 44 })}${pl(m, 'पानीपत', 'panipat', { cls: 'place pn' })}${pl(m, 'आगरा', 'agra')}
      ${tag(420, 160, 'अकबर: सबको साथ लेकर', { size: 40, fill: P.snow, cls: 'tag ak' })}
      ${clip('cp17', 1160, 260, 720, 560, `${L.sky('url(#dusk)')}${BH.taj(1520, 760, 0.6)}`, 'class="taj"')}${tag(1520, 860, 'ताजमहल', { size: 42, fill: P.amber3, cls: 'tag taj' })}`, over: yr('1526–1707', 'मुग़ल') };
  },

  s18(A) {
    A.pop('.mad', A.cue('मैडिसन'));
    A.tween('.wedge', A.cue('चौथाई'), 1.4, { scale: 0, ...C }, { scale: 1, ...C }, 'back.out(1.4)');
    A.fadeIn('.muslin', A.cue('मलमल') - 0.3, 0.8, 0);
    A.drift('.cloth2', A.cue('अँगूठी'), 2.5, { x: -200, scaleY: 1 }, { x: 160, scaleY: 0.2 }, 'power2.in');
    return { svg: `${L.sky()}${L.ground(900)}<g class="wedge"><circle cx="520" cy="520" r="250" fill="${P.paper2}" ${S}/><path d="M520 520V270A250 250 0 0 1 770 520z" fill="${P.amber2}" ${S}/>${txt(640, 420, '~¼', { size: 70 })}</g>
      ${tag(520, 860, 'एंगस मैडिसन का अनुमान (1700)', { size: 34, fill: P.snow, cls: 'tag mad' })}
      ${g('muslin', `<rect x="1100" y="380" width="760" height="420" fill="${P.paper}" ${S}/><path class="cloth2" d="M1160 520q100 -60 200 0t200 0" stroke="${P.snow}" stroke-width="80" fill="none" opacity="0.9"/><circle cx="1680" cy="520" r="50" fill="none" stroke="${P.amber}" stroke-width="12"/>${txt(1480, 740, 'बंगाल का मलमल: अँगूठी से निकल जाए', { size: 32 })}`, shadow)}` };
  },

  s19(A) {
    const m = mp(VS);
    year(A);
    A.pop('.sv', A.cue('शिवाजी'));
    A.fadeIn('.fort', A.cue('किलों') - 0.3, 0.8, 0);
    A.tween('.blob', A.cue('मराठे'), 1.5, { opacity: 0 }, { opacity: 1 }, 'none');
    A.pop('.rs', A.cue('रणजीत सिंह'));
    return { svg: `${m.base()}${M.blob(m, EMP.maratha, { fill: P.amber2, op: 0.35 })}${M.regionLabel(m, 'मराठा', 78, 22, { size: 44 })}${M.place(m, 'रायगढ़', ...PL.raigad, { cls: 'place sv', color: P.brick, size: 34 })}${M.place(m, 'लाहौर', ...PL.lahore, { cls: 'place rs', size: 32 })}
      ${tag(420, 160, 'छत्रपति शिवाजी महाराज', { size: 42, fill: P.snow, cls: 'tag sv' })}${tag(1500, 160, 'महाराजा रणजीत सिंह (पंजाब)', { size: 36, fill: P.amber3, cls: 'tag rs' })}
      ${clip('cp19', 1160, 560, 720, 420, `${L.sky('url(#dusk)')}${E.peaks(980, 401, { h: 260 })}${E.fortWall(1220, 1860, 900, 120, 'fort', '#9A8A72')}`, 'class="fort"')}`, over: yr('1674', 'राज्याभिषेक') };
  },

  s20(A) {
    const m = mp(VWD);
    year(A);
    arrowIn(A, '.a1', A.cue('वास्को'), 2);
    A.pop('.cl', A.cue('कालीकट'));
    A.pop('.others', A.cue('डच'));
    A.pop('.eic', A.cue('ईस्ट इंडिया'));
    A.loop('.eicship', { rotation: -2, ...B }, { rotation: 2, ...B }, 1.5, A.cue('ईस्ट इंडिया'));
    return { svg: `${m.base()}${pl(m, 'लिस्बन', 'lisbon')}${pl(m, 'कालीकट', 'calicut', { cls: 'place cl', color: P.brick })}${M.arrow(m, PL.lisbon, PL.calicut, { cls: 'arrow a1', color: P.slate, bend: 0.45 })}
      ${tag(560, 160, 'वास्को डी गामा · 1498', { size: 42, fill: P.snow })}${tag(560, 270, 'फिर: डच · फ्रांसीसी · अंग्रेज़', { size: 36, fill: P.paper, cls: 'tag others' })}
      <g class="eicship">${L.ship(1560, 900, 0.75, { sail: true, hull: P.mol3, stripe: P.amber3 })}</g>${tag(1560, 300, 'ईस्ट इंडिया कंपनी · 1600', { size: 40, fill: P.amber3, cls: 'tag eic' })}`, over: yr('1498–1600', '') };
  },

  s21(A) {
    const m = mp(VN);
    year(A);
    letterbox(A, 0);
    A.pop('.pl', A.cue('प्लासी'));
    A.fadeIn('.battle', A.cue('नवाब') - 0.3, 0.6, 0);
    A.pop('.mj', A.cue('मीर जाफ़र'));
    A.drift('.mj2', A.cue('अपनी तरफ़'), 1.5, { x: 0 }, { x: 520 }, 'power2.inOut');
    return { svg: `${m.base()}${BH.rivers(m, ['ganga'])}${M.place(m, 'प्लासी', ...PL.plassey, { cls: 'place pl', color: P.brick, size: 40 })}
      ${clip('cp21', 160, 480, 1600, 480, `${L.sky('url(#dusk)')}<rect x="160" y="880" width="1600" height="100" fill="#8A9A5A"/>${[0, 1, 2].map((i) => E.figure(420 + i * 120, 960, 0.9, { gear: 'turban', hatColor: P.amber3, coat: P.olive, weapon: 'spear' })).join('')}<g class="mj2">${E.figure(800, 960, 1, { gear: 'turban', hatColor: P.snow, coat: P.mol3, cls: 'fig mj' })}</g>${[0, 1, 2].map((i) => E.figure(1360 + i * 120, 960, 0.9, { gear: 'shako', coat: P.brick, weapon: 'rifle', skin: '#E2B48C' })).join('')}`, 'class="battle"')}
      ${tag(960, 420, 'जीत लड़ाई से कम, धोखे से ज़्यादा', { size: 40, fill: P.amber3, cls: 'tag mj' })}`, over: `${LB}${yr('1757', 'प्लासी')}` };
  },

  s22(A) {
    const m = mp(VS);
    year(A);
    A.tween('.blob', 0.4, 3, { opacity: 0, scale: 0.3, ...TO('85% 35%') }, { opacity: 1, scale: 1, ...TO('85% 35%') }, 'power1.inOut');
    A.pop('.tax', A.cue('टैक्स'));
    A.pop('.buy', A.cue('ख़रीदती'));
    A.pop('.sell', A.cue('बेचती'));
    A.drift('.coins', A.cue('बाहर'), 3, { x: 0, opacity: 1 }, { x: 700, opacity: 0 }, 'power1.in');
    return { svg: `${m.base()}${M.blob(m, EMP.british, { fill: P.brick, op: 0.3 })}${M.regionLabel(m, 'कंपनी राज', 79, 21, { size: 44, color: P.brick })}
      ${tag(1520, 300, '1. भारत से टैक्स', { size: 40, fill: P.paper, cls: 'tag tax' })}${tag(1520, 420, '2. उसी पैसे से भारत का माल', { size: 36, fill: P.paper, cls: 'tag buy' })}${tag(1520, 540, '3. यूरोप में बिक्री', { size: 40, fill: P.paper, cls: 'tag sell' })}${coinPile(1300, 900, 16)}` };
  },

  s23(A) {
    const m = mp(VN);
    year(A);
    const cities = [['meerut', 'मेरठ'], ['delhi', 'दिल्ली'], ['kanpur', 'कानपुर'], ['lucknow', 'लखनऊ'], ['jhansi', 'झाँसी']];
    cities.forEach(([k, n], i) => A.pop(`.c${i}`, A.cue(n), 0.4));
    A.pop('.heroes .tag', A.cue('मंगल पांडे'), 0.4, 0.5);
    A.pop('.crush', A.cue('कुचल'));
    A.pop('.crown', A.cue('महारानी'));
    return { svg: `${m.base()}${BH.rivers(m, ['ganga', 'yamuna'])}${cities.map(([k, n], i) => `<g class="c${i}"><circle cx="${xy(m, k)[0]}" cy="${xy(m, k)[1]}" r="40" fill="${P.brick}" opacity="0.35"/>${pl(m, n, k, { color: P.brick, size: 34 })}</g>`).join('')}
      ${g('heroes', `${tag(380, 160, 'मंगल पांडे', { size: 38, fill: P.snow })}${tag(380, 260, 'रानी लक्ष्मीबाई', { size: 38, fill: P.amber3 })}${tag(380, 360, 'तात्या टोपे', { size: 38, fill: P.snow })}`)}
      ${tag(1500, 900, 'बेरहमी से कुचला गया', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag crush' })}${tag(1500, 1000, '1858: सीधे ब्रिटिश ताज के अधीन', { size: 34, fill: P.paper, cls: 'tag crown' })}`, over: yr('1857', 'पहला स्वतंत्रता संग्राम') };
  },

  s24(A) {
    year(A);
    A.fadeIn('.loom', 0.3, 0.8, 0);
    A.tween('.loom', A.cue('बर्बाद'), 1, { opacity: 1 }, { opacity: 0.35 }, 'none');
    A.pop('.mach', A.cue('मशीनों'));
    A.drift('.steam', A.cue('रेलवे'), A.dur - A.cue('रेलवे'), { x: -900 }, { x: 300 }, 'none');
    A.pop('.fam', A.cue('तीस लाख'));
    A.pop('.drain', A.cue('धन का निकास'));
    return { svg: `${L.sky('#C9B89A')}${L.ground(880)}${BH.loom(360, 860, 1.1)}${tag(360, 400, 'बुनकर बर्बाद', { size: 40, fill: P.snow, cls: 'tag mach' })}${BH.steamTrain(900, 1020, 0.6)}
      ${tag(1450, 220, '1943 बंगाल अकाल: ~30 लाख मौतें', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag fam' })}${tag(1450, 360, 'दादाभाई नौरोजी: "धन का निकास"', { size: 38, fill: P.amber3, cls: 'tag drain' })}`, over: yr('1858–1947', 'ब्रिटिश राज') };
  },

  s25(A) {
    year(A);
    A.pop('.inc', A.cue('कांग्रेस'));
    A.slideIn('.gd', A.cue('महात्मा गांधी'), 1, -400);
    A.loop('.wheel', { rotation: 0, ...TO('50% 50%') }, { rotation: 360, ...TO('50% 50%') }, 3, A.cue('महात्मा गांधी'), 'none');
    ['चंपारण', 'असहयोग', 'नमक', 'भारत छोड़ो'].forEach((w, i) => A.pop(`.m${i}`, A.cue(w), 0.4));
    A.pop('.bs', A.cue('भगत सिंह')); A.pop('.sb', A.cue('सुभाष'));
    return { svg: `${L.sky()}${L.ground(900)}${I.gandhi(560, 980, 1.6, { pose: 'walk', cls: 'gandhi gd' })}${BH.charkha(940, 900, 0.9)}${tag(560, 150, '1885: भारतीय राष्ट्रीय कांग्रेस', { size: 38, fill: P.snow, cls: 'tag inc' })}
      ${['चंपारण 1917', 'असहयोग 1920', 'नमक सत्याग्रह 1930', 'भारत छोड़ो 1942'].map((t, i) => tag(1400, 280 + i * 110, t, { size: 38, fill: P.amber3, cls: `tag m${i}` })).join('')}
      ${tag(1220, 760, 'भगत सिंह', { size: 36, fill: P.paper, cls: 'tag bs' })}${tag(1580, 760, 'सुभाष चंद्र बोस · INA', { size: 34, fill: P.paper, cls: 'tag sb' })}`, over: yr('1885–1947', '') };
  },

  s26(A) {
    year(A);
    letterbox(A, 0);
    A.fadeIn('.night', 0.2, 0.8, 0);
    A.pop('.flag', A.cue('आज़ाद हुआ') - 0.3);
    A.loop('.cloth', { skewY: 0 }, { skewY: 3 }, 0.9, A.cue('आज़ाद हुआ'));
    A.tween('.part', A.cue('बँटवारा') - 0.3, 1, { opacity: 0 }, { opacity: 1 }, 'none');
    A.drift('.migr', A.cue('घर छोड़ना'), A.dur - A.cue('घर छोड़ना'), { x: 0 }, { x: 500 }, 'none');
    A.loop('.migr .person', { y: 0 }, { y: -4 }, 0.6, A.cue('घर छोड़ना'));
    A.pop('.n1cr', A.cue('एक करोड़'));
    return { svg: `${g('night', `${L.sky('#1A1430')}${X.spaceBg(77, { nebula: false })}<rect x="-200" y="880" width="2320" height="400" fill="#2A2235"/>${BH.tricolor(900, 220, 360)}`)}
      ${g('part', `<rect x="-200" y="-200" width="2320" height="1480" fill="#5A4A3A" opacity="0.85"/><g class="migr">${Array.from({ length: 16 }, (_, i) => L.person(-200 + i * 110, 1000 + (i % 2) * 14, 0.75, { coat: [P.paper3, P.olive2, P.rose, P.slate3][i % 4], hat: i % 3 ? 'none' : 'turban', hatColor: P.snow, skin: I.SKIN[i % 5], skirt: i % 3 === 0 })).join('')}</g>${tag(960, 300, 'बँटवारा: भारत और पाकिस्तान', { size: 50, fill: P.snow })}${tag(960, 430, '1 करोड़+ विस्थापित · लाखों मौतें', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag n1cr' })}`)}`, over: `${LB}${yr('15 अगस्त 1947', '')}` };
  },

  s27(A) {
    year(A);
    A.pop('.n560', A.cue('पाँच सौ साठ'));
    A.pop('.dots circle', A.cue('रियासतें'), 0.2, 0.02);
    A.slideIn('.pt', A.cue('पटेल'), 0.9, -400);
    A.tween('.dots', A.cue('मिला लिया'), 1.6, { scale: 1, ...C }, { scale: 0.4, ...C }, 'power2.inOut');
    A.pop('.iron', A.cue('लौह पुरुष'));
    let dots = ''; for (let i = 0; i < 80; i++) dots += `<circle cx="${900 + (i % 10) * 90}" cy="${300 + Math.floor(i / 10) * 80}" r="22" fill="${[P.amber2, P.brick, P.olive2, P.slate2][i % 4]}" ${Sthin}/>`;
    return { svg: `${L.sky()}${L.ground(900)}${E.figure(560, 990, 1.7, { coat: P.snow, cls: 'fig pt', skin: '#C48E62' })}${tag(560, 520, 'सरदार वल्लभभाई पटेल', { size: 38, fill: P.snow, cls: 'tag pt' })}
      <g class="dots">${dots}</g>${tag(1300, 200, '560+ रियासतें', { size: 50, fill: P.amber3, cls: 'tag n560' })}${big(1300, 1000, 'लौह पुरुष', { size: 80, color: P.amber3, cls: 'iron' })}`, over: yr('1947–1949', '') };
  },

  s28(A) {
    year(A);
    A.pop('.book', A.cue('संविधान'));
    A.pop('.amb', A.cue('अंबेडकर'));
    A.pop('.long', A.cue('सबसे लंबा'));
    A.fadeIn('.vote', A.cue('वोट') - 0.3, 0.8, 0);
    A.pop('.voters .person', A.cue('अमीर हो'), 0.3, 0.12);
    return { svg: `${L.sky()}${L.ground(900)}${R.book(480, 560, 'संविधान', 1.1)}${tag(480, 200, 'डॉ. भीमराव अंबेडकर', { size: 40, fill: P.snow, cls: 'tag amb' })}${tag(480, 920, 'दुनिया का सबसे लंबा लिखित संविधान', { size: 32, fill: P.amber3, cls: 'tag long' })}
      ${g('vote', `<rect x="1300" y="560" width="220" height="220" fill="${P.snow}" ${S}/><rect x="1360" y="540" width="100" height="20" fill="${P.ink}"/>${txt(1410, 700, 'वोट', { size: 44 })}${tag(1420, 300, 'हर वयस्क को वोट, पहले दिन से', { size: 38, fill: P.amber3 })}`, shadow)}
      <g class="voters">${[0, 1, 2, 3, 4].map((i) => L.person(1100 + i * 140, 1010, 0.9, { coat: [P.paper3, P.olive2, P.amber2, P.slate3, P.rose][i], hat: i % 2 ? 'turban' : 'none', hatColor: P.snow, skin: I.SKIN[i], skirt: i % 2 === 0 })).join('')}</g>`, over: yr('26 जनवरी 1950', 'गणतंत्र') };
  },

  s29(A) {
    year(A);
    A.pop('.w62', A.cue('चीन'));
    A.pop('.w65', A.cue('पाकिस्तान'));
    A.fadeIn('.ship', A.cue('गेहूँ') - 0.3, 0.8, 0);
    A.drift('.ship', A.cue('गेहूँ'), 3, { x: 500 }, { x: 0 }, 'power2.out');
    return { svg: `${L.sky('#C9CFD2')}${E.peaks(820, 501, { h: 300, fill: '#B8BEC0' })}<rect x="-200" y="880" width="2320" height="400" fill="${P.slate2}" ${S}/>
      ${tag(560, 200, '1962: चीन से युद्ध', { size: 44, fill: P.snow, cls: 'tag w62' })}${tag(560, 320, '1965: पाकिस्तान से युद्ध', { size: 44, fill: P.paper, cls: 'tag w65' })}
      <g class="ship">${L.ship(1450, 960, 0.8)}${tag(1450, 600, 'विदेश से गेहूँ मँगाना पड़ता था', { size: 34, fill: P.amber3 })}</g>`, over: yr('1960s', '') };
  },

  s30(A) {
    year(A);
    A.pop('.wheat', A.cue('हरित क्रांति'), 0.6, 0.15);
    A.pop('.self', A.cue('आत्मनिर्भर'));
    A.pop('.b71', A.cue('बांग्लादेश'));
    A.pop('.pk', A.cue('पोखरण'));
    return { svg: `${L.sky()}<rect x="-200" y="880" width="2320" height="400" fill="${P.olive2}" ${S}/>${[0, 1, 2, 3, 4].map((i) => BH.wheat(200 + i * 220, 900, 0.9)).join('')}
      ${tag(660, 300, 'हरित क्रांति: अनाज में आत्मनिर्भर', { size: 40, fill: P.amber3, cls: 'tag self' })}
      ${tag(1500, 300, '1971: बांग्लादेश का जन्म', { size: 40, fill: P.snow, cls: 'tag b71' })}${tag(1500, 420, '1974: पोखरण परमाणु परीक्षण', { size: 38, fill: P.paper, cls: 'tag pk' })}`, over: yr('1965–1974', '') };
  },

  s31(A) {
    year(A);
    letterbox(A, 0);
    A.tween('.bar', 0.5, 2.5, { scaleX: 1, ...TO('0% 50%') }, { scaleX: 0.05, ...TO('0% 50%') }, 'power2.in');
    A.pop('.weeks', A.cue('कुछ ही हफ़्तों'));
    A.fadeIn('.gold', A.cue('सोना') - 0.3, 0.6, 0);
    A.drift('.gold', A.cue('गिरवी'), 2.5, { x: 0 }, { x: 600 }, 'power2.in');
    A.pop('.open', A.cue('खोल दी'));
    A.pop('.lic', A.cue('लाइसेंस'));
    return { svg: `${L.sky('#C9B89A')}<rect x="300" y="220" width="1320" height="70" fill="${P.paper}" ${S}/><rect class="bar" x="300" y="220" width="1320" height="70" fill="${P.olive}" ${Sthin}/>${txt(960, 340, 'विदेशी मुद्रा भंडार', { size: 40 })}
      ${tag(960, 440, 'बस कुछ ही हफ़्तों का आयात बचा', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag weeks' })}
      <g class="gold">${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${620 + (i % 3) * 120} ${880 - Math.floor(i / 3) * 50}l20 -40h80l20 40z" fill="${P.amber3}" ${S}/>`).join('')}${txt(740, 960, 'सोना गिरवी', { size: 40 })}</g>
      ${tag(1400, 760, 'अर्थव्यवस्था खुली', { size: 50, fill: P.amber3, cls: 'tag open' })}${tag(1400, 880, 'लाइसेंस राज ढीला', { size: 38, fill: P.snow, cls: 'tag lic' })}`, over: `${LB}${yr('1991', 'संकट और सुधार')}` };
  },

  s32(A) {
    year(A);
    A.pop('.it', A.cue('बेंगलुरु'), 0.5, 0.2);
    A.fadeIn('.mars', A.cue('मंगल') - 0.3, 0.8, 0);
    A.pop('.moon', A.cue('चंद्रयान'));
    A.pop('.upi', A.cue('यूपीआई'));
    A.loop('.ping', { scale: 0.8, opacity: 1, ...C }, { scale: 1.4, opacity: 0, ...C }, 0.8, A.cue('यूपीआई'), 'none');
    return { svg: `${L.sky()}${L.ground(920)}${g('it', BH.itTower(220, 920, 0.8))}${g('it', BH.itTower(420, 920, 0.65))}${tag(320, 360, 'IT: बेंगलुरु · हैदराबाद', { size: 34, fill: P.snow, cls: 'tag it' })}
      ${clip('cp32', 640, 220, 620, 460, `${X.spaceBg(88, { nebula: false })}${X.mars(1120, 600, 170)}${X.mom(840, 380, 0.5)}`, 'class="mars"')}${tag(950, 730, '2014: मंगलयान', { size: 38, fill: P.amber3, cls: 'tag mars' })}${tag(950, 840, '2023: चंद्रयान-3', { size: 38, fill: P.snow, cls: 'tag moon' })}
      ${BH.phone(1600, 560, 0.9, 'phone', `<circle class="ping" cx="1600" cy="520" r="70" fill="none" stroke="${P.olive}" stroke-width="10"/>${txt(1600, 540, '₹ ✓', { size: 60, color: P.olive })}${txt(1600, 700, 'UPI', { size: 50 })}`)}${tag(1600, 920, 'हर महीने अरबों भुगतान', { size: 34, fill: P.amber3, cls: 'tag upi' })}`, over: yr('2000–2023', '') };
  },

  s33(A) {
    year(A);
    A.pop('.pop', A.cue('आबादी'));
    A.pop('.crowd .person', A.cue('आबादी'), 0.25, 0.02);
    A.pop('.econ', A.cue('अर्थव्यवस्थाओं'));
    ['गरीबी', 'बेरोज़गारी', 'असमानता', 'शिक्षा'].forEach((w, i) => A.pop(`.ch${i}`, A.cue(w), 0.4));
    return { svg: `${L.sky()}${L.ground(900)}${I.crowd(-60, 1980, 980, 36, 0.6, 21, 'crowd')}
      ${tag(560, 160, '2023: सबसे ज़्यादा आबादी', { size: 42, fill: P.amber3, cls: 'tag pop' })}${tag(1400, 160, 'सबसे बड़ी अर्थव्यवस्थाओं में', { size: 40, fill: P.snow, cls: 'tag econ' })}
      ${['गरीबी', 'बेरोज़गारी', 'असमानता', 'शिक्षा · स्वास्थ्य'].map((t, i) => tag(330 + i * 420, 420, t, { size: 40, fill: P.paper, cls: `tag ch${i}` })).join('')}`, over: yr('आज', '') };
  },

  s34(A) {
    A.pop('.q1', A.cue('इतना अमीर'));
    ['उपजाऊ', 'आबादी', 'कारीगर', 'समुद्री'].forEach((w, i) => A.pop(`.r${i}`, A.cue(w), 0.4));
    A.pop('.q2', A.cue('गरीब कैसे'));
    ['बँटे', 'कंपनी', 'दो सौ साल'].forEach((w, i) => A.pop(`.p${i}`, A.cue(w), 0.4));
    return { svg: `${L.sky()}${tag(480, 140, 'अमीर क्यों था?', { size: 52, fill: P.amber3, cls: 'tag q1' })}${tag(1440, 140, 'गरीब कैसे हुआ?', { size: 52, fill: P.brick2, color: P.snow, cls: 'tag q2' })}
      ${['उपजाऊ ज़मीन', 'बड़ी आबादी', 'कुशल कारीगर', 'समुद्री व्यापार'].map((t, i) => tag(480, 300 + i * 130, t, { size: 42, fill: P.paper, cls: `tag r${i}` })).join('')}
      ${['आपस में बँटे राज्य', 'एक विदेशी कंपनी', '~200 साल दौलत का निकास'].map((t, i) => tag(1440, 300 + i * 130, t, { size: 40, fill: P.paper, cls: `tag p${i}` })).join('')}` };
  },

  s35(A) {
    A.pop('.not', A.cue('एक भाषा'));
    A.draw('.not .xmark path', A.cue('एक भाषा') + 0.3, 0.4);
    A.pop('.ideas', A.cue('विचारों'));
    ['अशोक', 'अकबर', 'गांधी', 'अंबेडकर'].forEach((w, i) => A.pop(`.i${i}`, A.cue(w), 0.4));
    A.pop('.tog', A.cue('साथ रहने'));
    A.loop('.chakra', { rotation: 0, ...C }, { rotation: 360, ...C }, 10, 0, 'none');
    return { svg: `${L.sky('url(#dusk)')}${BH.chakra(960, 600, 300, 'chakra', '#2B3A73')}
      ${g('not', `${tag(960, 150, 'एक भाषा / एक धर्म', { size: 44 })}${L.cross(960, 150, 60)}`)}${big(960, 300, 'कुछ विचार', { size: 90, color: P.amber3, cls: 'ideas' })}
      ${['अशोक का धम्म', 'अकबर की सुलह', 'गांधी की अहिंसा', 'अंबेडकर का संविधान'].map((t, i) => tag(330 + i * 420, 500 + (i % 2) * 120, t, { size: 38, fill: P.paper, cls: `tag i${i}` })).join('')}
      ${tag(960, 960, 'अलग-अलग होकर भी साथ', { size: 50, fill: P.snow, cls: 'tag tog' })}` };
  },

  s36(A) {
    letterbox(A, 0);
    ambientSky(A);
    A.camera({ scale: 1.0 }, { scale: 1.1 });
    A.loop('.cloth', { skewY: 0 }, { skewY: 3 }, 0.9);
    A.fadeIn('.ttl', 0.5, 1.2, 30);
    A.pop('.next', A.cue('अगला अध्याय'));
    A.pop('.sub', A.cue('सब्सक्राइब'));
    A.pop('.cm', A.cue('कमेंट'));
    return { svg: `${L.sky('url(#dusk)')}${L.sun(960, 700, 160)}${L.cloud(300, 220, 1, 'cloud c1')}${L.cloud(1300, 170, 0.8, 'cloud c2')}<rect x="-200" y="900" width="2320" height="400" fill="#B49A78" ${S}/>${BH.lionCapital(360, 960, 0.8)}${BH.taj(1560, 900, 0.4)}${BH.tricolor(940, 420, 220)}
      ${big(960, 250, 'भारत · 5000 सालों की कहानी', { size: 92, cls: 'ttl' })}${tag(960, 360, 'अगला अध्याय: हम सब', { size: 40, fill: P.amber3, cls: 'tag next' })}
      ${tag(620, 800, 'सब्सक्राइब करें', { size: 46, fill: P.brick2, color: P.snow, cls: 'tag sub' })}${tag(1300, 800, 'आपका पसंदीदा दौर? कमेंट करें', { size: 38, fill: P.amber3, cls: 'tag cm' })}`, over: LB };
  },
};

export function sfx(clips) {
  const total = clips.at(-1).start + clips.at(-1).dur;
  const by = Object.fromEntries(clips.map((c) => [c.id, c]));
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(1440, total), vol: 0.17, fadeIn: 2, fadeOut: 5 },
    { id: 'fx_w1', file: 'drums.wav', start: by.s10.start, dur: Math.min(12, by.s10.dur), vol: 0.5, fadeIn: 0.5, fadeOut: 3 },
    { id: 'fx_w2', file: 'drums.wav', start: by.s15.start, dur: by.s15.dur, vol: 0.4, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_w3', file: 'drums.wav', start: by.s21.start, dur: by.s21.dur, vol: 0.45, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_w4', file: 'drums.wav', start: by.s23.start, dur: by.s23.dur, vol: 0.4, fadeIn: 1, fadeOut: 2 },
  ];
}
