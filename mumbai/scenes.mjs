// 26/11 — मुंबई के वो 60 घंटे. Respectful treatment: attackers are faceless silhouettes, no weapons/blood drawn; focus on the people who saved others.
import * as L from '../lib/inkamber.mjs';
import * as M from '../lib/maps.mjs';
import * as E from '../lib/epic.mjs';
import * as R from '../lib/persia.mjs';
import * as I from '../lib/india.mjs';
import * as X from '../lib/space.mjs';
import * as MU from '../lib/mumbai.mjs';
import { fonts, css as baseCss, HF, HT, tag, big, txt, yr, LB, TO, C, B, cal, clip, letterbox, year, mapCam, arrowIn, chapterCard } from '../lib/hindi-film.mjs';
const { P, g, S, Sthin, shadow } = L;
const { MPL } = MU;
export { fonts };
export const css = baseCss + `.yr{color:#F7F1E3}`;
export const defs = () => X.spaceDefs() + MU.mumbaiDefs();
export const title = '26/11 — मुंबई के वो 60 घंटे';

const VR = { center: [70.0, 22.0], scale: 4200 }, VI = { center: [80, 22], scale: 1350 };
const PL = { karachi: [67.01, 24.86], mumbai: [72.83, 18.95], kuber: [67.9, 22.9], manesar: [76.94, 28.36], chennai: [80.27, 13.08], kolkata: [88.36, 22.57], hyderabad: [78.49, 17.39], delhi: [77.21, 28.61], porbandar: [69.6, 21.64], okha: [69.08, 22.47], ratnagiri: [73.3, 16.99], goa: [73.83, 15.49], mangalore: [74.86, 12.91], kochi: [76.27, 9.93], veraval: [70.37, 20.9] };
const mc = {}; const mp = (v) => mc[JSON.stringify(v)] ||= M.makeMap(v);
const pl = (m, n, k, o) => M.place(m, n, ...PL[k], o);

export const chapters = {
  s04: [1, 'समुद्र का रास्ता'], s08: [2, 'वो रात'], s14: [3, 'होटलों में घेराबंदी'], s19: [4, 'ऑपरेशन ब्लैक टॉरनेडो'],
  s23: [5, 'सच की तलाश'], s27: [6, 'बदलाव'], s30: [7, 'आज'],
};
export const chapterSvg = (n, t) => chapterCard(n, t, '#1B2230');

const N = MU.nightSky;
const pulses = (A, sel = '.pulse .ring') => A.loop(sel, { scale: 0.6, opacity: 1, ...C }, { scale: 1.5, opacity: 0.4, ...C }, 0.7);
const waves = (A) => { A.loop('.wave.w0', { x: 0 }, { x: -60 }, 3.2); A.loop('.wave.w1', { x: -30 }, { x: 30 }, 2.6); A.loop('.wave.w2', { x: 20 }, { x: -40 }, 3.8); };
const flicker = (A, sel = '.flame') => A.loop(sel, { scaleY: 1, scaleX: 1, ...B }, { scaleY: 1.18, scaleX: 0.88, ...B }, 0.35);
const nameCard = (x, y, w, name, role, inner = '', cls = 'nc') => g(cls, `${L.paperCard(x - w / 2, y, w, 330, '', { fill: '#F5EEDC' })}${inner}${txt(x, y + 260, name, { size: 36 })}${txt(x, y + 305, role, { size: 26, color: P.ink2 })}`);

