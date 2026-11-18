// A Handful of Salt — scene builders.
import * as L from '../lib/inkamber.mjs';
import * as I from '../lib/india.mjs';
const { P, g, label, tag, S, Sthin, shadow } = L;

export const title = 'A Handful of Salt';
export const chapters = {
  s04: [1, 'A Tax on Salt'], s09: [2, 'The Letter'], s11: [3, '240 Miles'], s15: [4, 'The Beach at Dandi'],
  s21: [5, 'Dharasana'], s26: [6, 'The World Watches'], s29: [7, 'The Answer'],
};
export const chapterSvg = (n, t) => L.chapterCard(n, t);

const lower = (a, b) => `<div class="lower">${a}${b ? ` · <b>${b}</b>` : ''}</div>`;
const TO = (o) => ({ transformOrigin: o });
const C = TO('50% 50%'), B = TO('50% 100%');
const sky = (f) => L.sky(f);

function beachScene(o = {}) {
  return `${sky(o.sky || 'url(#dusk)')}${o.sun !== false ? L.sun(o.sunX || 1650, o.sunY || 300, 80) : ''}${L.cloud(400, 200, 0.9, 'cloud c1')}${L.cloud(1150, 150, 0.7, 'cloud c2')}${I.beach(560, 800)}${I.palm(1820, 860, 1.1)}${I.palm(120, 880, 0.9)}`;
}
function ambient(A) {
  A.drift('.c1', 0, A.dur, { x: -40 }, { x: 140 });
  A.drift('.c2', 0, A.dur, { x: 0 }, { x: -120 });
  A.loop('.ripple', { x: 0 }, { x: -60 }, 2.6);
  A.loop('.foam', { x: 0, y: 0 }, { x: 30, y: 6 }, 3.2);
}

