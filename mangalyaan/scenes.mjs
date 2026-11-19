// मंगलयान — scene builders (Hindi).
import * as L from '../lib/inkamber.mjs';
import * as X from '../lib/space.mjs';
import * as I from '../lib/india.mjs';
const { P, g, S, Sthin, shadow } = L;

export const title = 'मंगलयान';
export const defs = X.spaceDefs;
export const fonts = [['Baloo 2', 'baloo-2-devanagari-800-normal.woff2', 800], ['Mukta', 'mukta-devanagari-500-normal.woff2', 500], ['Mukta', 'mukta-devanagari-700-normal.woff2', 700]];
export const css = `.lower{font-family:'Mukta','Special Elite';font-weight:700;letter-spacing:0}`;
const HF = "'Baloo 2', Oswald", HT = "'Mukta', Oswald";
const lbl = (x, y, t, o = {}) => L.label(x, y, t, { font: HF, weight: 800, size: 60, ...o });
const txt = (x, y, t, o = {}) => L.label(x, y, t, { font: HT, weight: 700, size: 40, ...o });
const tag = (x, y, t, o = {}) => L.tag(x, y, t, { font: HT, size: 40, w: o.w || [...t].length * (o.size || 40) * 0.55 + 70, ...o });
const lower = (a, b) => `<div class="lower">${a}${b ? ` · <b>${b}</b>` : ''}</div>`;
const TO = (o) => ({ transformOrigin: o });
const C = TO('50% 50%'), B = TO('50% 100%');

export const chapters = {
  s05: [1, 'सपना'], s10: [2, 'छोटा रॉकेट, बड़ी तरकीब'], s16: [3, 'तीन सौ दिनों का सफ़र'], s18: [4, 'चौबीस सितंबर'],
  s22: [5, 'दुनिया की नज़र'], s24: [6, 'छह महीने से आठ साल'], s26: [7, 'जवाब'],
};
export const chapterSvg = (n, t) => `${X.spaceBg(n * 7, { nx: 1500, ny: 300 })}${X.mars(1600, 860, 300, { cls: 'mars chm' })}
  ${L.label(760, 430, `अध्याय ${n}`, { font: HT, weight: 700, size: 56, color: P.amber3, cls: 'chap-num' })}
  <line class="chap-rule" x1="460" y1="480" x2="1060" y2="480" stroke="${P.amber2}" stroke-width="4"/>
  ${L.label(760, 610, t, { font: HF, weight: 800, size: 120, color: P.snow, cls: 'chap-title' })}`;

function spaceAmbient(A) {
  A.drift('.stars1', 0, A.dur, { x: 0 }, { x: -20 });
  A.drift('.stars2', 0, A.dur, { x: 0 }, { x: -45 });
  A.drift('.stars3', 0, A.dur, { x: 0 }, { x: -90 });
  A.loop('.tw', { opacity: 0.3 }, { opacity: 1 }, 1.3);
  A.loop('.neb', { opacity: 0.7 }, { opacity: 1 }, 4);
}
function roomAmbient(A) {
  A.loop('.blip', { opacity: 0.2 }, { opacity: 1 }, 0.6);
  A.loop('.wallorbit', { strokeDashoffset: 0 }, { strokeDashoffset: -88 }, 3, 0, 'none');
}