export const scenes = {
  s01(A) {
    letterbox(A, 0); year(A, 0.6); waves(A);
    A.tween('.dinghy', 0, 6, { x: -900 }, { x: 0 }, 'power1.out');
    A.loop('.dinghy', { y: 0 }, { y: 8 }, 1.1);
    A.pop('.colaba', A.cue('कोलाबा'));
    A.fadeIn('.shades .shade', A.cue('उतरे'), 0.6, 10);
    A.tween('.shades', A.cue('गुम'), 2.4, { x: 0, opacity: 1 }, { x: 520, opacity: 0 }, 'power1.in');
    A.pop('.fisher', A.cue('टोका'), 0.6);
    let sh = ''; for (let i = 0; i < 5; i++) sh += MU.shade(980 + i * 70, 905 + (i % 2) * 12, 0.62, i);
    return { svg: `${N(3)}${MU.moon(1560, 190, 46)}${L.skyline(-120, 2120, 600, 9, { colors: ['#3A3F52', '#454A5E', '#2F3446', '#50495A'], minH: 90, varH: 170, cls: 'skyline far' })}${MU.sea(600)}
      <path d="M760 1300L1000 860H2200V1300Z" fill="#4A4038" ${S}/>${I.hut(1420, 880, 0.7, 'hut', '#7A6A55')}${I.hut(1640, 870, 0.62, 'hut', '#6E604E')}${I.hut(1830, 885, 0.7, 'hut', '#7A6A55')}${MU.dinghy(760, 760, 0.9)}
      ${g('shades', sh)}${g('fisher', MU.civ(1340, 950, 0.75, 2))}${tag(1500, 300, 'मछुआरों की बस्ती, कोलाबा', { size: 38, fill: P.snow, cls: 'tag colaba' })}`, over: `${LB}${yr('26 नवंबर 2008', 'रात ~8:20')}` };
  },

  s02(A) {
    A.pop('.mp-cst, .pulse.p1', A.cue('रेलवे'));
    A.pop('.mp-cama, .pulse.p2', A.cue('अस्पताल'));
    A.pop('.mp-leopold, .pulse.p3', A.cue('कैफ़े'));
    A.pop('.mp-taj, .mp-oberoi, .pulse.p4, .pulse.p5', A.cue('होटल'));
    A.pop('.mp-nariman, .pulse.p6', A.cue('यहूदी'));
    pulses(A);
    A.fadeIn('.hdr', 0.4, 0.8, -20);
    A.pop('.n166', A.cue('छियासठ'), 0.8);
    A.pop('.inj', A.cue('घायल'));
    A.pop('.tvs', A.cue('लाइव'));
    A.loop('.tvs .live', { opacity: 1 }, { opacity: 0.3 }, 0.5);
    A.camera({ scale: 1.0, x: 0 }, { scale: 1.06, x: -30 });
    const pp = [['cst', 1], ['cama', 2], ['leopold', 3], ['taj', 4], ['oberoi', 5], ['nariman', 6]].map(([k, i]) => MU.pulse(...MPL[k], 46, `pulse p${i}`)).join('');
    return { svg: `${MU.mumbaiMap()}${pp}${MU.mplace('CST स्टेशन', 'cst')}${MU.mplace('कामा अस्पताल', 'cama', { dy: -16 })}${MU.mplace('लियोपोल्ड कैफ़े', 'leopold', { anchor: 'end', dx: -22 })}${MU.mplace('ताज होटल', 'taj', { dy: 30 })}${MU.mplace('ओबेरॉय ट्राइडेंट', 'oberoi', { anchor: 'end', dx: -22 })}${MU.mplace('नरीमन हाउस', 'nariman', { anchor: 'end', dx: -22, dy: 30 })}
      ${big(1660, 150, '60 घंटे', { size: 96, color: P.snow, cls: 'hdr' })}
      ${g('n166', `<rect x="1460" y="250" width="400" height="260" rx="14" fill="${P.ink}" ${S}/>${big(1660, 420, '166', { size: 150, color: '#E86A4A' })}${txt(1660, 485, 'बेगुनाह लोगों की जान गई', { size: 32, color: P.snow })}`)}
      ${tag(1660, 580, '300+ घायल', { size: 40, fill: P.snow, cls: 'tag inj' })}${MU.tv(1500, 700, 320, 200, `${MU.tajHotel(1660, 880, 0.26, { lit: 0.4 })}`, 'tv tvs')}` };
  },

  s03(A) {
    A.pop('.q1', A.cue('कैसे'), 0.7); A.pop('.q2', A.cue('क्यों'), 0.7); A.pop('.q3', A.cue('बदला'), 0.7);
    A.fadeOut('.q1, .q2, .q3', A.cue('ये कहानी') - 0.3, 0.5);
    A.fadeIn('.s1', A.cue('ये कहानी'), 0.8, 20);
    A.fadeIn('.s2', A.cue('उन लोगों'), 0.8, 20);
    A.fadeIn('.go', A.cue('चलिए'), 0.8, 20);
    A.loop('.win.on', { opacity: 1 }, { opacity: 0.7 }, 1.3);
    return { svg: `${L.sky('url(#dusk)')}${MU.sea(830, P.slate)}${MU.gateway(1880, 830, 0.55)}${MU.tajHotel(1340, 830, 0.72, { lit: 0.6 })}
      ${tag(560, 220, 'सिर्फ़ 10 लोग… इतना बड़ा शहर कैसे रुका?', { size: 40, fill: P.snow, cls: 'tag q1' })}${tag(560, 340, '60 घंटे क्यों लगे?', { size: 44, fill: P.amber3, cls: 'tag q2' })}${tag(560, 460, 'उसके बाद भारत ने क्या बदला?', { size: 42, fill: P.snow, cls: 'tag q3' })}
      ${big(560, 280, 'ये कहानी डर की नहीं…', { size: 66, cls: 's1' })}${big(560, 400, '…हिम्मत की है', { size: 66, color: P.amber3, cls: 's2' })}${big(560, 620, 'चलिए, शुरुआत से…', { size: 60, color: P.snow, cls: 'go' })}` };
  },

  s04(A) {
    const m = mp(VR);
    mapCam(A, 1.0, 1.08, 20);
    A.pop('.pk', 0.5); A.pop('.in', 0.9); A.pop('.sea', 1.2);
    A.pop('.k', A.cue('पाकिस्तान'));
    A.pop('.let', A.cue('लश्कर-ए-तैयबा'));
    A.pop('.ban', A.cue('प्रतिबंध'));
    A.slideIn('.doc', A.cue('जाँच'), 0.9, 300);
    A.pop('.d1', A.cue('योजना')); A.pop('.d2', A.cue('ट्रेनिंग')); A.pop('.d3', A.cue('निर्देश'));
    return { svg: `${m.base()}${M.regionLabel(m, 'पाकिस्तान', 66.3, 26.6, { size: 54, cls: 'rlabel pk' })}${M.regionLabel(m, 'भारत', 75.0, 23.6, { size: 60, color: P.brick, cls: 'rlabel in' })}${g('sea', M.regionLabel(m, 'अरब सागर', 67.2, 19.4, { size: 46, color: P.slate }))}${pl(m, 'कराची', 'karachi', { cls: 'place k' })}${pl(m, 'मुंबई', 'mumbai', { cls: 'place mb' })}
      ${tag(520, 820, 'लश्कर-ए-तैयबा (LeT)', { size: 42, fill: P.ink, color: P.snow, cls: 'tag let' })}${tag(520, 930, 'भारत और संयुक्त राष्ट्र द्वारा प्रतिबंधित', { size: 34, fill: P.snow, cls: 'tag ban' })}
      ${g('doc', `${L.paperCard(1360, 520, 440, 380, '', { fill: '#F5EEDC' })}${txt(1580, 585, 'भारत की जाँच के मुताबिक', { size: 32, color: P.ink2 })}${g('d1', txt(1580, 680, 'योजना', { size: 46 }))}${g('d2', txt(1580, 760, 'ट्रेनिंग', { size: 46 }))}${g('d3', txt(1580, 840, 'निर्देश', { size: 46 }))}`)}` };
  },

  s05(A) {
    A.fadeIn('.hd', 0.3, 0.8, 30);
    A.pop('.hdn', A.cue('डेविड'));
    A.pop('.yrs', A.cue('कई बार'));
    A.pop('.ph1', A.cue('ताज'), 0.6); A.pop('.ph2', A.cue('रेलवे'), 0.6); A.pop('.ph3', A.cue('समुद्र'), 0.6);
    A.pop('.rana', A.cue('तहव्वुर'));
    A.camera({ scale: 1.0, x: 0 }, { scale: 1.05, x: -20 });
    const photo = (id, x, y, rot, inner, cls) => g(cls, `<g transform="rotate(${rot} ${x + 160} ${y + 120})"><rect x="${x - 16}" y="${y - 16}" width="352" height="292" fill="${P.snow}" ${S}/>${clip(id, x, y, 320, 220, inner)}</g>`);
    return { svg: `${L.sky()}${L.ground(900)}${g('hd', `${L.person(380, 900, 1.7, { coat: P.ink2, hat: 'none', skin: '#E2B48C', cls: 'person hdp' })}<rect x="410" y="640" width="90" height="56" rx="8" fill="${P.ink}" ${Sthin}/><circle cx="500" cy="668" r="18" fill="#6F8792" ${Sthin}/>`)}
      ${tag(380, 420, 'डेविड हेडली — अमेरिकी नागरिक', { size: 36, fill: P.snow, cls: 'tag hdn' })}${tag(380, 520, '2006–2008: कई बार मुंबई', { size: 34, fill: P.amber3, cls: 'tag yrs' })}
      ${photo('ph1c', 760, 180, -4, `${MU.nightSky(2)}${MU.tajHotel(920, 400, 0.3)}`, 'ph1')}${photo('ph2c', 1180, 220, 3, `${L.sky('url(#dusk)')}${MU.cst(1340, 440, 0.3)}`, 'ph2')}${photo('ph3c', 960, 520, -2, `${L.sky()}${MU.sea(600, P.slate)}<path d="M960 740L1100 640H1280V740Z" fill="#8A7258"/>`, 'ph3')}
      ${tag(1340, 940, 'तहव्वुर राणा की कंपनी — आड़? (आरोप, मुक़दमा जारी)', { size: 32, fill: P.snow, cls: 'tag rana' })}` };
  },

  s06(A) {
    const m = mp(VR);
    year(A, 0.4); mapCam(A, 1.0, 1.08, -20);
    arrowIn(A, '.ar1', A.cue('कराची'), 2.2);
    A.pop('.boat', A.cue('कुबेर'), 0.7);
    A.pop('.kname', A.cue('कुबेर'));
    A.pop('.four', A.cue('चार'));
    A.pop('.sol', A.cue('सोलंकी'));
    A.loop('.boat', { y: 0 }, { y: 6 }, 1.2);
    const [kx, ky] = m.xy(...PL.kuber);
    return { svg: `${m.base()}${M.regionLabel(m, 'पाकिस्तान', 66.3, 26.6, { size: 54 })}${M.regionLabel(m, 'भारत', 75.0, 23.6, { size: 60, color: P.brick })}${M.regionLabel(m, 'अरब सागर', 67.2, 19.4, { size: 46, color: P.slate })}${pl(m, 'कराची', 'karachi')}${pl(m, 'मुंबई', 'mumbai')}
      ${M.arrow(m, PL.karachi, PL.kuber, { cls: 'arrow ar1', bend: 0.25, w: 10 })}${g('boat', MU.trawler(kx + 40, ky + 10, 0.36, { name: 'कुबेर' }))}${tag(kx - 40, ky + 110, 'भारतीय मछली नाव "कुबेर" पर कब्ज़ा', { size: 32, fill: P.snow, cls: 'tag kname' })}
      ${tag(1540, 860, '4 मल्लाह मारे गए', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag four' })}${tag(1540, 970, 'नाविक अमर सिंह सोलंकी — बंधक', { size: 36, fill: P.snow, cls: 'tag sol' })}`, over: yr('23 नवंबर 2008') };
  },

  s07(A) {
    const m = mp(VR);
    arrowIn(A, '.ar2', 0.4, 2.4);
    A.pop('.solt', A.cue('सोलंकी'));
    A.fadeIn('.m2', A.cue('डिंगी') - 0.2, 0.8, 0);
    A.pop('.mp-badhwar', A.cue('बधवार'));
    ['cst', 'leopold', 'taj', 'oberoi', 'nariman'].forEach((k, i) => A.draw(`.r${i}`, A.cue('बँट') + i * 0.35, 1.2));
    A.pop('.tg', A.cue('निशाना'));
    A.pop('.mp-cst, .mp-leopold, .mp-taj, .mp-oberoi, .mp-nariman', A.cue('बँट') + 0.6, 0.6, 0.3);
    const routes = ['cst', 'leopold', 'taj', 'oberoi', 'nariman'].map((k, i) => MU.mroute('badhwar', k, `mroute r${i}`, i % 2 ? 0.18 : -0.15)).join('');
    return { svg: `${g('m1', `${m.base()}${M.regionLabel(m, 'भारत', 75.0, 23.6, { size: 60, color: P.brick })}${pl(m, 'मुंबई', 'mumbai')}${M.arrow(m, PL.kuber, PL.mumbai, { cls: 'arrow ar2', bend: 0.2, w: 10 })}${tag(1460, 860, 'मुंबई से कुछ समुद्री मील पहले — सोलंकी की हत्या', { size: 32, fill: P.snow, cls: 'tag solt' })}`)}
      ${g('m2', `${MU.mumbaiMap()}${routes}${MU.mplace('बधवार पार्क (उतरने की जगह)', 'badhwar', { anchor: 'end', dx: -22 })}${MU.mplace('CST', 'cst')}${MU.mplace('लियोपोल्ड', 'leopold', { anchor: 'end', dx: -22 })}${MU.mplace('ताज', 'taj', { dy: 30 })}${MU.mplace('ओबेरॉय', 'oberoi', { anchor: 'end', dx: -22 })}${MU.mplace('नरीमन हाउस', 'nariman', { anchor: 'end', dx: -22, dy: 34 })}
        ${tag(1620, 300, 'दो-दो के 5 गुट', { size: 42, fill: P.snow, cls: 'tag tg' })}`)}`, over: yr('26 नवंबर', 'शाम') };
  },

  s08(A) {
    year(A, 0.3); letterbox(A, 0);
    A.set('.cstclock .hour', 0, { rotation: 280, svgOrigin: '960 385' });
    A.set('.cstclock .minute', 0, { rotation: 120, svgOrigin: '960 385' });
    A.pop('.busy', A.cue('भीड़'));
    A.fadeIn('.duo .shade', A.cue('कसाब'), 0.6, 10);
    A.pop('.names', A.cue('कसाब'));
    A.tween('.flash', A.cue('गोलियाँ'), 0.25, { opacity: 0 }, { opacity: 0.22 }, 'none', { repeat: 9, yoyo: true });
    A.pop('.n58', A.cue('अट्ठावन'), 0.8);
    A.tween('.arch0, .arch1, .arch2', A.cue('गोलियाँ') + 2, 1.5, { fill: MU.MB.lamp }, { fill: '#5A2A22' }, 'power1.in');
    A.camera({ scale: 1.0, x: 0 }, { scale: 1.08, x: 0 });
    return { svg: `${N(8)}${L.ground(860, '#3E3A40')}${MU.cst(960, 860, 1.25)}${g('duo', `${MU.shade(900, 940, 0.55, 0)}${MU.shade(990, 945, 0.55, 3)}`)}<rect class="flash" x="-200" y="-200" width="2320" height="1480" fill="#D23A2A" opacity="0"/>
      ${tag(380, 210, 'देश के सबसे व्यस्त स्टेशनों में से एक', { size: 34, fill: P.snow, cls: 'tag busy' })}${tag(1540, 210, 'हमलावर: अजमल कसाब, इस्माइल ख़ान', { size: 32, fill: P.snow, cls: 'tag names' })}
      ${g('n58', `<rect x="1460" y="560" width="380" height="200" rx="12" fill="${P.ink}" ${S}/>${big(1650, 690, '58', { size: 120, color: '#E86A4A' })}${txt(1650, 740, 'लोगों की जान गई', { size: 30, color: P.snow })}`)}`, over: `${LB}${yr('9:20 PM', 'CST स्टेशन')}` };
  },

  s09(A) {
    A.fadeIn('.booth', 0.3, 0.8, 20);
    A.pop('.zn', A.cue('विष्णु'));
    A.pop('.sig .w', A.cue('माइक'), 0.4, 0.25);
    A.loop('.sig .w', { opacity: 1 }, { opacity: 0.25 }, 0.6, A.cue('माइक') + 1.5);
    A.pop('.bub', A.cue('बाहर'));
    A.tween('.run', A.cue('बाहर') + 0.3, 5, { x: -300 }, { x: 420 }, 'power1.inOut');
    A.pop('.exit', A.cue('बाहर'));
    A.pop('.danger', A.cue('ख़तरा'));
    pulses(A, '.danger .ring');
    let crowd = ''; for (let i = 0; i < 9; i++) crowd += MU.civ(700 + i * 110 + (i % 2) * 30, 960 + (i % 3) * 18, 0.8, i, { pose: 'run' });
    return { svg: `${L.sky(MU.MB.night2)}<rect x="-200" y="980" width="2320" height="300" fill="#4A4652"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-60 + i * 380} 980V420q190 -200 380 0V980" fill="none" stroke="#8A7E6E" stroke-width="16"/>`).join('')}
      ${g('booth', `<rect x="80" y="420" width="460" height="400" fill="${P.paper3}" ${S}/><rect x="120" y="470" width="380" height="200" fill="#26313C" ${Sthin}/>${L.person(300, 800, 1.1, { coat: P.slate2, hat: 'none', skin: '#9C6942', pose: 'sit', cls: 'person zp' })}${MU.mic(400, 800, 0.8)}`)}
      ${X.signal(460, 620, 1100, 520, 5)}${g('run', crowd)}${g('exit', `<rect x="1640" y="560" width="220" height="90" rx="10" fill="#2F7A46" ${S}/>${txt(1750, 620, 'बाहर', { size: 44, color: P.snow })}`)}
      ${tag(310, 330, 'विष्णु ज़ेंडे — स्टेशन अनाउंसर', { size: 36, fill: P.snow, cls: 'tag zn' })}${tag(980, 300, '"पीछे के रास्ते से बाहर निकलिए!"', { size: 40, fill: P.amber3, cls: 'tag bub' })}${MU.pulse(560, 480, 60, 'pulse danger')}` };
  },

  s10(A) {
    A.fadeIn('.lp', 0.3, 0.8, 0);
    A.pop('.ln', A.cue('लियोपोल्ड'));
    A.pop('.ten', A.cue('दस'));
    A.fadeIn('.rp', A.cue('टैक्सियों') - 0.4, 0.8, 0);
    A.slideIn('.taxi', A.cue('टैक्सियों'), 1.2, -400);
    A.pop('.vp', A.cue('विले')); A.pop('.wb, .pulse.pw', A.cue('वाडी'));
    pulses(A);
    A.pop('.where', A.cue('समझ'), 0.8);
    const mapIn = `<g transform="translate(470 30) scale(0.8)">${MU.mumbaiMap()}${MU.pulse(...MPL.wadibunder, 46, 'pulse pw')}${MU.mplace('वाडी बंदर', 'wadibunder', { cls: 'mp wb', anchor: 'end', dx: -22 })}</g>`;
    return { svg: `${L.sky(MU.MB.night)}${g('lp', clip('cl10', 60, 130, 860, 820, `${N(5)}${L.ground(860, '#3E3A40')}${MU.bldg(490, 860, 600, 560, { sign: 'लियोपोल्ड कैफ़े', awning: P.brick, fill: '#C9B08A', seed: 9 })}${MU.lamp(140, 860, 380)}`))}
      ${g('rp', clip('cl10b', 1000, 130, 860, 820, mapIn))}${g('vp', `${txt(1200, 210, 'विले पार्ले (उत्तर में)', { size: 34, color: P.ink })}<path d="M1060 230V160l-20 24M1060 160l20 24" stroke="${P.brick}" stroke-width="8" fill="none"/>`)}${MU.car(1700, 930, 0.7, { taxi: true, cls: 'car taxi' })}
      ${tag(490, 1010, '10 लोग मारे गए', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag ten' })}${tag(490, 200, 'लियोपोल्ड कैफ़े, कोलाबा', { size: 34, fill: P.snow, cls: 'tag ln' })}${tag(960, 560, 'हमला कहाँ-कहाँ हो रहा है?', { size: 48, fill: P.amber3, cls: 'tag where' })}`, over: yr('~9:40 PM') };
  },

  s11(A) {
    A.fadeIn('.hosp', 0.3, 0.8, 0);
    A.pop('.wom', A.cue('औरतों'));
    A.fadeIn('.ward', A.cue('अंजलि') - 0.3, 0.8, 0);
    A.pop('.an', A.cue('अंजलि'));
    A.pop('.ww .person', A.cue('बीस'), 0.5, 0.12);
    A.tween('.door', A.cue('दरवाज़ा'), 1.2, { scaleX: 0, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power2.inOut');
    A.tween('.dark', A.cue('बत्तियाँ'), 1.0, { opacity: 0 }, { opacity: 0.55 }, 'power1.in');
    A.pop('.safe', A.cue('बच'), 0.8);
    let ww = ''; for (let i = 0; i < 6; i++) ww += I.woman(1290 + i * 90, 900, 0.7, i);
    return { svg: `${N(6)}${L.ground(900, '#3E3A40')}${g('hosp', MU.bldg(480, 900, 700, 560, { sign: 'कामा अस्पताल', cross: true, fill: '#D8CBB0', seed: 4, lit: 0.4 }))}
      ${g('ward', `${clip('cl11', 1000, 300, 860, 640, `<rect x="1000" y="300" width="860" height="640" fill="${P.paper2}"/><rect x="1000" y="900" width="860" height="40" fill="${P.paper3}"/>${g('ww', ww)}${MU.nurse(1190, 900, 0.85)}<rect class="dark" x="1000" y="300" width="860" height="640" fill="#0B0806" opacity="0"/><rect class="door" x="1000" y="300" width="80" height="640" fill="${P.mol3}" ${S}/>`)}`)}
      ${tag(480, 230, 'औरतों और बच्चों का अस्पताल', { size: 34, fill: P.snow, cls: 'tag wom' })}${tag(1430, 230, 'नर्स अंजलि कुलथे', { size: 40, fill: P.snow, cls: 'tag an' })}${tag(1430, 1010, '20 गर्भवती महिलाएँ — सब सुरक्षित', { size: 36, fill: P.amber3, cls: 'tag safe' })}` };
  },

  s12(A) {
    A.fadeIn('.lane', 0.2, 1, 0);
    A.pop('.c1', A.cue('करकरे'), 0.7); A.pop('.c2', A.cue('कामटे'), 0.7); A.pop('.c3', A.cue('सालस्कर'), 0.7);
    A.tween('.flash', A.cue('घात'), 0.25, { opacity: 0 }, { opacity: 0.2 }, 'none', { repeat: 5, yoyo: true });
    A.pop('.cdl', A.cue('शहीद'), 0.6, 0.25);
    flicker(A);
    A.slideIn('.gone', A.cue('भाग'), 1.4, -300);
    A.tween('.gone', A.cue('भाग') + 1.4, 1.6, { x: 0 }, { x: 900 }, 'power1.in');
    const icon = (x, i) => MU.cop(x, 400, 0.72, i);
    return { svg: `${N(12)}${g('lane', `<path d="M-200 1080L700 640H1220L2120 1080Z" fill="#2B2A30"/>${MU.lamp(120, 900, 360)}${MU.lamp(1760, 900, 360)}`)}<rect class="flash" x="-200" y="-200" width="2320" height="1480" fill="#D23A2A" opacity="0"/>
      ${nameCard(460, 180, 380, 'हेमंत करकरे', 'प्रमुख, ATS महाराष्ट्र', icon(460, 0), 'nc c1')}${nameCard(960, 180, 380, 'अशोक कामटे', 'एडिशनल कमिश्नर', icon(960, 1), 'nc c2')}${nameCard(1460, 180, 380, 'विजय सालस्कर', 'इंस्पेक्टर', icon(1460, 2), 'nc c3')}
      ${g('cdl', `${MU.candle(460, 660, 0.8)}${MU.candle(960, 660, 0.8)}${MU.candle(1460, 660, 0.8)}`)}${MU.car(300, 1000, 0.75, { color: '#E0E0D8', cls: 'car gone' })}
      ${txt(960, 1040, 'तीनों को अशोक चक्र (मरणोपरांत)', { size: 30, color: P.snow, cls: 'cdl' })}` };
  },

  s13(A) {
    year(A, 0.3); waves(A);
    A.pop('.bar', A.cue('नाकाबंदी'));
    A.pop('.cops .cop', A.cue('नाकाबंदी') + 0.3, 0.5, 0.15);
    A.slideIn('.car2', A.cue('कार'), 1.4, -700);
    A.pop('.om', A.cue('ओंबले'), 0.8);
    A.pop('.omn', A.cue('ओंबले'));
    A.pop('.lt', A.cue('लाठी'));
    A.fadeIn('.hold', A.cue('नली'), 0.8, 20);
    A.pop('.med', A.cue('शहीद'), 0.8);
    A.pop('.alive', A.cue('ज़िंदा'), 0.8);
    return { svg: `${N(13)}${MU.sea(560)}<rect x="-200" y="800" width="2320" height="480" fill="#3E3A40"/>${MU.lamp(200, 800, 340)}${MU.lamp(1720, 800, 340)}
      ${MU.barricade(1160, 900, 1.0, 'barricade bar')}${g('cops', `${MU.cop(1420, 930, 0.8, 0)}${MU.cop(1520, 940, 0.8, 1)}${MU.cop(1620, 925, 0.8, 2)}`)}${MU.car(820, 960, 0.85, { color: '#8A939A', cls: 'car car2' })}
      ${g('om', MU.cop(1160, 1040, 1.35, 3, { lathi: true }))}${tag(1160, 600, 'ASI तुकाराम ओंबले', { size: 40, fill: P.snow, cls: 'tag omn' })}${tag(1600, 700, 'हाथ में सिर्फ़ एक लाठी', { size: 34, fill: P.amber3, cls: 'tag lt' })}
      ${big(560, 260, 'उन्होंने पकड़ नहीं छोड़ी', { size: 70, color: P.snow, cls: 'hold' })}${MU.medal(1700, 300, 0.9, 'medal med')}${tag(560, 400, 'कसाब — ज़िंदा पकड़ा गया', { size: 42, fill: P.amber3, cls: 'tag alive' })}`, over: yr('~12:45 AM', 'गिरगाँव चौपाटी') };
  },

  s14(A) {
    year(A, 0.4); waves(A); letterbox(A, 0);
    A.pop('.four', A.cue('चार'));
    A.pop('.old', A.cue('एक सौ पाँच'));
    A.pop('.gw', A.cue('गेटवे'));
    A.pop('.wed', A.cue('शादी'));
    A.loop('.bulbs circle', { opacity: 1 }, { opacity: 0.35 }, 0.5);
    A.camera({ scale: 1.0, x: 0 }, { scale: 1.1, x: 40 });
    let bulbs = ''; for (let i = 0; i < 40; i++) bulbs += `<circle cx="${560 + i * 21}" cy="${640 + Math.sin(i / 3) * 10}" r="5" fill="${['#FFD27A', '#F07A5A', '#9FD0E8'][i % 3]}"/>`;
    return { svg: `${N(14)}${MU.moon(260, 200, 40)}${MU.sea(860)}${MU.tajHotel(1000, 860, 1.0, { lit: 0.75 })}${g('bulbs', bulbs)}${MU.gateway(1600, 880, 0.6, 'gateway gwg')}
      ${tag(1600, 540, 'गेटवे ऑफ़ इंडिया', { size: 34, fill: P.snow, cls: 'tag gw' })}${tag(330, 380, '1903 से मुंबई की पहचान', { size: 36, fill: P.snow, cls: 'tag old' })}${tag(330, 500, 'अंदर शादी की दावतें', { size: 34, fill: P.amber3, cls: 'tag wed' })}${tag(330, 620, '4 हमलावर अंदर', { size: 34, fill: P.brick2, color: P.snow, cls: 'tag four' })}`, over: `${LB}${yr('9:45 PM', 'ताज होटल')}` };
  },

  s15(A) {
    A.fadeIn('.cut', 0.3, 0.8, 0);
    A.pop('.ran', A.cue('भागे'));
    A.pop('.k1', A.cue('कमरों')); A.pop('.k2', A.cue('किचन')); A.pop('.k3', A.cue('हॉल'));
    ['a1', 'a2', 'a3'].forEach((c, i) => A.draw(`.${c}`, A.cue('पिछले') + i * 0.4, 1.6));
    A.pop('.ex', A.cue('पिछले'));
    A.pop('.lost', A.cue('गँवा'));
    A.pop('.hbs', A.cue('हार्वर्ड'), 0.8);
    let rooms = '', ppl = '';
    for (let f = 0; f < 4; f++) for (let r = 0; r < 5; r++) rooms += `<rect x="${200 + r * 220}" y="${200 + f * 180}" width="220" height="180" fill="${(f + r) % 2 ? P.paper2 : P.paper3}" stroke="${P.ink}" stroke-width="3"/>`;
    for (let i = 0; i < 12; i++) ppl += MU.civ(260 + (i % 5) * 220 + (i % 2) * 60, 370 + Math.floor(i / 5) * 180, 0.6, i);
    const staff = (x, y) => L.person(x, y, 0.62, { coat: P.snow, hat: 'none', skin: '#9C6942', cls: 'person st' });
    const ar = (cls, d) => `<path class="${cls}" d="${d}" pathLength="1" stroke-dasharray="1" stroke="#2F7A46" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    return { svg: `${L.sky()}${g('cut', `<rect x="180" y="180" width="1140" height="760" fill="${P.paper}" ${S}/>${rooms}${ppl}${staff(420, 550)}${staff(860, 730)}${staff(1080, 370)}<rect x="180" y="920" width="1140" height="20" fill="${P.ink}"/>`)}
      ${ar('a1', 'M1100 300V560H1240V900')}${ar('a2', 'M700 480V900')}${ar('a3', 'M460 660V900H300')}${g('ex', `<rect x="1220" y="880" width="160" height="70" rx="8" fill="#2F7A46" ${Sthin}/>${txt(1300, 928, 'बाहर', { size: 36, color: P.snow })}`)}
      ${tag(1640, 220, 'कर्मचारी भागे नहीं', { size: 40, fill: P.snow, cls: 'tag ran' })}${tag(1640, 330, 'कमरों में छिपाया', { size: 34, fill: P.paper, cls: 'tag k1' })}${tag(1640, 420, 'किचन में', { size: 34, fill: P.paper, cls: 'tag k2' })}${tag(1640, 510, 'बंद हॉल में', { size: 34, fill: P.paper, cls: 'tag k3' })}
      ${tag(1640, 620, 'कई कर्मचारियों ने जान दी', { size: 34, fill: P.brick2, color: P.snow, cls: 'tag lost' })}${g('hbs', `${R.book(1640, 830, 'केस स्टडी', 0.45, 'book', HT)}${txt(1640, 1000, 'Harvard Business School', { size: 30 })}`)}` };
  },

  s16(A) {
    letterbox(A, 0);
    A.smoke('.tsmoke', 0, 4.5, 260, 5);
    A.loop('.tfire', { opacity: 0.7, scale: 0.95, ...C }, { opacity: 1, scale: 1.08, ...C }, 0.9);
    A.pop('.kc', A.cue('करमबीर'), 0.8);
    A.pop('.fam', A.cue('पत्नी'));
    A.pop('.duty', A.cue('छोड़कर'), 0.8);
    A.camera({ scale: 1.0, x: 0 }, { scale: 1.08, x: 0 });
    return { svg: `${N(16)}${MU.sea(880)}${MU.tajHotel(1150, 880, 1.0, { fire: true, lit: 0.35 })}
      ${nameCard(330, 220, 420, 'करमबीर सिंह कांग', 'जनरल मैनेजर, ताज', L.person(330, 410, 0.9, { coat: P.ink, hat: 'turban', hatColor: P.slate2, skin: '#C48E62' }), 'nc kc')}
      ${tag(330, 640, 'परिवार ऊपर की मंज़िल पर फँसा', { size: 32, fill: P.snow, cls: 'tag fam' })}${big(330, 780, 'ड्यूटी नहीं छोड़ी', { size: 64, color: P.amber3, cls: 'duty' })}`, over: LB };
  },

  s17(A) {
    A.fadeIn('.lp', 0.3, 0.8, 0);
    A.pop('.on', A.cue('ओबेरॉय'));
    A.fadeIn('.rp', A.cue('नरीमन हाउस') - 0.3, 0.8, 0);
    A.pop('.nh', A.cue('यहूदी'));
    A.pop('.sandra', A.cue('सैंड्रा'));
    A.tween('.carry', A.cue('गोद'), 4, { x: 0, opacity: 1 }, { x: 330, opacity: 1 }, 'power1.inOut');
    A.pop('.moshe', A.cue('मोशे'));
    A.pop('.par', A.cue('माता-पिता'));
    return { svg: `${L.sky(MU.MB.night)}${g('lp', clip('cl17', 60, 130, 860, 820, `${N(7)}${MU.sea(800)}${MU.tower(490, 860, 1.0, { lit: 0.5 })}`))}
      ${g('rp', clip('cl17b', 1000, 130, 860, 820, `${N(17)}${L.ground(880, '#3E3A40')}${MU.bldg(1300, 880, 420, 620, { sign: 'नरीमन हाउस', fill: '#C9B8A0', seed: 2, lit: 0.3 })}${g('carry', `${MU.civ(1380, 920, 0.9, 1)}${MU.civ(1340, 820, 0.42, 0, { child: true })}`)}`))}
      ${tag(490, 210, 'ओबेरॉय ट्राइडेंट, नरीमन पॉइंट', { size: 34, fill: P.snow, cls: 'tag on' })}${tag(1430, 210, 'नरीमन हाउस — यहूदी केंद्र', { size: 34, fill: P.snow, cls: 'tag nh' })}
      ${tag(1630, 560, 'सैंड्रा सैमुअल (आया)', { size: 34, fill: P.amber3, cls: 'tag sandra' })}${tag(1630, 660, 'नन्हा मोशे, 2 साल', { size: 32, fill: P.snow, cls: 'tag moshe' })}${tag(1430, 1010, 'मोशे के माता-पिता हमले में मारे गए', { size: 30, fill: P.paper, cls: 'tag par' })}` };
  },

  s18(A) {
    A.fadeIn('.tvb', 0.3, 0.8, 20);
    A.loop('.tvb .live', { opacity: 1 }, { opacity: 0.3 }, 0.5);
    A.pop('.cm', A.cue('कमांडो'));
    A.draw('.link', A.cue('हैंडलर') - 0.4, 1.4);
    A.pop('.border', A.cue('सरहद'));
    A.pop('.ph', A.cue('फ़ोन'));
    A.pop('.ph .sig .w', A.cue('फ़ोन') + 0.4, 0.4, 0.2);
    A.pop('.rule', A.cue('नियम'), 0.8);
    const inner = `${clip('cl18', 300, 300, 720, 440, `${N(18)}${MU.tajHotel(660, 760, 0.55, { fire: true, lit: 0.4 })}${MU.commando(420, 740, 0.5)}${MU.commando(480, 740, 0.5, 1)}`)}`;
    return { svg: `${L.sky()}${MU.tv(300, 300, 720, 440, inner, 'tv tvb')}${tag(660, 220, 'कमांडो की हर हरकत — लाइव', { size: 38, fill: P.snow, cls: 'tag cm' })}
      <path class="link" d="M1050 520C1250 420 1380 640 1560 520" pathLength="1" stroke-dasharray="1" stroke="${P.brick}" stroke-width="7" fill="none"/>${g('border', `<line x1="1300" y1="160" x2="1300" y2="900" stroke="${P.ink2}" stroke-width="5" stroke-dasharray="20 14"/>${txt(1300, 140, 'सरहद पार', { size: 34, color: P.ink2 })}`)}
      ${g('ph', `${MU.satphone(1640, 560, 1.4)}${txt(1640, 720, 'हैंडलर', { size: 36 })}${X.signal(1600, 380, 1400, 300, 3)}`)}
      ${g('rule', `${L.paperCard(1180, 800, 680, 150, '', { fill: '#F5EEDC' })}${txt(1520, 890, 'नए नियम: ऐसे ऑपरेशन का लाइव प्रसारण नहीं', { size: 32 })}`)}` };
  },

  s19(A) {
    const m = mp(VI);
    mapCam(A, 1.0, 1.07, 0);
    A.pop('.ms', A.cue('मानेसर'));
    A.pop('.nsgt', A.cue('एनएसजी'));
    A.pop('.only', A.cue('मानेसर'));
    arrowIn(A, '.ar3', A.cue('विमान'), 2.4);
    A.pop('.clk', A.cue('देर'));
    A.tween('.clk .minute', A.cue('देर'), 4, { rotation: 0, svgOrigin: '1640 640' }, { rotation: 1080, svgOrigin: '1640 640' }, 'none');
    A.pop('.morn', A.cue('सुबह'));
    A.pop('.mar', A.cue('मार्कोस'));
    return { svg: `${m.base()}${M.regionLabel(m, 'भारत', 79, 22, { size: 70, color: P.brick, op: 0.5 })}${pl(m, 'मानेसर (दिल्ली के पास)', 'manesar', { cls: 'place ms' })}${pl(m, 'मुंबई', 'mumbai', { anchor: 'end', dx: -18 })}${M.arrow(m, PL.manesar, PL.mumbai, { cls: 'arrow ar3', bend: 0.2, w: 10 })}
      ${tag(420, 190, 'NSG — नेशनल सिक्योरिटी गार्ड', { size: 38, fill: P.ink, color: P.snow, cls: 'tag nsgt' })}${tag(420, 300, '2008: सिर्फ़ एक ठिकाना', { size: 34, fill: P.snow, cls: 'tag only' })}
      ${L.clock(1640, 640, 100, 'clock clk')}${tag(1640, 800, 'विमान में देरी', { size: 34, fill: P.snow, cls: 'tag clk' })}${tag(1640, 900, 'अगली सुबह पहुँचे', { size: 34, fill: P.amber3, cls: 'tag morn' })}${tag(420, 960, 'तब तक: मुंबई पुलिस + नौसेना के मार्कोस', { size: 32, fill: P.snow, cls: 'tag mar' })}` };
  },

  s20(A) {
    year(A, 0.4);
    A.fadeIn('.opn', A.cue('ब्लैक'), 0.9, 20);
    A.pop('.rooms', A.cue('सैकड़ों'));
    A.tween('.heli', A.cue('हेलीकॉप्टर') - 0.5, 2.5, { x: -900, y: -100 }, { x: 0, y: 0 }, 'power2.out');
    A.loop('.heli .rotor', { scaleX: 1, ...C }, { scaleX: 0.2, ...C }, 0.08);
    A.draw('.rope', A.cue('छत'), 0.8);
    A.tween('.drop .fig', A.cue('छत') + 0.6, 1.6, { y: -200, opacity: 0 }, { y: 0, opacity: 1 }, 'power1.out', { stagger: 0.4 });
    A.pop('.ok1', A.cue('ओबेरॉय')); A.pop('.ok2', A.cue('आज़ाद'));
    let cm = ''; for (let i = 0; i < 4; i++) cm += MU.commando(680 + i * 105, 1000, 0.85, i);
    return { svg: `${L.sky('url(#mdawn)')}${L.ground(1000, '#6A6258')}${MU.bldg(1300, 1000, 460, 520, { sign: 'नरीमन हाउस', fill: '#C9B8A0', seed: 2, lit: 0.2 })}${cm}
      ${E.helicopter(1400, 260, 0.9)}<line class="rope" x1="1300" y1="290" x2="1300" y2="480" pathLength="1" stroke-dasharray="1" stroke="${P.ink}" stroke-width="4"/>${g('drop', `${MU.commando(1230, 480, 0.6, 0)}${MU.commando(1330, 480, 0.6, 1)}`)}
      ${big(960, 150, 'ऑपरेशन ब्लैक टॉरनेडो', { size: 80, color: P.snow, cls: 'opn' })}${tag(500, 360, 'सैकड़ों कमरे, अंदर फँसे लोग', { size: 34, fill: P.snow, cls: 'tag rooms' })}
      ${tag(500, 470, 'ओबेरॉय — आज़ाद', { size: 34, fill: '#9FD08A', cls: 'tag ok1' })}${tag(500, 570, 'नरीमन हाउस — आज़ाद', { size: 34, fill: '#9FD08A', cls: 'tag ok2' })}`, over: yr('27–28 नवंबर') };
  },

  s21(A) {
    letterbox(A, 0);
    A.tween('.team', 0.2, 4, { x: -200 }, { x: 60 }, 'power1.out');
    A.pop('.sn', A.cue('संदीप'), 0.8);
    A.fadeIn('.quote', A.cue('ऊपर'), 1.0, 20);
    A.fadeOut('.team', A.cue('वापस'), 1.2);
    A.pop('.gb', A.cue('गजेंद्र'), 0.8);
    A.pop('.med', A.cue('अशोक'), 0.8, 0.3);
    let corr = '';
    for (let i = 0; i < 6; i++) { const s = 1 - i * 0.14; corr += `<rect x="${960 - 760 * s}" y="${540 - 460 * s}" width="${1520 * s}" height="${920 * s}" fill="none" stroke="#5A5248" stroke-width="${10 * s}"/>`; }
    let team = ''; for (let i = 0; i < 3; i++) team += MU.commando(380 + i * 120, 1000, 1.0, i);
    return { svg: `<rect x="-200" y="-200" width="2320" height="1480" fill="#2A2622"/>${corr}<rect x="860" y="380" width="200" height="260" fill="#4A4038"/>${g('team', team)}
      ${big(1180, 300, '"ऊपर मत आना,', { size: 66, color: P.snow, cls: 'quote' })}${big(1180, 400, 'मैं इन्हें संभाल लूँगा"', { size: 66, color: P.amber3, cls: 'quote' })}
      ${tag(1180, 520, 'मेजर संदीप उन्नीकृष्णन, NSG', { size: 38, fill: P.snow, cls: 'tag sn' })}${tag(1180, 640, 'हवलदार गजेंद्र सिंह बिष्ट, NSG', { size: 36, fill: P.snow, cls: 'tag gb' })}
      ${MU.medal(1080, 790, 0.75, 'medal med')}${MU.medal(1280, 790, 0.75, 'medal med')}${txt(1180, 925, 'अशोक चक्र (मरणोपरांत)', { size: 32, color: P.amber3, cls: 'med' })}`, over: LB };
  },

  s22(A) {
    year(A, 0.4); waves(A);
    A.tween('.sunr', 0, A.dur, { y: 120 }, { y: -60 }, 'sine.out');
    A.pop('.h60', A.cue('साठ घंटे'), 0.9);
    A.pop('.st1', A.cue('छियासठ')); A.pop('.st2', A.cue('अठारह')); A.pop('.st3', A.cue('देशों')); A.pop('.st4', A.cue('नौ'));
    return { svg: `${L.sky('url(#mdawn)')}${g('sunr', L.sun(1500, 640, 120))}${MU.sea(860, P.slate)}${MU.tajHotel(1150, 860, 0.95, { lit: 0.05 })}
      ${big(400, 200, '~60 घंटे', { size: 120, color: P.snow, cls: 'h60' })}
      ${tag(400, 340, '166 लोगों की जान गई', { size: 40, fill: P.ink, color: P.snow, cls: 'tag st1' })}${tag(400, 445, 'इनमें 18 सुरक्षाकर्मी', { size: 36, fill: P.snow, cls: 'tag st2' })}${tag(400, 540, 'कई देशों के नागरिक', { size: 34, fill: P.snow, cls: 'tag st3' })}${tag(400, 635, '9 हमलावर मारे गए, 1 ज़िंदा पकड़ा', { size: 32, fill: P.paper, cls: 'tag st4' })}`, over: yr('29 नवंबर', 'सुबह ~8:00') };
  },

  s23(A) {
    A.fadeIn('.room', 0.3, 0.8, 0);
    A.pop('.q', A.cue('कौन'));
    A.pop('.sac', A.cue('ओंबले'));
    A.pop('.i1', A.cue('गाँव')); A.pop('.i2', A.cue('ट्रेनिंग')); A.pop('.i3', A.cue('हैंडलरों'));
    A.fadeIn('.tape', A.cue('रिकॉर्डिंग'), 0.7, 20);
    A.loop('.reel', { rotation: 0, ...C }, { rotation: 360, ...C }, 1.5, 0, 'none');
    A.pop('.tape .sig .w', A.cue('निर्देश'), 0.4, 0.2);
    const reel = (x) => g('reel', `<circle cx="${x}" cy="800" r="44" fill="${P.paper2}" ${Sthin}/><path d="M${x - 30} 800H${x + 30}M${x} 770V830" stroke="${P.ink}" stroke-width="5"/>`);
    return { svg: `<rect x="-200" y="-200" width="2320" height="1480" fill="#3A3530"/>${g('room', `<path d="M300 -50L460 120H760L920 -50" fill="#F3D29A" opacity="0.35"/><rect x="560" y="80" width="100" height="40" fill="${P.ink}"/>${MU.shade(610, 716, 1.4, 0)}<rect x="260" y="640" width="700" height="40" fill="${P.mol2}" ${S}/><path d="M300 680v300M920 680v300" stroke="${P.mol2}" stroke-width="14"/>`)}
      ${tag(610, 220, 'ये लोग कौन थे?', { size: 44, fill: P.snow, cls: 'tag q' })}${tag(1500, 160, 'ओंबले की क़ुर्बानी = सबसे बड़ा सबूत', { size: 34, fill: P.amber3, cls: 'tag sac' })}
      ${tag(1500, 280, 'अपना गाँव', { size: 34, fill: P.snow, cls: 'tag i1' })}${tag(1500, 370, 'ट्रेनिंग', { size: 34, fill: P.snow, cls: 'tag i2' })}${tag(1500, 460, 'हैंडलर', { size: 34, fill: P.snow, cls: 'tag i3' })}
      ${g('tape', `<rect x="1240" y="720" width="440" height="180" rx="16" fill="${P.ink2}" ${S}/>${reel(1360)}${reel(1560)}${txt(1460, 960, 'फ़ोन बातचीत की रिकॉर्डिंग', { size: 30, color: P.snow })}${X.signal(1700, 760, 1860, 620, 3)}`)}` };
  },

  s24(A) {
    A.pop('.deny', A.cue('इनकार'));
    A.fadeOut('.deny', A.cue('लेकिन') - 0.2, 0.4);
    A.pop('.cal', A.cue('फ़रवरी'));
    A.slideIn('.np', A.cue('माना'), 1.0, 400);
    A.pop('.hi', A.cue('हिस्सा'));
    A.pop('.trial', A.cue('मुक़दमा'));
    A.pop('.stuck', A.cue('नतीजे'), 0.8);
    return { svg: `${L.sky()}${L.ground(940)}${tag(560, 300, 'पहले: इनकार', { size: 48, fill: P.snow, cls: 'tag deny' })}${cal(300, 360, 'फ़रवरी', '12', '2009')}
      ${g('np', L.newspaper(760, 160, 820, 600, 'THE DAILY NEWS', 'PAKISTAN ADMITS', 'Part of Mumbai attack plot was hatched on its soil', { headSize: 74 }))}${tag(1170, 830, 'पाकिस्तान सरकार ने माना: साज़िश का हिस्सा पाकिस्तान में रचा गया', { size: 32, fill: P.amber3, cls: 'tag hi' })}
      ${tag(450, 960, 'वहाँ भी मुक़दमा चला…', { size: 34, fill: P.snow, cls: 'tag trial' })}${tag(1170, 960, '…पर आज तक कोई नतीजा नहीं', { size: 34, fill: P.brick2, color: P.snow, cls: 'tag stuck' })}` };
  },

  s25(A) {
    A.fadeIn('.court', 0.3, 0.8, 0);
    A.pop('.lw', A.cue('वकील'));
    A.pop('.cal', A.cue('मई'));
    A.pop('.gavel', A.cue('सुनाई'));
    A.tween('.gavel', A.cue('सुनाई') + 0.6, 0.25, { rotation: 0, svgOrigin: '1640 700' }, { rotation: -25, svgOrigin: '1640 700' }, 'power2.in', { repeat: 1, yoyo: true });
    A.pop('.hc', A.cue('हाई')); A.pop('.sc', A.cue('सुप्रीम'));
    A.pop('.ex', A.cue('इक्कीस'), 0.8);
    return { svg: `${L.sky()}${L.ground(900)}${g('court', I.colonial(500, 900, 1.2, 'gov'))}${txt(780, 990, 'खुली अदालत, वकील, हर सबूत की जाँच', { size: 32, cls: 'lw' })}
      ${cal(1480, 160, 'मई', '6', '2010')}${L.gavel(1600, 700, 1.0)}${tag(1530, 600, 'हाई कोर्ट: सज़ा बरक़रार (2011)', { size: 30, fill: P.snow, cls: 'tag hc' })}${tag(1530, 840, 'सुप्रीम कोर्ट: सज़ा बरक़रार (2012)', { size: 30, fill: P.snow, cls: 'tag sc' })}
      ${tag(780, 180, '21 नवंबर 2012 — यरवदा जेल, पुणे', { size: 40, fill: P.ink, color: P.snow, cls: 'tag ex' })}` };
  },

  s26(A) {
    A.fadeIn('.us', 0.3, 0.8, 0);
    A.pop('.arr', A.cue('गिरफ़्तार'));
    A.pop('.jail', A.cue('क़बूल'));
    A.pop('.y35', A.cue('पैंतीस'));
    A.pop('.vscr', A.cue('वीडियो'), 0.8);
    A.pop('.layers', A.cue('परतें'));
    let bars = ''; for (let i = 0; i < 7; i++) bars += `<rect x="${250 + i * 60}" y="420" width="14" height="480" fill="${P.ink2}"/>`;
    return { svg: `${L.sky()}${g('us', L.skyline(-100, 2100, 900, 21, { minH: 260, varH: 300, colors: [P.slate2, P.slate3, P.paper3, P.slate] }))}<rect x="-200" y="900" width="2320" height="400" fill="${P.paper3}"/>
      ${g('jail', `<rect x="220" y="400" width="440" height="520" fill="${P.paper2}" ${S}/>${L.person(440, 900, 1.3, { coat: '#D97A2B', hat: 'none', skin: '#E2B48C' })}${bars}`)}${tag(440, 320, 'हेडली — अमेरिका में गिरफ़्तार (2009)', { size: 34, fill: P.snow, cls: 'tag arr' })}${tag(440, 1000, 'जुर्म क़बूल, 35 साल की सज़ा', { size: 34, fill: P.amber3, cls: 'tag y35' })}
      ${X.screen(1060, 300, 680, 420, `${L.person(1400, 680, 1.2, { coat: '#D97A2B', hat: 'none', skin: '#E2B48C' })}`, 'screen vscr')}${tag(1400, 800, '2016: वीडियो लिंक से मुंबई की अदालत में गवाही', { size: 32, fill: P.snow, cls: 'tag vscr' })}${tag(1400, 900, 'साज़िश की परतें खुलीं', { size: 32, fill: P.paper, cls: 'tag layers' })}` };
  },

  s27(A) {
    A.pop('.w1', A.cue('समुद्र')); A.pop('.w2', A.cue('तालमेल')); A.pop('.w3', A.cue('दूर'));
    A.fadeOut('.w1, .w2, .w3', A.cue('सिर्फ़') - 0.2, 0.4);
    A.fadeIn('.parl', A.cue('संसद'), 0.8, 30);
    A.slideIn('.nia', A.cue('एनआईए'), 1.0, 400);
    A.pop('.nat', A.cue('पूरे देश'));
    return { svg: `${L.sky()}${L.ground(900)}${tag(960, 260, 'समुद्र की निगरानी कमज़ोर', { size: 44, fill: P.snow, cls: 'tag w1' })}${tag(960, 400, 'एजेंसियों में तालमेल नहीं', { size: 44, fill: P.snow, cls: 'tag w2' })}${tag(960, 540, 'कमांडो दूर', { size: 44, fill: P.snow, cls: 'tag w3' })}
      ${E.parliament(620, 900, 1.0)}${g('nia', `${L.paperCard(1180, 230, 560, 520, '', { fill: '#F5EEDC' })}${big(1460, 380, 'NIA', { size: 120, color: P.brick })}${txt(1460, 470, 'राष्ट्रीय जाँच एजेंसी', { size: 40 })}${txt(1460, 540, 'क़ानून: दिसंबर 2008', { size: 34, color: P.ink2 })}`)}
      ${tag(1460, 830, 'पूरे देश में आतंकवाद के मामलों की जाँच', { size: 32, fill: P.amber3, cls: 'tag nat' })}` };
  },

  s28(A) {
    const m = mp(VI);
    mapCam(A, 1.0, 1.06, 0);
    A.pop('.place.h0', 0.3);
    A.pop('.place.h1', A.cue('मुंबई')); A.pop('.place.h2', A.cue('चेन्नई')); A.pop('.place.h3', A.cue('कोलकाता')); A.pop('.place.h4', A.cue('हैदराबाद'));
    A.pop('.hub', A.cue('घंटों'));
    A.pop('.cg', A.cue('तटरक्षक'));
    A.pop('.radar', A.cue('रडार'), 0.5, 0.15);
    A.pop('.boats', A.cue('पहचान'));
    A.pop('.f1', A.cue('फ़ोर्स'));
    const radar = ['okha', 'veraval', 'ratnagiri', 'goa', 'mangalore', 'kochi'].map((k) => { const [x, y] = m.xy(...PL[k]); return g('radar', `<circle cx="${x - 26}" cy="${y}" r="12" fill="#2F7A46" stroke="${P.snow}" stroke-width="3"/><path d="M${x - 48} ${y - 22}a30 30 0 0 0 0 44M${x - 62} ${y - 34}a48 48 0 0 0 0 68" stroke="#2F7A46" stroke-width="4" fill="none"/>`); }).join('');
    const H = (n, k, i, o = {}) => pl(m, n, k, { cls: `place h${i}`, color: '#1B2230', r: 14, ...o });
    return { svg: `${m.base()}${M.regionLabel(m, 'भारत', 79, 22, { size: 70, color: P.brick, op: 0.4 })}${H('मानेसर', 'manesar', 0)}${H('मुंबई', 'mumbai', 1, { anchor: 'end', dx: -20 })}${H('चेन्नई', 'chennai', 2)}${H('कोलकाता', 'kolkata', 3)}${H('हैदराबाद', 'hyderabad', 4)}${radar}
      ${tag(1480, 200, 'NSG के नए ठिकाने — कमांडो घंटों में', { size: 32, fill: P.snow, cls: 'tag hub' })}${tag(1480, 310, 'तटरक्षक बल को बड़ी ज़िम्मेदारी', { size: 32, fill: P.snow, cls: 'tag cg' })}${tag(1480, 420, 'मछली नावों की पहचान के नियम', { size: 30, fill: P.paper, cls: 'tag boats' })}${tag(1480, 900, 'महाराष्ट्र: फ़ोर्स वन', { size: 36, fill: P.amber3, cls: 'tag f1' })}` };
  },

  s29(A) {
    A.pop('.r1', A.cue('गृह मंत्री'), 0.6); A.pop('.r2', A.cue('मुख्यमंत्री'), 0.6); A.pop('.r3', A.cue('राज्य'), 0.6);
    A.pop('.rs', A.cue('इस्तीफ़ा'), 0.6, 0.2);
    A.fadeOut('.r1, .r2, .r3, .rs', A.cue('हौसला') - 0.3, 0.5);
    A.slideIn('.train', A.cue('लोकल'), 2.0, -1400);
    A.fadeIn('.re', A.cue('इक्कीस') - 0.3, 0.8, 0);
    A.pop('.ret', A.cue('दरवाज़े'));
    const card = (x, n, role, cls) => g(cls, `${L.paperCard(x - 220, 220, 440, 300, '', { fill: '#F5EEDC' })}${txt(x, 330, n, { size: 38 })}${txt(x, 390, role, { size: 28, color: P.ink2 })}`);
    return { svg: `${L.sky()}${L.ground(940)}${card(420, 'शिवराज पाटिल', 'केंद्रीय गृह मंत्री', 'rc r1')}${card(960, 'विलासराव देशमुख', 'मुख्यमंत्री, महाराष्ट्र', 'rc r2')}${card(1500, 'आर. आर. पाटिल', 'गृह मंत्री, महाराष्ट्र', 'rc r3')}
      ${g('rs', `${tag(420, 480, 'इस्तीफ़ा', { size: 36, fill: P.brick2, color: P.snow })}${tag(960, 480, 'इस्तीफ़ा', { size: 36, fill: P.brick2, color: P.snow })}${tag(1500, 480, 'इस्तीफ़ा', { size: 36, fill: P.brick2, color: P.snow })}`)}
      ${g('train', `${L.trainCar(60, 940, 380, 'tc', '#7A3E5A')}${L.trainCar(460, 940, 380, 'tc', '#7A3E5A')}`)}${g('re', MU.tajHotel(1450, 940, 0.62, { lit: 0.8 }))}${tag(1450, 360, 'ताज फिर खुला: 21 दिसंबर 2008', { size: 36, fill: P.amber3, cls: 'tag ret' })}` };
  },

  s30(A) {
    A.pop('.cal1', A.cue('अप्रैल'));
    A.draw('.flight', A.cue('अमेरिका') - 0.2, 1.8);
    A.pop('.fl', A.cue('अमेरिका'));
    A.fadeIn('.court', A.cue('तिहाड़'), 0.8, 0);
    A.pop('.th', A.cue('तिहाड़'));
    A.pop('.nia', A.cue('विशेष'));
    A.pop('.cal2', A.cue('नवंबर'));
    A.pop('.acc', A.cue('आरोपी'), 0.8);
    return { svg: `${L.sky()}${L.ground(920)}${cal(160, 160, 'अप्रैल', '10', '2025').replace('class="cal"', 'class="cal cal1"')}<path class="flight" d="M520 300C800 140 1100 160 1380 300" pathLength="1" stroke-dasharray="1" stroke="${P.brick}" stroke-width="7" fill="none"/>${txt(950, 150, 'अमेरिका से भारत लाया गया', { size: 34, cls: 'fl' })}
      ${g('court', I.colonial(720, 920, 1.0, 'gov'))}${tag(950, 440, 'तिहाड़ जेल, दिल्ली', { size: 34, fill: P.snow, cls: 'tag th' })}${tag(950, 1000, 'NIA विशेष अदालत — सुनवाई जारी', { size: 34, fill: P.snow, cls: 'tag nia' })}
      ${cal(1460, 160, 'नवंबर', '17', '2026').replace('class="cal"', 'class="cal cal2"')}${tag(1610, 580, 'तहव्वुर राणा', { size: 38, fill: P.ink, color: P.snow, cls: 'tag acc' })}${tag(1610, 680, 'आरोपी — फ़ैसला अभी बाक़ी', { size: 32, fill: P.amber3, cls: 'tag acc' })}` };
  },

  s31(A) {
    A.pop('.a1', A.cue('कमज़ोरियों'), 0.7);
    A.pop('.a1b', A.cue('खुला'), 0.5);
    A.pop('.a2', A.cue('साठ घंटे'), 0.7);
    A.pop('.a3', A.cue('ढाँचा'), 0.7);
    const card = (y, n, t, sub, cls) => g(cls, `<rect x="260" y="${y}" width="1400" height="190" rx="16" fill="#F5EEDC" ${S}/>${big(370, y + 125, n, { size: 90, color: P.brick })}${txt(1000, y + 85, t, { size: 42 })}${sub ? g(cls + 'b', txt(1000, y + 145, sub, { size: 30, color: P.ink2 })) : ''}`);
    return { svg: `${L.sky()}${card(150, '1', '10 लोग: उस वक़्त की कमज़ोरियों का फ़ायदा', 'खुला समुद्र · दूर कमांडो · बिखरी जानकारी', 'a1')}${card(420, '2', '60 घंटे: फँसे लोगों को बचाते हुए, कमरा-कमरा', '', 'a2')}${card(690, '3', 'उसके बाद: सुरक्षा का पूरा ढाँचा बदला', '', 'a3')}` };
  },

  s32(A) {
    letterbox(A, 0); waves(A); flicker(A);
    A.pop('.cdl .candle', 0.5, 0.6, 0.12);
    ['n1', 'n2', 'n3', 'n4', 'n5'].forEach((c, i) => A.fadeIn(`.${c}`, A.cue(['ज़ेंडे', 'अंजलि', 'कर्मचारियों', 'सैंड्रा', 'ओंबले'][i]), 0.8, 20));
    A.fadeIn('.yad', A.cue('याद'), 1.0, 20);
    A.fadeIn('.end', A.cue('हम भी'), 1.2, 0);
    A.camera({ scale: 1.06, x: 0 }, { scale: 1.0, x: 0 });
    let cdl = ''; for (let i = 0; i < 11; i++) cdl += MU.candle(200 + i * 152, 1000 + (i % 2) * 14, 0.75);
    const nm = ['विष्णु ज़ेंडे', 'अंजलि कुलथे', 'ताज के कर्मचारी', 'सैंड्रा सैमुअल', 'तुकाराम ओंबले'];
    return { svg: `${N(32)}${MU.sea(760)}${MU.tajHotel(1260, 760, 0.62, { lit: 0.7 })}${MU.gateway(560, 770, 0.6)}${g('cdl', cdl)}
      ${nm.map((n, i) => txt(i < 3 ? 400 + i * 560 : 680 + (i - 3) * 560, 180 + Math.floor(i / 3) * 80, n, { size: 44, color: P.snow, cls: `n${i + 1}` })).join('')}
      ${big(960, 470, 'हर 26 नवंबर — मुंबई याद करती है', { size: 60, color: P.amber3, cls: 'yad' })}${txt(960, 860, '26/11 के सभी पीड़ितों और शहीदों को श्रद्धांजलि', { size: 34, color: P.snow, cls: 'end' })}`, over: LB };
  },
};

export function sfx(clips) {
  const by = Object.fromEntries(clips.filter((c) => c.kind === 'scene').map((c) => [c.id, c]));
  const total = clips.at(-1).start + clips.at(-1).dur;
  const span = (a, b) => ({ start: by[a].start, dur: by[b].start + by[b].dur - by[a].start });
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(900, total), vol: 0.15, fadeIn: 2, fadeOut: 5 },
    { id: 'fx_sea1', file: 'sea.wav', start: 0, dur: by.s01.dur, vol: 0.35, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_sea2', file: 'sea.wav', ...span('s06', 's07'), vol: 0.25, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_hb1', file: 'heartbeat.wav', start: by.s08.start, dur: by.s08.dur, vol: 0.35, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_sir1', file: 'siren.wav', start: by.s10.start, dur: Math.min(20, by.s10.dur), vol: 0.22, fadeIn: 2, fadeOut: 3 },
    { id: 'fx_sir2', file: 'siren.wav', start: by.s12.start, dur: Math.min(20, by.s12.dur), vol: 0.18, fadeIn: 2, fadeOut: 3 },
    { id: 'fx_hb2', file: 'heartbeat.wav', start: by.s13.start, dur: by.s13.dur, vol: 0.32, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_wind1', file: 'wind.wav', start: by.s16.start, dur: by.s16.dur, vol: 0.3, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_tick', file: 'tick.wav', start: by.s19.start, dur: Math.min(30, by.s19.dur), vol: 0.3, fadeIn: 0.5, fadeOut: 1 },
    { id: 'fx_dr', file: 'drums.wav', start: by.s20.start, dur: by.s20.dur, vol: 0.4, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_bell1', file: 'bell.wav', start: by.s21.start + by.s21.dur - 9, dur: 8, vol: 0.4 },
    { id: 'fx_bell2', file: 'bell.wav', start: by.s32.start + 1, dur: 8, vol: 0.45 },
    { id: 'fx_bell3', file: 'bell.wav', start: by.s32.start + by.s32.dur - 8, dur: 8, vol: 0.45 },
  ];
}