export const scenes = {
  s01(A) {
    ambient(A);
    A.fadeIn('.lower', 0.5, 0.8, 0); A.fadeOut('.lower', 6, 0.6);
    A.fadeIn('.crowd', A.cue('Thousands') - 0.3, 1, 30);
    A.drift('.g', 0, A.cue('bends') - 0.2, { x: -260 }, { x: 0 }, 'power1.out');
    A.loop('.g', { y: 0 }, { y: -5 }, 0.55, 0);
    A.fadeOut('.g', A.cue('bends'), 0.3);
    A.fadeIn('.gb', A.cue('bends'), 0.4, 0);
    A.pop('.gb .mud', A.cue('lump'), 0.5);
    A.camera({ scale: 1.15, x: 80, y: 40 }, { scale: 1.0, x: 0, y: 0 });
    return { svg: `${beachScene({ sky: 'url(#dusk)', sunY: 420 })}${I.crowd(150, 760, 840, 14, 0.62, 1, 'crowd')}${I.gandhi(1040, 870, 1.25, { pose: 'walk', cls: 'gandhi g' })}${I.gandhi(1040, 870, 1.25, { pose: 'bend', cls: 'gandhi gb' })}`, over: lower('DANDI, INDIA', 'APRIL 6, 1930') };
  },

  s02(A) {
    ambient(A);
    A.pop('.quote', 0.3, 0.7);
    A.fadeOut('.quote', A.cue('It sounds') - 0.2, 0.4);
    A.pop('.salt', A.cue('handful of salt'));
    A.pop('.emp', A.cue('largest empire'));
    A.fadeOut('.salt, .emp, .vs', A.cue('So how') - 0.3, 0.4);
    A.pop('.vs', A.cue('against'));
    A.pop('.q1', A.cue('So how'), 0.7); A.pop('.q2', A.cue('And how did'), 0.7);
    return { svg: `${beachScene()}
      ${g('quote', `<rect x="260" y="180" width="1400" height="300" fill="${P.snow}" ${S}/>${label(960, 300, '"With this, I am shaking the foundations', { font: 'Playfair Display', weight: 700, size: 56 })}${label(960, 380, 'of the British Empire."', { font: 'Playfair Display', weight: 700, size: 56 })}${label(1560, 450, '— GANDHI, 6 APRIL 1930', { font: 'Oswald', weight: 500, size: 28, anchor: 'end', color: P.ink2 })}`, shadow)}
      ${I.saltPile(560, 500, 1.2, 'salt')}${label(1000, 440, 'VS', { font: 'Playfair Display', weight: 900, size: 110, color: P.brick, cls: 'vs' })}${tag(1420, 420, 'THE BRITISH EMPIRE', { size: 54, fill: P.brick2, color: P.snow, cls: 'tag emp' })}
      ${tag(960, 250, 'HOW COULD SALT SHAKE AN EMPIRE?', { size: 66, fill: P.snow, cls: 'tag q1' })}${tag(960, 420, '…AND HOW DID IT CHANGE AMERICA?', { size: 50, fill: P.amber3, cls: 'tag q2' })}` };
  },

  s03(A) {
    A.fadeIn('.ttl', 0.2, 1.2, 40); A.fadeIn('.sub', 1.0, 1.0, 20);
    A.pop('.crime', A.cue('crime'));
    A.loop('.ripple', { x: 0 }, { x: -60 }, 2.6);
    return { svg: `${sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.25"/>${I.beach(780, 930)}${I.saltPile(1600, 940, 0.9)}
      ${label(780, 330, 'A HANDFUL', { font: 'Playfair Display', weight: 900, size: 130, color: P.snow, cls: 'ttl' })}${label(780, 470, 'OF SALT', { font: 'Playfair Display', weight: 900, size: 150, color: P.amber3, cls: 'ttl' })}
      ${label(780, 560, 'THE MARCH THAT SHOOK AN EMPIRE · INDIA 1930', { font: 'Oswald', weight: 500, size: 40, color: P.paper2, letter: 5, cls: 'sub' })}
      ${L.stamp(1500, 260, 'A CRIME?', { size: 70, cls: 'stamp crime', color: P.amber3 })}` };
  },

  s04(A) {
    A.fadeIn('.gov', 0.2, 1, 40);
    A.pop('.uflag', 0.8);
    A.loop('.uflag', { skewY: 0 }, { skewY: 3 }, 0.8);
    A.pop('.pop', A.cue('three hundred million'));
    A.slideIn('.people', A.cue('three hundred million') + 0.2, 1, 400);
    A.pop('.ldn', A.cue('London'));
    A.draw('.arrow', A.cue('London') + 0.2, 1);
    A.pop('.say', A.cue('little say'));
    let ppl = ''; for (let i = 0; i < 12; i++) ppl += i % 3 === 2 ? I.woman(1050 + i * 70, 990 + (i % 2) * 20, 0.6, i) : I.marcher(1050 + i * 70, 990 + (i % 2) * 20, 0.6, i, { coat: [P.snow, P.paper2, P.amber3][i % 3], hat: i % 2 ? 'turban' : 'gcap' });
    return { svg: `${sky()}${L.ground(880)}${I.colonial(180, 880, 1.2)}${I.unionFlag(440, 120, 140)}
      ${tag(1400, 200, 'INDIA, 1930: 300+ MILLION PEOPLE', { size: 42, fill: P.amber3, cls: 'tag pop' })}${g('people', ppl)}
      ${tag(1450, 420, 'RULED FROM LONDON', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag ldn' })}
      <path class="arrow" d="M1300 470Q1000 520 820 380" stroke="${P.brick}" stroke-width="8" fill="none" pathLength="1" stroke-dasharray="1 1"/>
      ${tag(1450, 620, 'LITTLE SAY IN LAWS OR TAXES', { size: 36, fill: P.snow, cls: 'tag say' })}` };
  },

  s05(A) {
    A.pop('.doc', 0.2);
    A.pop('.mono', A.cue('monopoly'));
    A.fadeOut('.doc, .mono', A.cue('Even on the coast') - 0.3, 0.4);
    A.fadeIn('.coast', A.cue('Even on the coast') - 0.2, 0.8, 0);
    A.pop('.coast .salt', A.cue('dried naturally'), 0.5, 0.2);
    A.slideIn('.picker', A.cue('collecting'), 0.8, -300);
    A.pop('.crime', A.cue('criminal offense'));
    A.pop('.tax', A.cue('tax'), 0.5);
    A.loop('.ripple', { x: 0 }, { x: -60 }, 2.6);
    return { svg: `${sky()}
      ${L.document(560, 140, 800, 720, { title: 'THE SALT ACT, 1882', size: 54, cls: 'doc' })}${L.stamp(960, 640, 'GOVERNMENT MONOPOLY', { size: 52, cls: 'stamp mono' })}
      ${g('coast', `${I.beach(520, 760)}${I.saltPile(600, 800, 0.7, 'salt')}${I.saltPile(1100, 810, 0.55, 'salt')}${I.saltPile(1500, 800, 0.65, 'salt')}${I.woman(840, 960, 1.1, 1, { cls: 'person picker' })}${L.stamp(960, 240, 'CRIMINAL OFFENSE', { size: 70, cls: 'stamp crime' })}${tag(1500, 420, 'BUY FROM THE GOVERNMENT + TAX', { size: 34, fill: P.amber3, cls: 'tag tax' })}`)}` };
  },

  s06(A) {
    A.fadeIn('.field', 0.2, 0.8, 0);
    A.loop('.sun .rays', { rotation: 0, ...C }, { rotation: 20, ...C }, 3);
    A.loop('.farmer', { y: 0 }, { y: -8 }, 0.7);
    A.tween('.bar', A.cue('eight percent'), 1.4, { scaleX: 0, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power2.out');
    A.fadeIn('.chart', A.cue('eight percent') - 0.3, 0.5, 0);
    A.pop('.all', A.cue('Hindu and Muslim'));
    A.fadeIn('.q', A.cue('As Gandhi put it'), 0.8, 20);
    return { svg: `${sky()}${L.sun(1700, 180, 80)}<rect x="-200" y="700" width="2320" height="600" fill="${P.olive2}" ${S}/>
      ${g('field', [0, 1, 2, 3].map((i) => I.marcher(300 + i * 230, 900 + (i % 2) * 30, 1.1, i, { coat: P.paper2, hat: 'turban', cls: 'person farmer' })).join(''))}
      ${g('chart', `<rect x="1150" y="560" width="620" height="60" fill="${P.snow}" ${S}/><rect class="bar" x="1150" y="560" width="51" height="60" fill="${P.brick}"/>${label(1460, 540, 'SALT TAX: 8.2% OF TAX INCOME', { font: 'Oswald', weight: 700, size: 34 })}`, shadow)}
      ${tag(1460, 720, 'HINDU · MUSLIM · RICH · POOR', { size: 36, fill: P.amber3, cls: 'tag all' })}
      ${g('q', `<rect x="160" y="140" width="1100" height="200" fill="${P.snow}" ${S}/>${label(710, 230, '"Next to air and water, salt is perhaps', { font: 'Playfair Display', weight: 700, size: 44 })}${label(710, 295, 'the greatest necessity of life."  — Gandhi', { font: 'Playfair Display', weight: 700, size: 44 })}`, shadow)}` };
  },

  s07(A) {
    A.fadeIn('.g', 0.2, 0.8, 30);
    A.pop('.joke', A.cue('joke'));
    A.pop('.paper', A.cue('newspaper'));
    A.fadeOut('.joke', A.cue('newspaper'), 0.3);
    A.slideIn('.irwin', A.cue('Viceroy') - 0.2, 0.9, 400);
    A.pop('.sleep', A.cue('awake at night'));
    A.loop('.zz', { y: 0, opacity: 0.5 }, { y: -20, opacity: 1 }, 0.8, A.cue('awake at night'));
    return { svg: `${sky()}${L.ground(900)}${I.gandhi(300, 960, 1.6, { pose: 'stand', cls: 'gandhi g' })}
      ${tag(420, 250, '"A PROTEST ABOUT SALT?"', { size: 44, fill: P.snow, cls: 'tag joke' })}
      ${L.newspaper(560, 160, 600, 560, 'THE STATESMAN', '"DIFFICULT NOT TO LAUGH"', 'On the salt campaign', { cls: 'paper', headSize: 46 })}
      ${g('irwin', `${I.officer(1500, 960, 1.6, { hat: 'none', coat: P.ink })}${tag(1500, 380, 'LORD IRWIN, VICEROY', { size: 34, fill: P.snow })}`)}
      ${g('sleep', `<rect x="1240" y="560" width="520" height="150" fill="${P.snow}" ${S}/>${label(1500, 620, '"Does not keep me', { font: 'Playfair Display', weight: 700, size: 40 })}${label(1500, 675, 'awake at night."', { font: 'Playfair Display', weight: 700, size: 40 })}${label(1780, 520, 'Z z', { font: 'Playfair Display', weight: 900, size: 60, color: P.slate, cls: 'zz' })}`, shadow)}` };
  },

  s08(A) {
    A.pop('.cal', A.cue('January'));
    A.pop('.ps', A.cue('Purna Swaraj'));
    A.fadeIn('.flag', A.cue('complete independence') - 0.3, 0.8, 30);
    A.slideIn('.g', A.cue('Gandhi was asked'), 0.9, -300);
    A.pop('.under', A.cue('understand'));
    A.pop('.brk', A.cue('could break'));
    return { svg: `${sky()}${L.ground(900)}${L.calendar(120, 140, 'JANUARY', '26', '1930').replace('class="calendar"', 'class="cal"')}
      ${g('flag', `<line x1="900" y1="160" x2="900" y2="900" stroke="${P.ink}" stroke-width="10"/><rect x="900" y="160" width="300" height="70" fill="${P.amber2}" ${Sthin}/><rect x="900" y="230" width="300" height="70" fill="${P.snow}" ${Sthin}/><rect x="900" y="300" width="300" height="70" fill="${P.olive}" ${Sthin}/><circle cx="1050" cy="265" r="24" fill="none" stroke="${P.slate}" stroke-width="6"/>`, shadow)}
      ${tag(1450, 480, 'PURNA SWARAJ = COMPLETE SELF-RULE', { size: 36, fill: P.amber3, cls: 'tag ps' })}
      ${I.gandhi(420, 960, 1.5, { pose: 'stand', cls: 'gandhi g' })}${I.saltPile(700, 900, 0.6)}
      ${tag(1450, 640, 'EVERYONE CAN UNDERSTAND IT', { size: 36, fill: P.snow, cls: 'tag under' })}${tag(1450, 760, 'EVERYONE CAN BREAK IT', { size: 36, fill: P.brick2, color: P.snow, cls: 'tag brk' })}` };
  },

  s09(A) {
    A.fadeIn('.desk', 0.2, 0.6, 20);
    A.pop('.letter', A.cue('letter'));
    A.pop('.d11', A.cue('eleven demands'));
    A.pop('.d1', A.cue('abolishing the salt tax'));
    A.pop('.cal', A.cue('March second') - 0.2);
    A.pop('.x', A.cue('did not meet'));
    A.draw('.x path', A.cue('did not meet'), 0.5);
    A.fadeIn('.quote', A.cue('on bended knees'), 0.8, 20);
    A.pop('.stone', A.cue('stone'));
    return { svg: `${sky()}<rect x="-200" y="760" width="2320" height="600" fill="${P.mol3}" ${S}/>
      ${g('desk', I.gandhi(260, 900, 1.4, { pose: 'stand' }))}${L.calendar(40, 120, 'MARCH', '2', '1930').replace('class="calendar"', 'class="cal"')}
      ${L.document(560, 120, 560, 600, { title: 'TO LORD IRWIN', size: 44, cls: 'letter' })}
      ${tag(840, 380, '11 DEMANDS', { size: 50, fill: P.amber3, cls: 'tag d11' })}${tag(840, 500, '#1: ABOLISH THE SALT TAX', { size: 34, fill: P.snow, cls: 'tag d1' })}
      ${L.cross(840, 420, 220, 'xmark x')}
      ${g('quote', `<rect x="1180" y="200" width="680" height="300" fill="${P.snow}" ${S}/>${label(1520, 290, '"On bended knees, I asked', { font: 'Playfair Display', weight: 700, size: 40 })}${label(1520, 350, 'for bread, and I have', { font: 'Playfair Display', weight: 700, size: 40 })}${label(1520, 410, 'received stone instead."', { font: 'Playfair Display', weight: 700, size: 40 })}`, shadow)}
      ${g('stone', `<path d="M1450 760q20 -70 90 -70q80 0 90 70z" fill="${P.ink3}" ${S}/>`, shadow)}` };
  },

  s10(A) {
    A.pop('.n78', A.cue('seventy-eight'));
    A.pop('.m', A.cue('seventy-eight') + 0.4, 0.3, 0.05);
    A.pop('.reg', A.cue('every region'));
    A.pop('.rule', A.cue('No violence'));
    A.pop('.rule2', A.cue('attacked'));
    A.loop('.m', { y: 0 }, { y: -4 }, 0.9, A.cue('seventy-eight') + 1.5);
    let ms = ''; for (let i = 0; i < 26; i++) ms += `<g class="m">${I.marcher(140 + (i % 13) * 130, 640 + Math.floor(i / 13) * 220, 0.75, i)}</g>`;
    return { svg: `${sky()}${L.ground(900)}${ms}${tag(960, 140, '78 MARCHERS FROM THE SABARMATI ASHRAM', { size: 46, fill: P.snow, cls: 'tag n78' })}
      ${tag(960, 250, 'NEARLY EVERY REGION AND RELIGION', { size: 38, fill: P.amber3, cls: 'tag reg' })}
      ${L.stamp(620, 990, 'RULE #1: NO VIOLENCE', { size: 60, cls: 'stamp rule', rot: -3 })}${tag(1420, 990, 'EVEN IF ATTACKED', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag rule2' })}` };
  },

  s11(A) {
    A.fadeIn('.lower', 0.4, 0.6, 0); A.fadeOut('.lower', 5.5, 0.6);
    A.drift('.col', 0, A.dur, { x: -300 }, { x: 500 });
    A.loop('.col .person, .col .gandhi', { y: 0 }, { y: -6 }, 0.45);
    A.fadeIn('.crowdL, .crowdR', A.cue('a hundred thousand') - 0.3, 0.8, 20);
    A.pop('.n100', A.cue('a hundred thousand'));
    A.pop('.goal', A.cue('Dandi'));
    let col = I.gandhi(700, 860, 1.05, { pose: 'walk' });
    for (let i = 0; i < 8; i++) col += I.marcher(560 - i * 95, 860 + (i % 2) * 10, 0.85, i, { pose: 'stand' });
    return { svg: `${sky()}${L.sun(1700, 160, 60)}<rect x="-200" y="720" width="2320" height="600" fill="${P.paper3}" ${S}/>
      ${I.crowd(-100, 2000, 720, 30, 0.5, 3, 'crowd crowdL')}<g class="col">${col}</g>${I.crowd(-100, 2000, 1060, 26, 0.6, 7, 'crowd crowdR')}
      ${tag(1400, 200, '~100,000 LINE THE ROAD', { size: 44, fill: P.amber3, cls: 'tag n100' })}${tag(1400, 320, 'GOAL: DANDI · ~240 MILES', { size: 44, fill: P.snow, cls: 'tag goal' })}`,
      over: lower('SABARMATI ASHRAM, AHMEDABAD', 'MARCH 12, 1930') };
  },

  s12(A) {
    A.fadeIn('.rmap', 0.1, 0.8, 0);
    A.draw('.route', 0.6, A.dur - 2);
    I.ROUTE.forEach((r, i) => A.pop(`.st${i}`, 0.5 + (A.dur - 2) * (i / (I.ROUTE.length - 1)), 0.4));
    A.pop('.ten', A.cue('ten miles'));
    A.pop('.d24', A.cue('twenty-four days'));
    A.pop('.rv', A.cue('three great rivers'));
    A.pop('.night', A.cue('slept in the open')); A.camera({ scale: 1.0 }, { scale: 1.02 });
    return { svg: `${sky()}${I.routeMap()}${tag(215, 300, '~10 MILES A DAY', { size: 30, fill: P.amber3, cls: 'tag ten' })}${tag(215, 400, '24 DAYS', { size: 30, fill: P.snow, cls: 'tag d24' })}${tag(215, 500, '3 RIVERS', { size: 30, fill: P.slate3, cls: 'tag rv' })}${tag(215, 600, 'NIGHTS IN THE OPEN', { size: 26, fill: P.snow, cls: 'tag night' })}` };
  },

  s13(A) {
    A.loop('.drum', { rotation: -4, ...C }, { rotation: 4, ...C }, 0.25);
    A.fadeIn('.vil', 0.1, 0.6, 0);
    A.slideIn('.speak', A.cue('Gandhi spoke'), 0.8, -300);
    A.pop('.res', A.cue('resigned'));
    A.drift('.long', A.cue('New volunteers'), A.dur - A.cue('New volunteers'), { x: 600, opacity: 0 }, { x: -200, opacity: 1 }, 'power1.out');
    A.pop('.two', A.cue('two miles'));
    let long = ''; for (let i = 0; i < 22; i++) long += I.marcher(200 + i * 80, 1030, 0.45, i);
    return { svg: `${sky()}${L.sun(1650, 170, 60)}<rect x="-200" y="800" width="2320" height="600" fill="${P.paper3}" ${S}/>
      ${g('vil', `${I.hut(150, 820, 1.1)}${I.hut(450, 800, 0.9)}${I.mangoTree(1500, 820, 1)}${I.hut(1660, 810, 0.8)}`)}
      ${g('drum', `<ellipse cx="760" cy="760" rx="50" ry="22" fill="${P.amber2}" ${S}/><rect x="710" y="760" width="100" height="70" fill="${P.brick}" ${S}/>`)}${I.woman(660, 900, 0.9, 1)}${I.marcher(870, 900, 0.9, 2, { hat: 'turban', coat: P.paper2 })}
      ${g('speak', I.gandhi(1150, 880, 1.2, { pose: 'stand' }))}
      ${tag(1150, 360, 'OFFICIALS RESIGN ON THE SPOT', { size: 38, fill: P.brick2, color: P.snow, cls: 'tag res' })}
      <g class="long">${long}</g>${tag(960, 200, 'THE COLUMN GROWS TO ~2 MILES', { size: 42, fill: P.amber3, cls: 'tag two' })}` };
  },

  s14(A) {
    A.pop('.cam2', A.cue('Reporters') - 0.3);
    A.loop('.reel', { rotation: 0, ...C }, { rotation: 180, ...C }, 1.5, A.cue('Reporters'));
    A.pop('.p1', A.cue('India'), 0.5); A.pop('.p2', A.cue('Europe'), 0.5); A.pop('.p3', A.cue('America'), 0.5);
    A.pop('.nyt', A.cue('New York Times'));
    A.pop('.big', A.cue('biggest stories'));
    A.drift('.walk', 0, A.dur, { x: -120 }, { x: 160 });
    A.loop('.walk', { y: 0 }, { y: -5 }, 0.5);
    return { svg: `${sky()}${L.ground(880)}${I.camera(1580, 760, 1.2)}<g class="walk">${I.gandhi(1200, 940, 1.1, { pose: 'walk' })}</g>
      ${L.newspaper(80, 120, 420, 400, 'BOMBAY CHRONICLE', 'THE MARCH GOES ON', 'Day by day', { cls: 'paper p1', headSize: 40 })}
      ${L.newspaper(260, 260, 420, 400, 'LONDON DAILY', 'GANDHI MARCHES', 'Towards the sea', { cls: 'paper p2', headSize: 42 })}
      ${L.newspaper(440, 400, 420, 400, 'AMERICAN NEWS', 'SALT REVOLT', 'Front page', { cls: 'paper p3', headSize: 46 })}
      ${tag(1350, 200, 'THE NEW YORK TIMES: ALMOST DAILY', { size: 38, fill: P.snow, cls: 'tag nyt' })}${tag(1350, 320, 'A WORLDWIDE STORY', { size: 44, fill: P.amber3, cls: 'tag big' })}` };
  },

  s15(A) {
    ambient(A);
    A.pop('.cal', 0.2);
    A.fadeIn('.crowd', A.cue('fifty thousand') - 0.3, 1, 20);
    A.pop('.n50', A.cue('fifty thousand'));
    A.pop('.nostop', A.cue('had not tried'));
    A.fadeIn('.q', A.cue('Gandhi said'), 0.8, 20);
    return { svg: `${beachScene({ sun: false })}${L.calendar(80, 80, 'APRIL', '5', '1930').replace('class="calendar"', 'class="cal"')}
      ${I.crowd(300, 1700, 900, 30, 0.6, 2, 'crowd')}${tag(1300, 160, '~50,000 GATHER AT DANDI', { size: 44, fill: P.amber3, cls: 'tag n50' })}
      ${tag(1300, 270, 'THE BRITISH DID NOT STOP THEM', { size: 38, fill: P.snow, cls: 'tag nostop' })}
      ${g('q', `<rect x="460" y="360" width="1200" height="170" fill="${P.snow}" ${S}/>${label(1060, 430, '"Sensitive to world opinion"', { font: 'Playfair Display', weight: 700, size: 52 })}${label(1060, 495, '— Gandhi, on why the march was not stopped', { font: 'Oswald', weight: 500, size: 28, color: P.ink2 })}`, shadow)}` };
  },

  s16(A) {
    ambient(A);
    A.drift('.g', 0, A.cue('picked up') - 0.4, { x: -200 }, { x: 0 }, 'power1.out');
    A.loop('.g', { y: 0 }, { y: -5 }, 0.55);
    A.fadeOut('.g', A.cue('picked up') - 0.3, 0.2);
    A.fadeIn('.gb', A.cue('picked up') - 0.3, 0.3, 0);
    A.pop('.gb .mud', A.cue('picked up'));
    A.fadeIn('.pot', A.cue('boiled'), 0.6, 20);
    A.smoke('.steam', A.cue('boiled'), 2.4, 140);
    A.pop('.salt', A.cue('illegal salt'));
    A.pop('.crime', A.cue('crime'));
    A.pop('.hail', A.cue('hail'));
    A.camera({ scale: 1.1, x: 40 }, { scale: 1.0, x: 0 });
    return { svg: `${beachScene({ sky: 'url(#skyg)', sunY: 220 })}${I.crowd(100, 600, 860, 9, 0.6, 5, 'crowd')}
      ${I.gandhi(980, 880, 1.25, { pose: 'walk', cls: 'gandhi g' })}${I.gandhi(980, 880, 1.25, { pose: 'bend', cls: 'gandhi gb' })}
      ${g('pot', `<path d="M1300 860h200l-20 80h-160z" fill="${P.ink}" ${S}/><path d="M1290 940h220" ${S}/>`, shadow)}${L.smoke(1400, 820, 5, 'smoke steam', 0.8)}
      ${I.saltPile(1640, 940, 0.4, 'salt')}${L.stamp(1350, 300, 'ILLEGAL SALT', { size: 64, cls: 'stamp crime' })}
      ${tag(500, 300, '"HAIL, LAW BREAKER!"', { size: 46, fill: P.amber3, cls: 'tag hail' })}` };
  },

  s17(A) {
    A.loop('.ripple', { x: 0 }, { x: -60 }, 2.6);
    A.fadeIn('.coast', 0.2, 0.8, 0);
    A.pop('.m1', A.cue('Millions'));
    A.pop('.makers .person', A.cue('made salt'), 0.4, 0.15);
    A.pop('.pans', A.cue('seawater') - 0.3);
    A.fadeIn('.city', A.cue('In the cities') - 0.2, 0.7, 0);
    A.pop('.pinch', A.cue('pinch'));
    A.pop('.r1600', A.cue('sixteen hundred'));
    return { svg: `${sky()}
      ${g('coast', `${I.beach(380, 560)}${I.saltPans(160, 620, 900, 260)}<g class="makers">${[0, 1, 2, 3].map((i) => (i % 2 ? I.woman(220 + i * 230, 960, 0.9, i) : I.marcher(220 + i * 230, 960, 0.9, i, { hat: 'turban', coat: P.paper2 }))).join('')}</g>`)}
      ${tag(560, 160, 'MILLIONS BREAK THE SALT LAW', { size: 46, fill: P.amber3, cls: 'tag m1' })}
      ${g('city', `<rect x="1180" y="200" width="680" height="760" fill="${P.paper}" ${S}/>${I.saltPile(1520, 720, 1.1)}${tag(1520, 330, 'A PINCH OF GANDHI\'S SALT', { size: 34, fill: P.snow, cls: 'tag pinch' })}${tag(1520, 860, '1,600 RUPEES', { size: 56, fill: P.amber3, cls: 'tag r1600' })}`, shadow)}` };
  },

  s18(A) {
    A.fadeIn('.home', 0.2, 0.8, 0);
    A.pop('.first', A.cue('For the first time'));
    A.slideIn('.ws', A.cue('women made salt'), 1, -400);
    A.pop('.street', A.cue('streets'));
    A.fadeIn('.q', A.cue('One activist'), 0.8, 20);
    A.pop('.gm', A.cue('grandmothers'), 0.5);
    
    A.loop('.ws .person', { y: 0 }, { y: -6 }, 0.5);
    return { svg: `${sky()}${L.ground(900)}${g('home', `${I.hut(80, 900, 1.6, 'hut', P.rose)}${I.hut(1500, 900, 1.3, 'hut', P.amber3)}`)}
      <g class="ws">${[0, 1, 2, 3].map((i) => I.woman(560 + i * 170, 990, 1.15, i)).join('')}</g>
      ${g('gm', `<path d="M1340 860q0 -60 60 -60q60 0 60 60z" fill="${P.brick}" ${S}/>${I.woman(1340, 1000, 1.1, 2)}`, shadow)}
      ${tag(960, 140, 'WOMEN JOIN IN HUGE NUMBERS', { size: 50, fill: P.amber3, cls: 'tag first' })}${tag(700, 260, 'MAKING AND SELLING SALT', { size: 36, fill: P.snow, cls: 'tag street' })}
      ${g('q', `<rect x="1080" y="230" width="780" height="140" fill="${P.snow}" ${S}/>${label(1470, 320, '"We have broken the salt law!"', { font: 'Playfair Display', weight: 700, size: 46, cls: 'shout' })}`, shadow)}` };
  },

  s19(A) {
    A.pop('.n60', A.cue('sixty thousand'));
    A.pop('.bar', A.cue('sixty thousand') + 0.3, 0.3, 0.06);
    A.pop('.cens', A.cue('censored'));
    A.pop('.ill', A.cue('declared illegal'));
    A.pop('.bigger', A.cue('only made'));
    let bars = ''; for (let i = 0; i < 12; i++) bars += `<rect class="bar" x="${300 + i * 70}" y="300" width="22" height="520" rx="8" fill="${P.ink2}" ${Sthin}/>`;
    return { svg: `${sky(P.paper2)}<rect x="240" y="280" width="900" height="560" fill="${P.ink}" opacity="0.15"/>${I.crowd(300, 1060, 800, 10, 0.75, 4, 'crowd')}${bars}<rect x="240" y="270" width="900" height="36" fill="${P.ink}"/><rect x="240" y="820" width="900" height="36" fill="${P.ink}"/>
      ${tag(1500, 220, '60,000+ JAILED', { size: 60, fill: P.brick2, color: P.snow, cls: 'tag n60' })}${L.stamp(1500, 420, 'CENSORED', { size: 66, cls: 'stamp cens' })}${L.stamp(1500, 600, 'CONGRESS: ILLEGAL', { size: 50, cls: 'stamp ill', rot: 6 })}
      ${tag(1500, 800, 'THE PROTEST ONLY GROWS', { size: 40, fill: P.amber3, cls: 'tag bigger' })}` };
  },

  s20(A) {
    A.loop('.stars circle', { opacity: 0.4 }, { opacity: 1 }, 0.9);
    A.pop('.cal', A.cue('May fifth'));
    A.fadeIn('.sleep', A.cue('asleep'), 0.8, 0);
    A.slideIn('.pol', A.cue('magistrate'), 1, 600);
    A.pop('.mid', A.cue('just after midnight')); A.pop('.n30', A.cue('thirty armed'));
    A.pop('.law', A.cue('eighteen twenty-seven'));
    A.pop('.nt', A.cue('without a trial'));
    let st = ''; for (let i = 0; i < 30; i++) st += `<circle cx="${(i * 197) % 1900}" cy="${40 + (i * 71) % 380}" r="${2 + (i % 3)}" fill="${P.snow}"/>`;
    return { svg: `${sky(P.ink)}<g class="stars">${st}</g><circle cx="1650" cy="160" r="60" fill="${P.paper}" opacity="0.9"/><rect x="-200" y="820" width="2320" height="500" fill="${P.mol}" ${S}/>
      ${I.mangoTree(380, 830, 1.4)}${I.mangoTree(820, 830, 1.1)}
      ${g('sleep', `<rect x="420" y="860" width="320" height="30" fill="${P.amber}" ${S}/><path d="M440 890v40M720 890v40" ${S}/><path d="M440 860q140 -50 280 0z" fill="${P.snow}" ${Sthin}/><circle cx="460" cy="840" r="22" fill="#B98458" ${Sthin}/>`)}
      <g class="pol">${[0, 1, 2, 3, 4].map((i) => I.police(1150 + i * 120, 1000, 0.85, i)).join('')}${I.officer(1080, 1000, 0.95)}</g>
      ${L.calendar(60, 60, 'MAY', '5', '1930').replace('class="calendar"', 'class="cal"')}
      ${tag(1480, 190, 'JUST AFTER MIDNIGHT', { size: 40, fill: P.snow, cls: 'tag mid' })}${tag(1480, 300, '~30 ARMED OFFICERS', { size: 40, fill: P.snow, cls: 'tag n30' })}${tag(1480, 410, 'A LAW FROM 1827', { size: 40, fill: P.amber3, cls: 'tag law' })}${tag(1480, 520, 'NO TRIAL', { size: 48, fill: P.brick2, color: P.snow, cls: 'tag nt' })}` };
  },

  s21(A) {
    A.fadeIn('.works', 0.3, 0.8, 30);
    A.pop('.lbl', A.cue('Dharasana'));
    A.drift('.vol', A.cue('Volunteers'), 3, { x: -400, opacity: 0 }, { x: 0, opacity: 1 }, 'power2.out');
    A.loop('.vol .person', { y: 0 }, { y: -4 }, 0.5, A.cue('Volunteers'));
    A.pop('.ty', A.cue('Abbas Tyabji')); A.pop('.ka', A.cue('Kasturba'));
    A.pop('.arr', A.cue('arrested'));
    A.pop('.sn', A.cue('Sarojini Naidu'));
    A.fadeOut('.ty, .ka, .arr', A.cue('Sarojini Naidu') - 0.3, 0.3);
    return { svg: `${sky()}<rect x="-200" y="800" width="2320" height="600" fill="${P.amber3}" ${S}/>
      ${g('works', `${I.saltPans(1050, 650, 800, 200)}${I.saltPile(1200, 640, 0.8)}${I.saltPile(1500, 630, 1)}<rect x="1000" y="520" width="24" height="400" fill="${P.ink2}"/><path d="M1000 600h900M1000 680h900" stroke="${P.ink2}" stroke-width="6" stroke-dasharray="30 10"/>`)}
      ${tag(1450, 380, 'DHARASANA SALT WORKS', { size: 46, fill: P.snow, cls: 'tag lbl' })}
      <g class="vol">${[0, 1, 2, 3, 4, 5].map((i) => I.marcher(120 + i * 120, 960, 0.85, i)).join('')}</g>
      ${tag(450, 260, 'ABBAS TYABJI, 76', { size: 36, fill: P.snow, cls: 'tag ty' })}${tag(450, 360, 'KASTURBA GANDHI', { size: 36, fill: P.snow, cls: 'tag ka' })}${L.stamp(450, 520, 'ARRESTED', { size: 56, cls: 'stamp arr' })}
      ${g('sn', `${I.woman(860, 980, 1.4, 3)}${tag(700, 300, 'SAROJINI NAIDU TAKES OVER', { size: 40, fill: P.amber3 })}`)}` };
  },

  s22(A) {
    A.fadeIn('.sn', 0.2, 0.8, 30);
    A.fadeIn('.q1', A.cue('You will be beaten'), 0.6, 20);
    A.fadeIn('.q2', A.cue('you must not resist'), 0.6, 20);
    A.fadeIn('.q3', A.cue('You must not even'), 0.6, 20);
    A.camera({ scale: 1.0 }, { scale: 1.08, x: -40 });
    return { svg: `${sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.2"/>
      ${g('sn', I.woman(400, 1000, 2.2, 3))}
      ${label(1200, 340, '"You will be beaten,', { font: 'Playfair Display', weight: 900, size: 76, color: P.snow, cls: 'q1' })}
      ${label(1200, 450, 'but you must not resist.', { font: 'Playfair Display', weight: 900, size: 76, color: P.snow, cls: 'q2' })}
      ${label(1200, 600, 'You must not even raise', { font: 'Playfair Display', weight: 900, size: 76, color: P.amber3, cls: 'q3' })}${label(1200, 710, 'a hand to ward off blows."', { font: 'Playfair Display', weight: 900, size: 76, color: P.amber3, cls: 'q3' })}
      ${label(1200, 800, '— SAROJINI NAIDU, MAY 1930', { font: 'Oswald', weight: 500, size: 34, color: P.paper2, letter: 4, cls: 'q3' })}` };
  },

  s23(A) {
    A.pop('.cal', 0.2);
    A.pop('.n25', A.cue('two thousand five hundred'));
    A.drift('.row1', A.cue('silent rows'), 4, { x: -500 }, { x: 0 }, 'power1.out');
    A.drift('.row2', A.cue('silent rows') + 1, 4, { x: -700 }, { x: -120 }, 'power1.out');
    A.fadeIn('.pol', A.cue('Police officers') - 0.3, 0.6, 0);
    A.pop('.lt', A.cue('lathis'));
    A.tween('.row1', A.cue('struck'), 0.6, { opacity: 1 }, { opacity: 0.25 }, 'power2.in');
    A.pop('.nofight', A.cue('did not fight back'));
    A.drift('.row2', A.cue('next one'), 2.5, { x: -120 }, { x: 0 }, 'power1.inOut');
    return { svg: `${sky(P.paper2)}<rect x="-200" y="820" width="2320" height="600" fill="${P.amber3}" ${S}/>${L.calendar(60, 60, 'MAY', '21', '1930').replace('class="calendar"', 'class="cal"')}
      <g class="row2">${[0, 1, 2, 3, 4].map((i) => I.marcher(260 + i * 110, 900, 0.8, i + 5)).join('')}</g>
      <g class="row1">${[0, 1, 2, 3, 4].map((i) => I.marcher(820 + i * 90, 970, 0.95, i)).join('')}</g>
      <g class="pol">${[0, 1, 2, 3].map((i) => I.police(1420 + i * 120, 990, 1, i, { raised: i % 2 === 0 })).join('')}</g>
      ${tag(1200, 160, '~2,500 VOLUNTEERS', { size: 46, fill: P.snow, cls: 'tag n25' })}${tag(1640, 360, 'STEEL-TIPPED LATHIS', { size: 36, fill: P.brick2, color: P.snow, cls: 'tag lt' })}
      ${tag(700, 300, 'NO ONE FIGHTS BACK', { size: 46, fill: P.amber3, cls: 'tag nofight' })}` };
  },

  s24(A) {
    A.slideIn('.wm', 0.2, 1, -400);
    A.pop('.nm', A.cue('Webb Miller'));
    A.pop('.up', A.cue('United Press'));
    A.fadeIn('.pad', A.cue('He wrote') - 0.2, 0.6, 20);
    A.draw('.ln', A.cue('He wrote'), 3);
    A.fadeIn('.q', A.cue('not one'), 0.8, 10);
    A.fadeIn('.q2', A.cue('ten-pins'), 0.8, 10);
    return { svg: `${sky()}${L.ground(900)}${L.person(380, 980, 2, { coat: P.slate, hat: 'bowler', skin: '#E2B48C', cls: 'person wm' })}
      ${tag(380, 240, 'WEBB MILLER', { size: 50, fill: P.snow, cls: 'tag nm' })}${tag(380, 340, 'UNITED PRESS · AMERICAN REPORTER', { size: 30, fill: P.amber3, cls: 'tag up' })}
      ${g('pad', `<rect x="760" y="160" width="1060" height="680" fill="${P.snow}" ${S}/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line class="ln" x1="820" y1="${600 + i * 30}" x2="${1500 + (i % 3) * 80}" y2="${600 + i * 30}" stroke="${P.ink}" stroke-width="4" opacity="0.4" pathLength="1" stroke-dasharray="1 1"/>`).join('')}`, shadow)}
      ${label(1290, 290, '"Not one of the marchers', { font: 'Playfair Display', weight: 700, size: 52, cls: 'q' })}${label(1290, 360, 'even raised an arm', { font: 'Playfair Display', weight: 700, size: 52, cls: 'q' })}${label(1290, 430, 'to fend off the blows.', { font: 'Playfair Display', weight: 700, size: 52, cls: 'q' })}
      ${label(1290, 520, 'They went down like ten-pins."', { font: 'Playfair Display', weight: 700, size: 52, color: P.brick, cls: 'q2' })}` };
  },

  s25(A) {
    A.pop('.tg', 0.3);
    A.loop('.key', { rotation: 0, ...TO('0% 100%') }, { rotation: -8, ...TO('0% 100%') }, 0.15, 0.5);
    A.pop('.blk', A.cue('blocked'));
    A.fadeOut('.blk', A.cue('Only after') + 1, 0.4);
    A.pop('.thr', A.cue('threatened'));
    A.pop('.pp', A.cue('printed'), 0.3, 0.05);
    A.pop('.n1350', A.cue('one thousand three hundred and fifty'));
    A.pop('.sen', A.cue('Washington'));
    let pp = ''; for (let i = 0; i < 18; i++) pp += `<g class="pp"><rect x="${980 + (i % 6) * 140}" y="${300 + Math.floor(i / 6) * 150}" width="120" height="130" fill="${P.snow}" ${Sthin}/><rect x="${995 + (i % 6) * 140}" y="${320 + Math.floor(i / 6) * 150}" width="90" height="14" fill="${P.ink}"/><rect x="${995 + (i % 6) * 140}" y="${345 + Math.floor(i / 6) * 150}" width="90" height="50" fill="${P.ink}" opacity="0.25"/></g>`;
    return { svg: `${sky()}${L.ground(900)}
      ${g('tg', `<rect x="200" y="640" width="440" height="80" fill="${P.mol3}" ${S}/><rect class="key" x="380" y="600" width="120" height="30" rx="8" fill="${P.ink2}" ${Sthin}/><path d="M640 680H900" stroke="${P.ink}" stroke-width="6" stroke-dasharray="12 10"/>`, shadow)}
      ${L.stamp(420, 420, 'BLOCKED BY CENSORS', { size: 50, cls: 'stamp blk' })}${tag(420, 420, 'MILLER THREATENS TO EXPOSE IT', { size: 32, fill: P.snow, cls: 'tag thr' })}
      ${pp}${tag(1400, 200, '~1,350 NEWSPAPERS', { size: 50, fill: P.amber3, cls: 'tag n1350' })}
      ${tag(1400, 800, 'READ INTO THE U.S. SENATE RECORD', { size: 36, fill: P.snow, cls: 'tag sen' })}` };
  },

  s26(A) {
    A.pop('.cover', A.cue('Time magazine'));
    A.pop('.moy', A.cue('Man of the Year'));
    A.fadeIn('.cmp', A.cue('comparison') - 0.2, 0.6, 0);
    A.pop('.tea', A.cue('tea'));
    A.pop('.btp', A.cue('Boston Tea Party'));
    return { svg: `${sky()}
      ${g('cover', `<rect x="180" y="120" width="560" height="760" fill="${P.brick}" ${S}/><rect x="220" y="260" width="480" height="580" fill="${P.paper}" ${Sthin}/>${label(460, 230, 'TIME', { font: 'Playfair Display', weight: 900, size: 110, color: P.snow })}${I.gandhi(460, 820, 2.3, { pose: 'stand' })}`, shadow)}
      ${tag(460, 950, 'MAN OF THE YEAR · 1930', { size: 40, fill: P.amber3, cls: 'tag moy' })}
      ${g('cmp', `${I.saltPile(1000, 700, 1)}${label(1250, 660, '=', { font: 'Playfair Display', weight: 900, size: 140 })}${g('tea', `<rect x="1400" y="560" width="200" height="150" fill="${P.olive}" ${S}/>${label(1500, 650, 'TEA', { font: 'Oswald', weight: 700, size: 50, color: P.snow })}`, shadow)}`)}
      ${tag(1250, 300, "INDIA'S BOSTON TEA PARTY", { size: 52, fill: P.snow, cls: 'tag btp' })}` };
  },

  s27(A) {
    A.pop('.q', 0.2);
    A.pop('.no', A.cue('Not right away'));
    A.pop('.cal', A.cue('nineteen thirty-one'));
    A.slideIn('.gL', A.cue('released'), 0.9, -400); A.slideIn('.iR', A.cue('Lord Irwin'), 0.9, 400);
    A.pop('.eq', A.cue('as equals'));
    A.pop('.but', A.cue('did not give'));
    return { svg: `${sky()}${L.ground(900)}${tag(960, 120, 'DID THE SALT MARCH WIN?', { size: 56, fill: P.snow, cls: 'tag q' })}${tag(960, 230, 'NOT RIGHT AWAY', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag no' })}
      ${L.calendar(80, 320, 'EARLY', '1931', '').replace('class="calendar"', 'class="cal"')}
      <rect x="640" y="760" width="640" height="40" fill="${P.mol3}" ${S}/><rect x="680" y="800" width="24" height="100" fill="${P.ink2}"/><rect x="1216" y="800" width="24" height="100" fill="${P.ink2}"/>
      ${g('gL', I.gandhi(560, 960, 1.4, { pose: 'stand' }))}${g('iR', I.officer(1380, 960, 1.4, { hat: 'none', coat: P.ink }))}
      ${tag(960, 640, 'TALKS AS EQUALS', { size: 44, fill: P.amber3, cls: 'tag eq' })}${tag(1580, 360, 'NO FREEDOM YET · SALT TAX STAYS', { size: 32, fill: P.snow, cls: 'tag but' })}` };
  },

  s28(A) {
    A.fadeIn('.few', 0.2, 0.6, 0);
    A.pop('.ftk', A.cue('a few thousand'));
    A.fadeIn('.many', A.cue('went along'), 0.8, 30);
    A.pop('.refuse', A.cue('refuse'));
    A.fadeIn('.nq', A.cue('Nehru'), 0.8, 20);
    A.fadeOut('.few, .many, .ftk, .refuse', A.cue('Seventeen years later') - 0.4, 0.4);
    A.fadeOut('.nq', A.cue('Seventeen years later') - 0.4, 0.4);
    A.pop('.cal', A.cue('August fifteenth'));
    A.fadeIn('.flag', A.cue('August fifteenth') + 0.4, 0.8, 30);
    A.loop('.flag .cloth', { skewY: 0 }, { skewY: 3 }, 0.9, A.cue('became independent'));
    return { svg: `${sky()}${L.ground(900)}
      ${g('few', [0, 1, 2].map((i) => I.officer(200 + i * 90, 980, 0.8)).join(''))}${tag(300, 640, 'A FEW THOUSAND OFFICIALS', { size: 32, fill: P.snow, cls: 'tag ftk' })}
      ${I.crowd(640, 1860, 960, 40, 0.55, 9, 'crowd many')}${tag(1250, 560, 'MILLIONS WHO COULD REFUSE', { size: 44, fill: P.amber3, cls: 'tag refuse' })}
      ${g('nq', `<rect x="300" y="120" width="1320" height="220" fill="${P.snow}" ${S}/>${label(960, 210, '"The real importance … lay in the effect', { font: 'Playfair Display', weight: 700, size: 44 })}${label(960, 275, 'they had on our own people."  — Jawaharlal Nehru', { font: 'Playfair Display', weight: 700, size: 44 })}`, shadow)}
      ${L.calendar(160, 160, 'AUGUST', '15', '1947').replace('class="calendar"', 'class="cal"')}
      ${g('flag', `<line x1="1100" y1="160" x2="1100" y2="900" stroke="${P.ink}" stroke-width="10"/><g class="cloth"><rect x="1100" y="160" width="360" height="80" fill="${P.amber2}" ${Sthin}/><rect x="1100" y="240" width="360" height="80" fill="${P.snow}" ${Sthin}/><rect x="1100" y="320" width="360" height="80" fill="${P.olive}" ${Sthin}/><circle cx="1280" cy="280" r="30" fill="none" stroke="${P.slate}" stroke-width="5"/></g>${label(1280, 480, 'INDEPENDENCE', { font: 'Oswald', weight: 700, size: 54 })}`, shadow)}` };
  },

  s29(A) {
    A.pop('.q', 0.2);
    A.pop('.nf', A.cue('Not with force')); A.draw('.nf .xmark path', A.cue('Not with force') + 0.2, 0.4);
    A.pop('.r1', A.cue('everyone could break'));
    A.pop('.r2', A.cue('whole world'));
    A.pop('.r3', A.cue('refused to fight back'));
    A.fadeOut('.r1, .r2, .r3, .nf', A.cue('An empire can') - 0.3, 0.4);
    A.pop('.army', A.cue('fight an army'));
    A.fadeIn('.mil', A.cue('millions of people'), 0.8, 30);
    A.pop('.no', A.cue('say no'));
    return { svg: `${sky()}${L.ground(900)}${tag(960, 120, 'HOW DID SALT SHAKE AN EMPIRE?', { size: 54, fill: P.snow, cls: 'tag q' })}
      ${g('nf', `${tag(960, 260, 'FORCE', { size: 50 })}${L.cross(960, 260, 70)}`)}
      ${tag(960, 420, '1. A LAW EVERYONE COULD BREAK', { size: 42, fill: P.amber3, cls: 'tag r1' })}${tag(960, 540, '2. BROKEN IN FRONT OF THE WORLD', { size: 42, fill: P.amber3, cls: 'tag r2' })}${tag(960, 660, '3. NO FIGHTING BACK', { size: 42, fill: P.amber3, cls: 'tag r3' })}
      ${g('army', `${[0, 1, 2].map((i) => L.person(260 + i * 110, 980, 0.9, { coat: P.olive, hat: 'helmet' })).join('')}${tag(370, 640, 'AN ARMY: EASY TO FIGHT', { size: 32, fill: P.snow })}`)}
      ${I.crowd(760, 1880, 980, 34, 0.55, 12, 'crowd mil')}${tag(1320, 460, 'MILLIONS SAYING NO: HARD', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag no' })}` };
  },

  s30(A) {
    A.fadeIn('.lower', 0.4, 0.6, 0); A.fadeOut('.lower', 5.5, 0.6);
    A.slideIn('.mlk', A.cue('Martin Luther King'), 1, -400);
    A.pop('.book', A.cue('read about'));
    A.pop('.q1', A.cue('particularly moved'));
    A.fadeOut('.q1, .book', A.cue('bus boycott') - 0.3, 0.4);
    A.drift('.bus', A.cue('bus boycott'), 4, { x: 600 }, { x: 0 }, 'power2.out');
    A.pop('.q2', A.cue('Christ furnished'));
    A.fadeOut('.q2, .bus', A.cue('In nineteen fifty-nine') - 0.3, 0.4);
    A.pop('.cal', A.cue('In nineteen fifty-nine'));
    A.pop('.q3', A.cue('to other countries'));
    return { svg: `${sky()}${L.ground(900)}${L.person(360, 980, 1.9, { coat: P.ink, hat: 'none', skin: '#7A4E30', cls: 'person mlk' })}
      ${tag(360, 280, 'MARTIN LUTHER KING JR.', { size: 40, fill: P.snow, cls: 'tag nm' })}
      ${g('book', `<path d="M820 360h260v340h-260z" fill="${P.brick}" ${S}/>${label(950, 520, 'GANDHI', { font: 'Oswald', weight: 700, size: 46, color: P.snow })}`, shadow)}
      ${g('q1', `<rect x="1140" y="300" width="720" height="200" fill="${P.snow}" ${S}/>${label(1500, 385, '"Particularly moved by his', { font: 'Playfair Display', weight: 700, size: 42 })}${label(1500, 445, 'Salt March to the Sea"', { font: 'Playfair Display', weight: 700, size: 42 })}`, shadow)}
      <g class="bus">${L.trainCar(800, 860, 560, 'tc', P.amber2)}${label(1080, 800, 'MONTGOMERY', { font: 'Oswald', weight: 700, size: 32 })}</g>
      ${g('q2', `<rect x="760" y="200" width="1100" height="200" fill="${P.snow}" ${S}/>${label(1310, 285, '"Christ furnished the spirit…', { font: 'Playfair Display', weight: 700, size: 46 })}${label(1310, 350, 'Gandhi furnished the method."', { font: 'Playfair Display', weight: 700, size: 46 })}`, shadow)}
      ${L.calendar(820, 120, 'INDIA TRIP', '1959', '').replace('class="calendar"', 'class="cal"')}
      ${g('q3', `<rect x="1160" y="200" width="700" height="300" fill="${P.snow}" ${S}/>${label(1510, 290, '"To other countries I may', { font: 'Playfair Display', weight: 700, size: 42 })}${label(1510, 350, 'go as a tourist, but to India', { font: 'Playfair Display', weight: 700, size: 42 })}${label(1510, 410, 'I come as a pilgrim."', { font: 'Playfair Display', weight: 700, size: 42 })}`, shadow)}`,
      over: lower('MONTGOMERY, ALABAMA', '1950s') };
  },

  s31(A) {
    A.pop('.cal', 0.2);
    A.drift('.us', 0, A.dur, { x: -300 }, { x: 300 });
    A.loop('.us .person', { y: 0 }, { y: -5 }, 0.5);
    A.pop('.m54', A.cue('fifty-four miles'));
    A.pop('.vote', A.cue('right to vote'));
    A.fadeIn('.dandi', A.cue('A march to the sea') - 0.2, 0.8, 0);
    let us = ''; for (let i = 0; i < 12; i++) us += L.person(200 + i * 110, 960 + (i % 2) * 12, 0.85, { coat: [P.ink2, P.slate, P.brick, P.olive][i % 4], hat: i % 3 ? 'none' : 'bowler', skin: ['#7A4E30', '#5E3A22', '#E2B48C', '#8C5C3A'][i % 4] });
    return { svg: `${sky()}<rect x="-200" y="860" width="2320" height="600" fill="${P.paper3}" ${S}/>${L.calendar(80, 80, 'MARCH', '1965', 'SELMA').replace('class="calendar"', 'class="cal"')}
      <g class="us">${us}</g>${tag(1300, 180, 'SELMA → MONTGOMERY: 54 MILES', { size: 44, fill: P.snow, cls: 'tag m54' })}${tag(1300, 300, 'FOR THE RIGHT TO VOTE', { size: 44, fill: P.amber3, cls: 'tag vote' })}
      ${g('dandi', `<rect x="1050" y="400" width="760" height="300" fill="${P.paper}" ${S}/>${I.gandhi(1200, 680, 0.9, { pose: 'walk' })}${label(1500, 520, 'DANDI 1930', { font: 'Oswald', weight: 700, size: 46 })}${label(1500, 590, '→ SELMA 1965', { font: 'Oswald', weight: 700, size: 46, color: P.brick })}`, shadow)}` };
  },

  s32(A) {
    A.loop('.ripple', { x: 0 }, { x: -60 }, 2.6);
    A.pop('.mem', A.cue('memorial'));
    A.fadeOut('.mem', A.cue('It was only') - 0.3, 0.4);
    A.fadeIn('.ttl', A.cue('It was only'), 1, 30);
    A.pop('.sub', A.cue('subscribe'));
    A.pop('.cm', A.cue('comments'));
    return { svg: `${sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.2"/>${I.beach(800, 940)}${I.saltPile(960, 950, 0.7)}
      ${tag(960, 300, 'DANDI: NATIONAL SALT SATYAGRAHA MEMORIAL', { size: 42, fill: P.snow, cls: 'tag mem' })}
      ${label(960, 300, 'A HANDFUL', { font: 'Playfair Display', weight: 900, size: 120, color: P.snow, cls: 'ttl' })}${label(960, 430, 'OF SALT', { font: 'Playfair Display', weight: 900, size: 140, color: P.amber3, cls: 'ttl' })}
      ${tag(640, 640, 'SUBSCRIBE FOR MORE', { size: 50, fill: P.brick2, color: P.snow, cls: 'tag sub' })}${tag(1300, 640, 'WHICH STORY NEXT?', { size: 50, fill: P.amber3, cls: 'tag cm' })}` };
  },
};

export function sfx(clips) {
  const total = clips.at(-1).start + clips.at(-1).dur;
  const by = Object.fromEntries(clips.map((c) => [c.id, c]));
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(740, total), vol: 0.18, fadeIn: 2, fadeOut: 4 },
    { id: 'fx_sea1', file: 'sea.wav', start: 0, dur: by.s03.start + by.s03.dur, vol: 0.25, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_sea2', file: 'sea.wav', start: by.s15.start, dur: by.s15.dur + by.s16.dur, vol: 0.25, fadeIn: 1, fadeOut: 2 },
    { id: 'fx_sea3', file: 'sea.wav', start: by.s32.start, dur: by.s32.dur, vol: 0.22, fadeIn: 1, fadeOut: 3 },
  ];
}