export const scenes = {
  s01(A) {
    roomAmbient(A);
    A.fadeIn('.lower', 0.5, 0.8, 0); A.fadeOut('.lower', 6, 0.6);
    A.camera({ scale: 1.18, y: -60 }, { scale: 1.0, y: 0 });
    A.pop('.quiet', A.cue('किसी'));
    return { svg: `${X.controlRoom()}${tag(960, 520, 'साँसें थमी हुई हैं…', { size: 46, fill: P.snow, cls: 'tag quiet' })}`, over: lower('इसरो कंट्रोल रूम, बेंगलुरु', '24 सितंबर 2014') };
  },

  s02(A) {
    spaceAmbient(A);
    A.drift('.mom', 0, A.dur, { x: -120, y: 30 }, { x: 60, y: 0 }, 'none');
    A.pop('.dist', A.cue('करोड़ों'));
    A.pop('.sleep', A.cue('तीन सौ'));
    const tl = A.cue('निकल जाएगा');
    A.draw('.miss', tl - 0.4, 2);
    A.pop('.lost', A.cue('खो जाएगा'));
    A.camera({ scale: 1.0 }, { scale: 1.08, x: -40 });
    return { svg: `${X.spaceBg(3)}${X.mars(1450, 620, 330)}${X.mom(560, 420, 1.1)}
      ${X.arcPath('M620 520C900 740 1300 1040 1900 1100', 'miss', P.brick, 6)}
      ${tag(560, 150, 'करोड़ों किलोमीटर दूर', { size: 44, fill: P.snow, cls: 'tag dist' })}${tag(560, 250, 'इंजन ~300 दिनों से बंद', { size: 40, fill: P.amber3, cls: 'tag sleep' })}
      ${tag(1500, 160, 'चूके, तो हमेशा के लिए खो जाएगा', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag lost' })}` };
  },

  s03(A) {
    spaceAmbient(A);
    A.pop('.q1', A.cue('तो सवाल'), 0.7);
    A.pop('.q2', A.cue('और वो भी'), 0.7);
    A.pop('.clap', A.cue('हॉलीवुड'));
    return { svg: `${X.spaceBg(5)}${X.earth(380, 820, 220)}${X.mars(1600, 820, 200)}
      ${tag(960, 250, 'पहली ही कोशिश में मंगल तक कैसे?', { size: 60, fill: P.snow, cls: 'tag q1' })}${tag(960, 420, 'एक हॉलीवुड फ़िल्म से भी कम खर्च में?', { size: 46, fill: P.amber3, cls: 'tag q2' })}
      ${X.clapper(840, 640, 1, 'clap')}` };
  },

  s04(A) {
    spaceAmbient(A);
    A.fadeIn('.ttl', 0.2, 1.2, 40); A.fadeIn('.sub', 1, 1, 20);
    A.drift('.mom', 0, A.dur, { x: -300, y: 60, rotation: -8 }, { x: 80, y: 0, rotation: 4 }, 'sine.inOut');
    return { svg: `${X.spaceBg(9)}${X.mars(1560, 760, 380)}${X.mom(1150, 380, 0.9)}
      ${lbl(620, 470, 'मंगलयान', { size: 190, color: P.amber3, cls: 'ttl' })}${txt(620, 580, 'पहली ही कोशिश में लाल ग्रह तक', { size: 54, color: P.snow, cls: 'sub' })}${txt(620, 650, 'भारत का मंगल मिशन · 2013–2014', { size: 40, color: P.paper2, cls: 'sub' })}` };
  },

  s05(A) {
    spaceAmbient(A);
    A.pop('.half', A.cue('आधे'));
    A.tween('.fail', A.cue('नाकाम'), 1.2, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power2.out', { stagger: 0.08 });
    A.pop('.a1', A.cue('सोवियत')); A.pop('.a2', A.cue('नासा')); A.pop('.a3', A.cue('यूरोप'));
    A.pop('.none', A.cue('कोई भी देश'));
    let bars = ''; for (let i = 0; i < 10; i++) bars += `<rect class="fail" x="${180 + i * 70}" y="${i % 2 ? 520 : 420}" width="44" height="${i % 2 ? 300 : 400}" fill="${i % 2 ? P.brick : P.olive2}" ${Sthin}/>`;
    return { svg: `${X.spaceBg(11)}${X.mars(1520, 900, 260)}${bars}<line x1="150" y1="820" x2="900" y2="820" stroke="${P.paper}" stroke-width="4"/>
      ${tag(540, 200, 'लगभग आधे मंगल मिशन नाकाम', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag half' })}
      ${tag(1400, 160, 'सोवियत संघ', { size: 40, fill: P.snow, cls: 'tag a1' })}${tag(1400, 260, 'नासा (अमेरिका)', { size: 40, fill: P.snow, cls: 'tag a2' })}${tag(1400, 360, 'यूरोपीय स्पेस एजेंसी', { size: 40, fill: P.snow, cls: 'tag a3' })}
      ${tag(1400, 500, 'पहली कोशिश में कोई देश नहीं', { size: 40, fill: P.amber3, cls: 'tag none' })}` };
  },

  s06(A) {
    spaceAmbient(A);
    A.pop('.moonb', A.cue('चंद्रयान') - 0.3);
    A.drift('.c1', A.cue('चंद्रयान'), 3, { x: -300, y: 200, opacity: 0 }, { x: 0, y: 0, opacity: 1 }, 'power2.out');
    A.pop('.dream', A.cue('सपना'));
    A.draw('.toMars', A.cue('मंगल'), 1.6);
    A.pop('.ok', A.cue('मंज़ूरी'));
    return { svg: `${X.spaceBg(13)}${X.earth(300, 760, 200, { marker: true })}${X.moon(760, 520, 70)}${X.mars(1620, 320, 170)}
      <g class="c1">${X.mom(700, 420, 0.35, { cls: 'mom' })}</g>${L.label(760, 650, 'चंद्रयान · 2008', { font: HT, weight: 700, size: 36, color: P.snow })}
      ${X.arcPath('M820 470C1050 300 1300 260 1440 300', 'toMars', P.amber3, 6)}${tag(1200, 180, 'अगला सपना: मंगल', { size: 50, fill: P.amber3, cls: 'tag dream' })}
      ${L.stamp(1240, 760, 'मंज़ूर · 3 अगस्त 2012', { size: 50, cls: 'stamp ok', color: P.amber3 })}` };
  },

  s07(A) {
    spaceAmbient(A);
    A.drift('.earthO', 0, A.dur, { rotation: 0, ...TO('50% 50%') }, { rotation: 40, ...TO('50% 50%') });
    A.pop('.m26', A.cue('छब्बीस'));
    A.pop('.nov', A.cue('नवंबर'));
    A.pop('.cal', A.cue('पंद्रह महीने') - 0.2);
    A.tween('.bar', A.cue('पंद्रह महीने'), A.dur - A.cue('पंद्रह महीने'), { scaleX: 1, ...TO('0% 50%') }, { scaleX: 0.08, ...TO('0% 50%') }, 'none');
    A.pop('.miss', A.cue('चूक'));
    return { svg: `${X.spaceBg(17)}${X.sunGlow(960, 420, 120)}${X.ellipseOrbit(960, 420, 260, 260, 'o1')}${X.ellipseOrbit(960, 420, 420, 420, 'o2', { color: P.mars3 })}
      <g class="earthO">${X.earth(960 - 260, 420, 40)}</g>${X.mars(960 + 420, 420, 34)}
      ${tag(380, 120, 'हर 26 महीने में एक मौका', { size: 40, fill: P.snow, cls: 'tag m26' })}${tag(1560, 120, 'अगला: नवंबर 2013', { size: 40, fill: P.amber3, cls: 'tag nov' })}
      ${L.calendar(80, 760, 'समय', '15', 'महीने').replace('class="calendar"', 'class="cal"').replace(/font-family="Oswald"/g, `font-family="${HT}"`).replace(/font-family="Special Elite"/g, `font-family="${HT}"`)}
      <rect x="460" y="900" width="1000" height="50" fill="${P.ink}" ${Sthin}/><rect class="bar" x="460" y="900" width="1000" height="50" fill="${P.amber2}" ${Sthin}/>${txt(960, 1000, 'घड़ी चल रही है', { size: 36, color: P.snow })}
      ${tag(1560, 780, 'चूके तो, दो साल इंतज़ार', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag miss' })}` };
  },

  s08(A) {
    A.pop('.cost', A.cue('चार सौ पचास'));
    A.tween('.bar', A.cue('ग्रैविटी'), 1.4, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'back.out(1.2)', { stagger: 0.4 });
    A.fadeIn('.bars', A.cue('ग्रैविटी') - 0.3, 0.4, 0);
    A.fadeOut('.bars, .cost', A.cue('प्रधानमंत्री') - 0.3, 0.4);
    A.fadeIn('.rate', A.cue('प्रधानमंत्री'), 0.6, 20);
    A.slideIn('.auto', A.cue('ऑटो'), 1, 600);
    A.pop('.r7', A.cue('सात रुपये')); A.pop('.r10', A.cue('दस रुपये'));
    A.loop('.auto', { y: 0 }, { y: -4 }, 0.3, A.cue('ऑटो') + 1);
    return { svg: `${L.sky()}${L.ground(900)}${tag(960, 150, 'पूरा मिशन: ~₹450 करोड़ (~$73 मिलियन)', { size: 50, fill: P.amber3, cls: 'tag cost' })}
      ${g('bars', `${g('bar', `<rect x="560" y="430" width="260" height="470" fill="${P.ink2}" ${S}/>${txt(690, 410, 'फ़िल्म ग्रैविटी', { size: 38 })}${txt(690, 960, '~$100 मिलियन*', { size: 34 })}`)}${g('bar', `<rect x="1100" y="560" width="260" height="340" fill="${P.brick}" ${S}/>${txt(1230, 540, 'मंगलयान', { size: 40 })}${txt(1230, 960, '~$73 मिलियन', { size: 34 })}`)}`)}
      ${g('rate', `${X.mom(500, 400, 0.9)}${tag(500, 640, '₹7 / किमी', { size: 56, fill: P.amber3, cls: 'tag r7' })}${tag(1400, 640, '₹10 / किमी', { size: 56, fill: P.snow, cls: 'tag r10' })}`)}${X.autoRickshaw(1400, 880, 1.1)}` };
  },

  s09(A) {
    A.pop('.r1', A.cue('चंद्रयान')); A.pop('.r2', A.cue('भारत में')); A.pop('.r3', A.cue('सादा')); A.pop('.r4', A.cue('अठारह'));
    A.loop('.clock .minute', { rotation: 0, ...TO('50% 100%') }, { rotation: 360, ...TO('50% 100%') }, 1, A.cue('अठारह'), 'none');
    A.fadeIn('.mom', 0.2, 0.8, 0);
    A.loop('.mom', { y: 0 }, { y: -10 }, 1.6);
    return { svg: `${X.spaceBg(19, { nebula: false })}<rect x="-200" y="-200" width="2320" height="1480" fill="#2A2235" opacity="0.4"/>${X.mom(460, 520, 1.6)}
      ${tag(1330, 230, 'चंद्रयान का डिज़ाइन दोबारा', { size: 40, fill: P.snow, cls: 'tag r1' })}${tag(1330, 360, 'पुर्ज़े भारत में बने', { size: 40, fill: P.snow, cls: 'tag r2' })}${tag(1330, 490, 'सादा डिज़ाइन', { size: 40, fill: P.snow, cls: 'tag r3' })}${tag(1330, 620, 'रोज़ 18–20 घंटे काम', { size: 40, fill: P.amber3, cls: 'tag r4' })}
      ${L.clock(1330, 860, 100)}` };
  },

  s10(A) {
    A.fadeIn('.g', 0.3, 0.8, 30);
    A.pop('.f1', A.cue('दो बार'));
    A.fadeIn('.p', A.cue('छोटे रॉकेट') - 0.2, 0.8, 30);
    A.pop('.weak', A.cue('ताकतवर'));
    A.draw('.short', A.cue('सीधे'), 1.6);
    A.pop('.short-x', A.cue('फेंक'));
    return { svg: `${L.sky('url(#skyg)')}${L.ground(960)}
      <g class="g">${X.pslv(520, 960, 1.15, { cls: 'pslv gs' })}${L.stamp(520, 360, 'जी एस एल वी: 2010 में दो बार नाकाम', { size: 34, cls: 'stamp f1' })}</g>
      <g class="p">${X.pslv(1260, 960, 1.0)}${tag(1260, 120, 'पी एस एल वी', { size: 46, fill: P.snow })}</g>
      ${tag(1640, 360, 'सीधे मंगल के लिए कमज़ोर', { size: 36, fill: P.brick2, color: P.snow, cls: 'tag weak' })}
      ${X.arcPath('M1300 200Q1500 -40 1700 260', 'short', P.brick, 6)}${L.cross(1720, 280, 40, 'xmark short-x')}` };
  },

  s11(A) {
    spaceAmbient(A);
    A.draw('.o1', A.cue('अंडे'), 1.2);
    A.draw('.o2', A.cue('हर चक्कर'), 1.2); A.draw('.o3', A.cue('हर चक्कर') + 1.5, 1.2); A.draw('.o4', A.cue('और लंबी'), 1.2);
    A.pop('.fire', A.cue('जलेगा'), 0.4);
    A.loop('.fire', { scale: 0.7, ...C }, { scale: 1.2, ...C }, 0.25, A.cue('जलेगा'));
    A.fadeIn('.swing', A.cue('झूले') - 0.3, 0.6, 0);
    A.loop('.seat', { rotation: -35, ...TO('50% 0%') }, { rotation: 35, ...TO('50% 0%') }, 1.3, A.cue('झूले'));
    const el = (rx, ry, cls) => `<ellipse class="${cls}" cx="${480 + rx - 70}" cy="560" rx="${rx}" ry="${ry}" fill="none" stroke="#E9DCC0" stroke-width="4" pathLength="1" stroke-dasharray="1 1"/>`;
    return { svg: `${X.spaceBg(21)}${X.earth(410, 560, 60)}${el(160, 110, 'o1')}${el(320, 170, 'o2')}${el(560, 220, 'o3')}${el(860, 270, 'o4')}
      <circle class="fire" cx="${410 - 90}" cy="560" r="22" fill="url(#flameg)"/>${tag(410, 150, 'हर चक्कर में: पृथ्वी के पास इंजन जलाओ', { size: 38, fill: P.snow })}
      ${g('swing', `<rect x="1460" y="640" width="380" height="400" fill="${P.paper}" ${S}/><line x1="1500" y1="680" x2="1800" y2="680" stroke="${P.ink}" stroke-width="10"/><g class="seat"><line x1="1650" y1="680" x2="1650" y2="900" stroke="${P.ink}" stroke-width="5"/><rect x="1610" y="900" width="80" height="16" fill="${P.brick}" ${Sthin}/></g>${txt(1650, 1000, 'झूले की तरह!', { size: 40 })}`, shadow)}` };
  },

  s12(A) {
    A.fadeIn('.lower', 0.4, 0.6, 0); A.fadeOut('.lower', 6, 0.6);
    const tl = A.cue('उड़ान');
    A.pop('.fire', tl - 0.6, 0.4);
    A.loop('.fire', { scaleY: 0.85, ...TO('50% 0%') }, { scaleY: 1.15, ...TO('50% 0%') }, 0.12, tl - 0.2);
    A.drift('.pslv', tl, A.dur - tl, { y: 0 }, { y: -1500 }, 'power2.in');
    A.tween('.plume', tl - 0.6, 3, { scale: 0.3, opacity: 0, ...B }, { scale: 1.4, opacity: 1, ...B }, 'power2.out');
    A.tween('.cam', tl, 0.08, { x: 0 }, { x: 8 }, 'none', { repeat: 25, yoyo: true });
    A.pop('.ok', A.cue('सफल'));
    return { svg: `${L.sky('url(#dusk)')}<rect x="-200" y="900" width="2320" height="400" fill="${P.olive}" ${S}/>${X.launchTower(700, 900, 1)}${X.pslv(960, 900, 1.05, { fire: true })}${X.cloudsOfSmoke(960, 930, 10, 1.1)}
      ${L.stamp(1500, 300, 'लॉन्च सफल!', { size: 70, cls: 'stamp ok', color: P.olive })}`, over: lower('श्रीहरिकोटा', '5 नवंबर 2013 · दोपहर 2:38') };
  },

  s13(A) {
    spaceAmbient(A);
    ['.o1', '.o2', '.o3', '.o4', '.o5'].forEach((c, i) => A.draw(c, 0.5 + i * (A.dur - 3) / 5, 1.4));
    A.drift('.moms', 0.5, A.dur - 1, { x: 0 }, { x: 1080 }, 'power1.inOut');
    A.pop('.k24', A.cue('चौबीस हज़ार'));
    A.pop('.k2l', A.cue('दो लाख'));
    const el = (rx, ry, cls) => `<ellipse class="${cls}" cx="${300 + rx - 60}" cy="540" rx="${rx}" ry="${ry}" fill="none" stroke="#E9DCC0" stroke-width="3" pathLength="1" stroke-dasharray="1 1"/>`;
    return { svg: `${X.spaceBg(23)}${X.earth(300, 540, 50)}${el(130, 80, 'o1')}${el(260, 130, 'o2')}${el(440, 180, 'o3')}${el(700, 230, 'o4')}${el(1000, 280, 'o5')}
      <g class="moms">${X.mom(370, 540, 0.25, { cls: 'mini' })}</g>
      ${tag(560, 140, 'शुरुआत: ~24,000 किमी', { size: 40, fill: P.snow, cls: 'tag k24' })}${tag(1400, 140, 'आख़िर में: ~2,00,000 किमी', { size: 40, fill: P.amber3, cls: 'tag k2l' })}` };
  },

  s14(A) {
    roomAmbient(A);
    const tp = A.cue('गड़बड़');
    A.pop('.alarm', tp);
    A.loop('.alarm', { opacity: 0.3 }, { opacity: 1 }, 0.3, tp + 0.6);
    A.pop('.q', A.cue('एक चौथाई'));
    A.fadeOut('.alarm', A.cue('तुरंत') - 0.2, 0.3);
    A.pop('.fix', A.cue('अतिरिक्त'));
    return { svg: `${X.controlRoom()}<rect class="alarm" x="-200" y="-200" width="2320" height="1480" fill="${P.brick}" opacity="0.3"/>
      ${tag(960, 300, 'चौथा बर्न: गड़बड़!', { size: 60, fill: P.brick2, color: P.snow, cls: 'tag alarm2 alarm' })}
      ${tag(960, 460, 'रफ़्तार मिली: सिर्फ़ ¼ (35 / 135 मी/से)', { size: 40, fill: P.snow, cls: 'tag q' })}
      ${tag(960, 560, 'अगले दिन अतिरिक्त बर्न: रास्ता ठीक ✓', { size: 42, fill: P.amber3, cls: 'tag fix' })}` };
  },

  s15(A) {
    spaceAmbient(A);
    A.pop('.cal', 0.2);
    A.pop('.burn', A.cue('तेईस'));
    A.loop('.flame', { scaleY: 0.8, ...TO('50% 0%') }, { scaleY: 1.2, ...TO('50% 0%') }, 0.15, A.cue('जला'));
    A.drift('.ship', A.cue('छोड़ दिया') - 1, A.dur - A.cue('छोड़ दिया') + 1, { x: 0, y: 0, scale: 1 }, { x: 900, y: -260, scale: 0.4 }, 'power2.in');
    A.draw('.path', A.cue('छोड़ दिया') - 1, A.dur - A.cue('छोड़ दिया') + 1);
    A.pop('.next', A.cue('अगला पड़ाव'));
    return { svg: `${X.spaceBg(27)}${X.earth(300, 760, 260)}${X.mars(1780, 220, 60)}${X.arcPath('M620 520C900 380 1300 300 1760 230', 'path', P.amber3, 4)}
      <g class="ship">${X.mom(620, 520, 0.9, { flame: true })}</g>${L.calendar(1520, 640, 'दिसंबर', '1', '2013').replace('class="calendar"', 'class="cal"').replace(/font-family="Oswald"/g, `font-family="${HT}"`).replace(/font-family="Special Elite"/g, `font-family="${HT}"`)}
      ${tag(960, 140, '~23 मिनट का बर्न', { size: 46, fill: P.amber3, cls: 'tag burn' })}${tag(1500, 400, 'अगला पड़ाव: मंगल', { size: 44, fill: P.snow, cls: 'tag next' })}` };
  },

  s16(A) {
    spaceAmbient(A);
    A.draw('.path', 0.3, A.dur * 0.8);
    A.drift('.ship', 0.3, A.dur * 0.8, { x: 0, y: 0 }, { x: 1100, y: -260 }, 'none');
    A.pop('.km', A.cue('अठहत्तर करोड़'));
    A.pop('.dsn', A.cue('डीप स्पेस'));
    A.loop('.dish .w', { opacity: 0 }, { opacity: 1 }, 0.6, A.cue('डीप स्पेस'));
    A.pop('.prec', A.cue('सटीक'));
    return { svg: `${X.spaceBg(29)}${X.sunGlow(960, 560, 140)}${X.earth(330, 720, 70)}${X.mars(1600, 300, 70)}
      ${X.arcPath('M360 640C700 300 1200 180 1560 310', 'path', P.amber3, 4)}<g class="ship">${X.mom(420, 600, 0.3, { cls: 'mini' })}</g>
      ${tag(960, 950, '~78 करोड़ किमी · ~300 दिन', { size: 46, fill: P.amber3, cls: 'tag km' })}
      ${g('dish', `<path d="M140 1010q60 -70 120 0z" fill="${P.snow}" ${S}/><line x1="200" y1="990" x2="200" y2="1060" ${S}/>${X.signal(220, 960, 320, 760, 3, 'sig')}`)}${tag(560, 200, 'भारत का डीप स्पेस नेटवर्क + नासा', { size: 36, fill: P.snow, cls: 'tag dsn' })}
      ${tag(1480, 760, 'इतना सटीक: एक सुधार की ज़रूरत ही नहीं', { size: 36, fill: P.snow, cls: 'tag prec' })}` };
  },

  s17(A) {
    spaceAmbient(A);
    A.fadeIn('.mom', 0.2, 0.8, 0);
    A.pop('.zz', A.cue('सोया'));
    A.loop('.zz', { y: 0, opacity: 0.4 }, { y: -20, opacity: 1 }, 0.9, A.cue('सोया'));
    A.pop('.q', A.cue('जागेगा'));
    A.fadeOut('.zz, .q', A.cue('बाईस') - 0.3, 0.3);
    A.pop('.cal', A.cue('बाईस'));
    A.pop('.flame', A.cue('चार सेकंड'), 0.3);
    A.fadeOut('.flame', A.cue('चार सेकंड') + 3, 0.3);
    A.pop('.ok', A.cue('जल उठा'));
    return { svg: `${X.spaceBg(31)}${X.mars(1600, 760, 300)}${X.mom(700, 470, 1.6, { flame: true })}
      ${L.label(1000, 260, 'Z z z', { font: 'Playfair Display', weight: 900, size: 90, color: P.slate3, cls: 'zz' })}${tag(700, 900, 'क्या इंजन जागेगा?', { size: 50, fill: P.snow, cls: 'tag q' })}
      ${L.calendar(80, 80, 'सितंबर', '22', '2014').replace('class="calendar"', 'class="cal"').replace(/font-family="Oswald"/g, `font-family="${HT}"`).replace(/font-family="Special Elite"/g, `font-family="${HT}"`)}
      ${tag(700, 900, '4 सेकंड की जाँच: सफल ✓', { size: 50, fill: P.amber3, cls: 'tag ok' })}` };
  },

  s18(A) {
    spaceAmbient(A);
    A.draw('.sigline', A.cue('रेडियो'), 2);
    A.drift('.pulse', A.cue('रेडियो'), 4, { x: 0, y: 0 }, { x: -1100, y: 260 }, 'none');
    A.pop('.min', A.cue('साढ़े बारह'));
    A.pop('.auto', A.cue('ख़ुद'));
    return { svg: `${X.spaceBg(33)}${X.earth(330, 780, 120)}${X.mars(1560, 360, 150)}<path class="sigline" d="M1440 420L440 740" stroke="#9FD0E8" stroke-width="3" stroke-dasharray="1 1" pathLength="1" opacity="0.8"/>
      <circle class="pulse" cx="1440" cy="420" r="18" fill="#9FD0E8"/>${X.mom(1700, 160, 0.4, { cls: 'mini' })}
      ${tag(960, 140, 'संदेश को लगते थे ~12.5 मिनट', { size: 50, fill: P.amber3, cls: 'tag min' })}${tag(960, 1000, 'सारे निर्देश पहले से: यान सब कुछ ख़ुद करेगा', { size: 38, fill: P.snow, cls: 'tag auto' })}` };
  },

  s19(A) {
    spaceAmbient(A);
    A.pop('.flame', A.cue('जल उठा'), 0.3);
    A.loop('.flame', { scaleY: 0.85, ...TO('50% 0%') }, { scaleY: 1.15, ...TO('50% 0%') }, 0.15, A.cue('जल उठा'));
    A.drift('.ship', A.cue('पीछे') - 0.5, 3, { x: 0, opacity: 1 }, { x: 260, opacity: 0 }, 'power1.in');
    A.pop('.lost', A.cue('संपर्क'));
    A.loop('.lost', { opacity: 0.4 }, { opacity: 1 }, 0.5, A.cue('संपर्क') + 0.6);
    A.fadeIn('.room', A.cue('कंट्रोल रूम') - 0.3, 0.6, 0);
    A.pop('.t24', A.cue('चौबीस मिनट'));
    A.pop('.end', A.cue('ख़त्म'));
    return { svg: `${X.spaceBg(35)}${X.mars(1100, 620, 380)}<g class="ship">${X.mom(600, 330, 0.6, { flame: true })}</g>
      ${tag(560, 160, 'सिग्नल: — कोई संपर्क नहीं —', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag lost' })}
      ${g('room', `<rect x="1360" y="80" width="520" height="300" fill="#2A2235" ${S}/>${X.screen(1400, 120, 440, 220, `${L.label(1620, 250, 'इंतज़ार…', { font: HF, weight: 800, size: 70, color: '#9FD0E8' })}`)}`)}
      ${tag(1620, 440, 'इंजन: ~24 मिनट', { size: 40, fill: P.amber3, cls: 'tag t24' })}${tag(1620, 540, 'एक गलती… और सब ख़त्म', { size: 36, fill: P.snow, cls: 'tag end' })}` };
  },

  s20(A) {
    roomAmbient(A);
    const ts = A.cue('सिग्नल');
    A.pop('.sig', ts);
    A.loop('.sig', { scale: 0.95, ...C }, { scale: 1.05, ...C }, 0.4, ts + 0.6);
    A.pop('.orb', A.cue('कक्षा में था'));
    A.fadeIn('.cheer', A.cue('तालियों') - 0.2, 0.6, 0);
    A.loop('.cheer .person', { y: 0 }, { y: -26 }, 0.35, A.cue('तालियों'));
    A.pop('.conf', A.cue('तालियों'), 0.4, 0.03);
    A.drift('.conf', A.cue('तालियों'), A.dur - A.cue('तालियों'), { y: 0 }, { y: 400 }, 'none');
    let cf = ''; for (let i = 0; i < 40; i++) cf += `<rect class="conf" x="${(i * 97) % 1900}" y="${-40 + (i * 53) % 300}" width="14" height="24" fill="${[P.amber2, P.snow, P.olive2, P.brick2][i % 4]}" transform="rotate(${i * 37} ${(i * 97) % 1900} ${(i * 53) % 300})"/>`;
    let cheer = ''; for (let i = 0; i < 6; i++) cheer += i % 2 ? I.woman(260 + i * 280, 1060, 1.3, i, { pose: 'arms' }) : L.person(260 + i * 280, 1060, 1.3, { pose: 'arms', coat: [P.snow, P.slate3, P.paper2][i % 3], hat: 'none', skin: I.SKIN[i % 5] });
    return { svg: `${X.controlRoom()}${tag(960, 220, 'सिग्नल मिला!', { size: 80, fill: '#9FD0E8', cls: 'tag sig' })}${tag(960, 380, 'मंगलयान मंगल की कक्षा में ✓', { size: 56, fill: P.amber3, cls: 'tag orb' })}
      <g class="cheer">${cheer}</g>${cf}` };
  },

  s21(A) {
    spaceAmbient(A);
    A.drift('.orbitShip', 0, A.dur, { rotation: 0, ...TO('50% 50%') }, { rotation: 200, ...TO('50% 50%') }, 'none');
    A.pop('.r1', A.cue('एशियाई')); A.pop('.r2', A.cue('चौथी')); A.pop('.r3', A.cue('पहली ही कोशिश'));
    return { svg: `${X.spaceBg(37)}${X.mars(560, 560, 300)}<g class="orbitShip">${X.ellipseOrbit(560, 560, 420, 420, 'ring', { w: 3 })}${X.mom(980, 560, 0.3, { cls: 'mini' })}</g>
      ${tag(1460, 330, 'पहला एशियाई देश', { size: 44, fill: P.amber3, cls: 'tag r1' })}${tag(1460, 470, 'चौथी अंतरिक्ष एजेंसी', { size: 44, fill: P.snow, cls: 'tag r2' })}${tag(1380, 610, 'पहली कोशिश में पहुँचने वाला पहला देश', { size: 36, fill: P.amber3, cls: 'tag r3' })}` };
  },

  s22(A) {
    A.pop('.paper', A.cue('न्यू यॉर्क टाइम्स'));
    A.fadeIn('.scene', A.cue('किसान') - 0.4, 0.8, 0);
    A.slideIn('.farmer', A.cue('किसान'), 0.8, -300);
    A.loop('.knock', { x: 0 }, { x: 12 }, 0.2, A.cue('दस्तक'));
    A.pop('.club', A.cue('स्पेस क्लब'));
    A.pop('.prot', A.cue('विरोध'));
    A.pop('.sorry', A.cue('माफ़ी'));
    return { svg: `${L.sky()}${L.ground(900)}${L.newspaper(80, 100, 600, 520, 'THE NEW YORK TIMES', 'CARTOON · 2014', 'Opinion page', { cls: 'paper', headSize: 50 })}
      ${g('scene', `<rect x="1300" y="320" width="300" height="580" fill="${P.ink2}" ${S}/><rect x="1330" y="360" width="240" height="500" fill="${P.mol3}" ${Sthin}/><circle cx="1540" cy="620" r="12" fill="${P.amber3}"/>`)}
      ${tag(1450, 250, 'अमीर देशों का स्पेस क्लब', { size: 40, fill: P.snow, cls: 'tag club' })}
      <g class="farmer">${X.cow(900, 990, 0.9)}<g class="knock">${L.person(1180, 980, 1.3, { coat: P.snow, hat: 'turban', hatColor: P.brick, skin: '#9C6942' })}</g></g>
      ${tag(380, 720, 'भारत में भारी विरोध', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag prot' })}${L.stamp(380, 860, 'अख़बार ने माफ़ी माँगी', { size: 46, cls: 'stamp sorry' })}` };
  },

  s23(A) {
    A.slideIn('.note', A.cue('नोट') - 0.4, 1, -500);
    A.loop('.note', { rotation: -2, ...C }, { rotation: 2, ...C }, 1.4, A.cue('नोट') + 0.6);
    A.pop('.film', A.cue('फ़िल्म'));
    A.pop('.mm', A.cue('मिशन मंगल'));
    return { svg: `${L.sky('url(#dusk)')}${X.note2000(160, 340, 1.4)}${X.clapper(1240, 460, 1.4, 'clap film')}
      ${tag(560, 220, '₹2000 का नोट (2016)', { size: 44, fill: P.snow })}${tag(1410, 300, 'फ़िल्म: मिशन मंगल (2019)', { size: 44, fill: P.amber3, cls: 'tag mm' })}` };
  },

  s24(A) {
    spaceAmbient(A);
    A.drift('.orbitShip', 0, A.dur, { rotation: 0, ...TO('50% 50%') }, { rotation: 300, ...TO('50% 50%') }, 'none');
    A.pop('.m6', A.cue('छह महीने'));
    A.pop('.y8', A.cue('आठ साल'));
    A.draw('.m6 .xmark path', A.cue('आठ साल'), 0.4);
    A.pop('.pics', A.cue('तस्वीरें भेजीं'));
    A.pop('.phobos', A.cue('फ़ोबोस')); A.pop('.deimos', A.cue('डीमोस'));
    return { svg: `${X.spaceBg(41)}${X.mars(760, 560, 330)}<g class="orbitShip">${X.ellipseOrbit(760, 560, 450, 450, 'ring', { w: 3 })}${X.mom(1210, 560, 0.28, { cls: 'mini' })}</g>
      ${g('phobos', `<ellipse cx="1520" cy="820" rx="44" ry="30" fill="#8A7E6C" ${S}/>${L.label(1520, 900, 'फ़ोबोस', { font: HT, weight: 700, size: 34, color: P.snow })}`)}${g('deimos', `<ellipse cx="1760" cy="720" rx="26" ry="20" fill="#A89F8E" ${S}/>${L.label(1760, 790, 'डीमोस', { font: HT, weight: 700, size: 34, color: P.snow })}`)}
      ${g('m6', `${tag(1500, 160, 'योजना: 6 महीने', { size: 44, fill: P.snow })}${L.cross(1500, 160, 60)}`)}${tag(1500, 290, 'असल में: ~8 साल!', { size: 56, fill: P.amber3, cls: 'tag y8' })}
      ${tag(1500, 420, 'हज़ारों तस्वीरें', { size: 40, fill: P.snow, cls: 'tag pics' })}` };
  },

  s25(A) {
    spaceAmbient(A);
    A.tween('.shadow', A.cue('छाया'), 3, { opacity: 0 }, { opacity: 0.85 }, 'power1.in');
    A.pop('.fuel', A.cue('ईंधन'));
    A.tween('.fuel .bar', A.cue('ईंधन'), 2, { scaleX: 1, ...TO('0% 50%') }, { scaleX: 0.05, ...TO('0% 50%') }, 'power2.in');
    A.pop('.cal', A.cue('अक्टूबर'));
    A.pop('.end', A.cue('घोषणा'));
    return { svg: `${X.spaceBg(43)}${X.mars(1100, 560, 330)}${X.mom(500, 360, 0.6)}<rect class="shadow" x="-200" y="-200" width="2320" height="1480" fill="#05030A"/>
      ${g('fuel', `<rect x="160" y="880" width="600" height="50" fill="${P.ink}" ${Sthin}/><rect class="bar" x="160" y="880" width="600" height="50" fill="${P.amber2}"/>${L.label(460, 860, 'ईंधन', { font: HT, weight: 700, size: 36, color: P.snow })}`)}
      ${L.calendar(1500, 120, 'अक्टूबर', '2022', '').replace('class="calendar"', 'class="cal"').replace(/font-family="Oswald"/g, `font-family="${HT}"`)}
      ${tag(1600, 600, 'मिशन पूरा हुआ', { size: 48, fill: P.snow, cls: 'tag end' })}` };
  },

  s26(A) {
    A.pop('.q', 0.2);
    A.pop('.nm', A.cue('पैसों से नहीं')); A.draw('.nm .xmark path', A.cue('पैसों से नहीं') + 0.2, 0.4);
    A.pop('.sm', A.cue('समझदारी'));
    A.pop('.a1', A.cue('पुराने डिज़ाइन')); A.pop('.a2', A.cue('झूले वाली')); A.pop('.a3', A.cue('मेहनत'));
    return { svg: `${L.sky()}${tag(960, 120, 'पहली कोशिश, कम पैसे: कैसे?', { size: 56, fill: P.snow, cls: 'tag q' })}
      ${g('nm', `${tag(560, 280, '₹₹₹ पैसा', { size: 50 })}${L.cross(560, 280, 70)}`)}${tag(1360, 280, 'समझदारी ✓', { size: 56, fill: P.amber3, cls: 'tag sm' })}
      ${tag(960, 470, '1. पुराना डिज़ाइन, नया काम', { size: 44, fill: P.snow, cls: 'tag a1' })}${tag(960, 600, '2. छोटा रॉकेट + झूले वाली तरकीब', { size: 44, fill: P.snow, cls: 'tag a2' })}${tag(960, 730, '3. हज़ारों लोगों की मेहनत · 15 महीने', { size: 44, fill: P.snow, cls: 'tag a3' })}
      ${X.mom(1700, 900, 0.5, { cls: 'mini' })}` };
  },

  s27(A) {
    spaceAmbient(A);
    A.pop('.conf', A.cue('आत्मविश्वास'));
    A.fadeIn('.land', A.cue('चंद्रयान तीन') - 0.3, 0.8, 0);
    A.drift('.lander', A.cue('उतरने'), 2.5, { y: -300 }, { y: 0 }, 'power2.out');
    A.pop('.first', A.cue('पहला यान'));
    A.pop('.cont', A.cue('जारी'));
    return { svg: `${X.spaceBg(47)}${X.earth(1640, 220, 110, { marker: true })}
      ${g('land', `<path d="M-200 820Q400 760 960 800T2120 790V1300H-200Z" fill="#B8AFA0" ${S}/><circle cx="500" cy="900" r="60" fill="#9C9384"/><circle cx="1400" cy="950" r="90" fill="#9C9384"/>`)}
      <g class="lander"><rect x="880" y="660" width="160" height="110" fill="url(#goldg)" ${S}/><path d="M890 770l-40 60M1030 770l40 60" ${S}/><rect x="930" y="620" width="60" height="40" fill="${X.SP.panel}" ${Sthin}/></g>
      ${tag(560, 200, 'इसरो का आत्मविश्वास ↑', { size: 44, fill: P.snow, cls: 'tag conf' })}${tag(960, 420, 'चंद्रयान 3: दक्षिणी ध्रुव के पास पहला (2023)', { size: 42, fill: P.amber3, cls: 'tag first' })}
      ${tag(960, 1000, 'सफ़र जारी है…', { size: 44, fill: P.snow, cls: 'tag cont' })}` };
  },

  s28(A) {
    spaceAmbient(A);
    A.drift('.mom', 0, A.dur, { x: -200, rotation: -5 }, { x: 200, rotation: 5 }, 'sine.inOut');
    A.fadeIn('.ttl', 0.3, 1, 30);
    A.pop('.sub', A.cue('सब्सक्राइब'));
    A.pop('.cm', A.cue('कमेंट'));
    return { svg: `${X.spaceBg(51)}${X.mars(960, 1160, 520)}${X.mom(960, 330, 0.8)}
      ${lbl(960, 640, 'बड़े सपने, सही धक्का', { size: 110, color: P.amber3, cls: 'ttl' })}
      ${tag(640, 820, 'सब्सक्राइब करें', { size: 50, fill: P.brick2, color: P.snow, cls: 'tag sub' })}${tag(1300, 820, 'अगली कहानी? कमेंट करें', { size: 46, fill: P.amber3, cls: 'tag cm' })}` };
  },
};

export function sfx(clips) {
  const total = clips.at(-1).start + clips.at(-1).dur;
  const by = Object.fromEntries(clips.map((c) => [c.id, c]));
  const w = (id, word) => { const c = by[id]; const x = c.sc.words.find((q) => q.w.includes(word)); return c.start + (x ? x.s : 0); };
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(700, total), vol: 0.17, fadeIn: 2, fadeOut: 4 },
    { id: 'fx_launch', file: 'rush.wav', start: w('s12', 'उड़ान') - 0.8, dur: 6, vol: 0.7 },
    { id: 'fx_beep', file: 'beep.wav', start: w('s20', 'सिग्नल'), dur: 2, vol: 0.5 },
  ];
}
