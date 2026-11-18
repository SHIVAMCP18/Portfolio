// The Wave That Wasn't Water — scene builders. Each returns { svg, over } and schedules animation on A.
import * as L from '../lib/inkamber.mjs';
const { P, g, label, tag, S, Sthin, shadow } = L;

export const title = "The Wave That Wasn't Water";
export const chapters = {
  s05: [1, 'Rum & Bullets'], s08: [2, 'The Tank That Groaned'], s14: [3, 'A Warm Day in January'],
  s16: [4, 'The Wave'], s22: [5, 'Rescue & Ruin'], s25: [6, 'Who Was to Blame?'], s29: [7, 'The Answer'],
};
export const chapterSvg = (n, t) => L.chapterCard(n, t);

const lower = (a, b) => `<div class="lower">${a}${b ? ` · <b>${b}</b>` : ''}</div>`;
const TO = (o) => ({ transformOrigin: o });
const C = TO('50% 50%'), B = TO('50% 100%');

// shared street backdrop
function street(o = {}) {
  return `${L.sky(o.sky)}${o.sun !== false ? L.sun(o.sunX || 1600, 190, 64) : ''}${L.cloud(300, 240, 1.1, 'cloud c1')}${L.cloud(1100, 170, 0.8, 'cloud c2')}
  ${o.steeple !== false ? L.steeple(1500, 640, 0.9) : ''}${L.skyline(-120, 2100, 860, o.seed || 4, { minH: 200, varH: 160 })}${L.ground(860)}
  ${L.snowbank(-40, 870, 400)}${L.snowbank(1300, 878, 360)}`;
}
function ambient(A) {
  A.drift('.c1', 0, A.dur, { x: -40 }, { x: 160 });
  A.drift('.c2', 0, A.dur, { x: 0 }, { x: -140 });
  A.drift('.sun .rays', 0, A.dur, { rotation: 0, ...C }, { rotation: 40, ...C });
}

export const scenes = {
  s01(A) {
    const ppl = [L.person(300, 940, 1, { coat: P.brick, hat: 'bonnet', skirt: true, cls: 'person w1' }), L.person(420, 950, 1, { coat: P.slate, child: true, cls: 'person w2' }), L.person(1300, 960, 1.05, { coat: P.olive, hat: 'bowler', cls: 'person w3' }), L.horseCart(1650, 1000, 0.9, 'cart w4')];
    ambient(A);
    A.drift('.w1', 0, A.dur, { x: 0 }, { x: 420 }); A.drift('.w2', 0, A.dur, { x: 0 }, { x: 420 });
    A.loop('.w1, .w2', { y: 0 }, { y: -6 }, 0.45);
    A.drift('.w3', 0, A.dur, { x: 0 }, { x: -380 }); A.drift('.w4', 0, A.dur, { x: 0 }, { x: -520 });
    A.camera({ scale: 1.12, x: 60, y: 30 }, { scale: 1.0, x: 0, y: 0 });
    A.fadeIn('.lower', 0.6, 0.8, 0); A.fadeOut('.lower', 6, 0.6);
    return { svg: `${street()}${L.ground(860).replace('class="ground"', 'class="ground2" opacity="0"')}${ppl.join('')}`, over: lower('BOSTON, NORTH END', 'JANUARY 15, 1919') };
  },

  s02(A) {
    const tW = A.cue('wall'), tN = A.cue('not water');
    ambient(A);
    A.drift('.wave', tW, A.dur - tW, { x: -1300 }, { x: 1500 }, 'power1.in');
    A.loop('.wave .drop', { y: 0 }, { y: -18 }, 0.4);
    ['.r1', '.r2', '.r3'].forEach((s, i) => { A.drift(s, tW + 1 + i * 0.3, A.dur - tW, { x: 0 }, { x: 900 }, 'power1.in'); A.loop(s, { y: 0 }, { y: -10 }, 0.25, tW); });
    A.pop('.notwater', tN, 0.6);
    A.camera({ scale: 1.0 }, { scale: 1.08, x: 40 }, 'power1.in');
    A.tween('.cam', tN, 0.12, { x: 0 }, { x: 14 }, 'none', { repeat: 7, yoyo: true });
    return { svg: `${street({ sky: 'url(#dusk)' })}${L.person(700, 950, 1, { pose: 'run', coat: P.brick, cls: 'person r1' })}${L.person(860, 960, 0.9, { pose: 'run', child: true, coat: P.olive, cls: 'person r2' })}${L.person(1000, 955, 1, { pose: 'run', coat: P.slate, hat: 'bowler', cls: 'person r3' })}${L.molassesWave(0, 1040, 760)}${tag(1480, 260, 'NOT WATER', { size: 70, fill: P.amber3, cls: 'tag notwater' })}` };
  },

  s03(A) {
    const t1 = A.cue('two million'), t2 = A.cue('twenty-one'), t3 = A.cue('a hundred and fifty'), tq = A.cue('how does syrup');
    A.loop('.flood .gloss', { x: 0 }, { x: 40 }, 2.2);
    A.pop('.k1', t1); A.pop('.k2', t2); A.pop('.k3', t3);
    A.fadeOut('.k1, .k2, .k3', tq - 0.4, 0.4);
    A.pop('.q1', tq, 0.7); A.pop('.q2', A.cue('why did'), 0.7);
    return { svg: `${L.sky('url(#dusk)')}${L.skyline(-120, 2100, 760, 9, { minH: 160, varH: 140 })}${L.ground(760, P.paper3)}${L.flood(700)}
      ${tag(960, 290, '2,300,000 GALLONS', { size: 84, fill: P.amber3, cls: 'tag k1' })}${tag(640, 520, '21 DEAD', { size: 72, cls: 'tag k2' })}${tag(1280, 520, '150 HURT', { size: 72, cls: 'tag k3' })}
      ${tag(960, 300, 'HOW DOES SYRUP KILL?', { size: 92, fill: P.snow, cls: 'tag q1' })}${tag(960, 500, 'AND WHY DID IT CHANGE AMERICA?', { size: 54, fill: P.amber3, cls: 'tag q2' })}` };
  },

  s04(A) {
    A.fadeIn('.ttl', 0.2, 1.2, 40); A.fadeIn('.sub', 1.0, 1.0, 20);
    A.fadeIn('.cal', A.cue('four years'), 0.7); A.pop('.tank', A.cue('steel tank'), 0.8);
    A.slideIn('.jell', A.cue('a man'), 0.9, 300);
    A.loop('.water .ripple', { x: 0 }, { x: -60 }, 2.5);
    return { svg: `${L.sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.25"/>${L.water(820, 300)}
      ${L.tank(1500, 820, 300, 200, { cls: 'tank' })}${L.person(1730, 830, 1.2, { coat: P.ink2, hat: 'bowler', glasses: true, cls: 'person jell' })}
      ${label(700, 330, "THE WAVE THAT", { font: 'Playfair Display', weight: 900, size: 120, color: P.snow, cls: 'ttl' })}
      ${label(700, 470, "WASN'T WATER", { font: 'Playfair Display', weight: 900, size: 140, color: P.amber3, cls: 'ttl' })}
      ${label(700, 560, 'THE GREAT MOLASSES FLOOD OF 1919', { font: 'Oswald', weight: 500, size: 44, color: P.paper2, letter: 6, cls: 'sub' })}
      ${L.calendar(120, 620, 'BACK TO', '1915', '').replace('class="calendar"', 'class="cal"')}` };
  },

  s05(A) {
    A.pop('.cane', A.cue('sugar cane') - 0.3);
    A.pop('.pot', A.cue('boiled'));
    A.tween('.syrup', A.cue('thick'), 1.4, { scaleY: 0, ...TO('50% 0%') }, { scaleY: 1, ...TO('50% 0%') }, 'power1.out');
    A.pop('.barrel', A.cue('thick') + 0.8);
    const tc = A.cue('Caribbean');
    A.fadeIn('.map', tc - 0.6, 0.8);
    A.draw('.route', tc, 2.2);
    A.drift('.mship', tc, 3.4, { x: 0, y: 0 }, { x: 330, y: -470 }, 'power1.inOut');
    A.pop('.rumbottle', A.cue('rum'));
    A.pop('.yrs', A.cue('two hundred years'));
    A.loop('.mship', { rotation: -3, ...C }, { rotation: 3, ...C }, 1.2);
    // simplified east-coast + caribbean, stylised
    const map = g('map', `<rect x="1000" y="120" width="820" height="840" fill="${P.slate3}" ${S} ${shadow}/>
      <path d="M1000 120H1520L1500 210L1440 260L1450 330L1380 380L1360 470L1300 540L1290 640L1240 690L1250 780L1180 800L1000 800Z" fill="${P.paper2}" ${S}/>
      <path d="M1250 860q60 -20 120 -6q40 10 90 -4l10 22q-80 26 -220 8z" fill="${P.olive2}" ${S}/><path d="M1520 900q30 -12 70 -2l-4 18q-40 8 -66 -2z" fill="${P.olive2}" ${S}/><path d="M1640 930l30 -6l6 16l-34 4z" fill="${P.olive2}" ${S}/>
      <circle cx="1480" cy="230" r="14" fill="${P.brick}" ${S}/>${label(1480, 190, 'BOSTON', { font: 'Oswald', weight: 700, size: 36 })}
      ${label(1490, 990, 'CARIBBEAN', { font: 'Oswald', weight: 700, size: 36 })}
      <path class="route" d="M1430 880C1600 760 1640 520 1560 380S1500 260 1490 245" stroke="${P.brick}" stroke-width="7" fill="none" stroke-dasharray="1 1" pathLength="1"/>
      <g class="mship">${L.ship(1300, 900, 0.22, { sail: true, cls: 'mini' })}</g>`);
    return { svg: `${L.sky()}${L.ground(860)}${L.caneStalks(120, 860, 1.1)}
      ${g('pot', `<path d="M430 760h220l-20 100h-180z" fill="${P.ink}" ${S}/><path d="M440 760q100 -40 200 0" fill="${P.amber}" ${S}/><path d="M450 860l-30 40M630 860l30 40" ${S}/>`, shadow)}
      <rect class="syrup" x="530" y="800" width="20" height="120" fill="${P.mol2}"/>${L.barrel(540, 1010, 0.9, 'barrel', P.amber)}
      ${map}${L.bottle(860, 860, 1.1, 'rumbottle')}${tag(860, 600, '200 YEARS OF RUM', { size: 34, cls: 'tag yrs' })}` };
  },

  s06(A) {
    A.fadeIn('.yr', 0.2, 0.6, 0);
    A.smoke('.sm1', 0, 3.4, 220); A.smoke('.sm2', 0.8, 3.0, 200);
    A.pop('.barrel', A.cue('Ferment') - 0.2);
    A.draw('.ar1', A.cue('Ferment') + 0.4, 0.6);
    A.pop('.alc', A.cue('industrial alcohol'));
    A.draw('.ar2', A.cue('key ingredient'), 0.6);
    A.pop('.shell', A.cue('explosives'), 0.6, 0.15);
    A.fadeIn('.war', A.cue('Europe'), 0.8);
    A.loop('.shell', { y: 0 }, { y: -8 }, 0.9, A.cue('explosives') + 0.7);
    const shells = [0, 1, 2, 3, 4].map((i) => L.shell(1360 + i * 90, 870, 0.8, 'shell')).join('');
    return { svg: `${L.sky()}${L.ground(860)}${L.factory(80, 860, 1.05)}${L.smoke(445, 410, 5, 'smoke sm1', 1.3)}${L.smoke(355, 450, 5, 'smoke sm2', 1.1)}
      ${L.barrel(740, 860, 1, 'barrel', P.mol3)}${label(740, 920, 'MOLASSES', { font: 'Oswald', weight: 700, size: 34 })}
      <path class="ar1" d="M820 760H930" stroke="${P.ink}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      ${g('alc', `<path d="M1030 600h60v90l70 150q10 30 -20 30h-160q-30 0 -20 -30l70 -150z" fill="${P.snow}" ${S}/><path d="M985 800l50 -100h110l50 100q8 22 -14 22h-172q-22 0 -14 -22z" fill="${P.amber2}"/>`, `${shadow}`)}
      ${label(1060, 930, 'INDUSTRIAL ALCOHOL', { font: 'Oswald', weight: 700, size: 34 })}
      <path class="ar2" d="M1220 760H1310" stroke="${P.ink}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      ${shells}${label(1540, 930, 'EXPLOSIVES', { font: 'Oswald', weight: 700, size: 34 })}
      ${tag(1540, 210, '1915 · EUROPE AT WAR', { size: 44, fill: P.brick2, cls: 'tag war' })}${tag(300, 160, '1915', { size: 44, cls: 'tag yr' })}` };
  },

  s07(A) {
    A.fadeIn('.doc1', 0.2, 0.8);
    A.pop('.st1', A.cue('bought'), 0.5);
    A.fadeOut('.doc1, .st1', A.cue('wanted') + 0.6, 0.5);
    A.fadeIn('.harbor', A.cue('giant storage tank') - 0.3, 0.8, 0);
    A.pop('.tank', A.cue('giant storage tank'));
    A.drift('.hship', A.cue('Ships'), 2.2, { x: -300 }, { x: 0 }, 'power2.out');
    A.draw('.pump', A.cue('pump'), 1);
    A.draw('.pipe', A.cue('pipeline'), 2.2);
    A.pop('.dist', A.cue('distillery'));
    A.fadeIn('.lb', A.cue('Cambridge'), 0.6, 10);
    A.loop('.harbor .ripple', { x: 0 }, { x: -50 }, 2.2);
    return { svg: `${L.sky()}
      ${g('harbor', `${L.water(640, 500)}<path d="M-200 640H700L760 560H1300L1340 470H2120V-200H-200Z" fill="${P.paper2}" ${S}/><rect x="760" y="520" width="1500" height="40" fill="url(#dots)"/>
        <path d="M1300 560L1340 470H2120V610Q1700 640 1330 600Z" fill="${P.slate2}" ${S}/>${label(1720, 560, 'CHARLES RIVER', { font: 'Oswald', weight: 700, size: 30, color: P.snow, letter: 4 })}
        <g class="hship">${L.ship(330, 780, 0.6)}</g>
        <path class="pump" d="M480 700Q560 640 640 560" stroke="${P.mol2}" stroke-width="12" fill="none" stroke-dasharray="1 1" pathLength="1"/>
        <path class="pipe" d="M760 480C900 380 1100 330 1300 340S1580 300 1640 260" stroke="${P.mol2}" stroke-width="12" fill="none" stroke-dasharray="1 1" pathLength="1" stroke-linecap="round"/>
        ${L.factory(1560, 300, 0.45, 'dist')}
        ${label(660, 640, 'COMMERCIAL ST., BOSTON', { font: 'Oswald', weight: 700, size: 30, cls: 'lb' })}${label(1660, 360, 'DISTILLERY · CAMBRIDGE', { font: 'Oswald', weight: 700, size: 30, cls: 'lb' })}`)}
      ${L.tank(660, 560, 200, 150)}
      ${L.document(600, 220, 720, 520, { title: 'PURITY DISTILLING CO.', size: 52, cls: 'doc1' })}${L.stamp(960, 600, 'U.S. INDUSTRIAL ALCOHOL', { size: 44, cls: 'stamp st1' })}` };
  },

  s08(A) {
    A.slideIn('.jell', 0.1, 1, -300);
    A.pop('.t1', A.cue('treasurer'));
    A.pop('.t2', A.cue('not an engineer'));
    A.pop('.bp', A.cue('blueprint') - 0.3);
    A.tween('.bp', A.cue('blueprint'), 1.2, { rotation: 0, ...C }, { rotation: 180, ...C }, 'back.inOut(1.4)');
    A.pop('.qm', A.cue('blueprint') + 1.2);
    A.pop('.clock', A.cue('pressure'));
    A.tween('.clock .minute', A.cue('pressure'), A.dur - A.cue('pressure'), { rotation: 0, ...TO('50% 100%') }, { rotation: 720, ...TO('50% 100%') }, 'none');
    A.drift('.sh', A.cue('next shipment') - 0.5, 3, { x: 500, opacity: 0 }, { x: 0, opacity: 1 }, 'power2.out');
    A.loop('.jell', { y: 0 }, { y: -5 }, 1.4);
    A.camera({ scale: 1.0 }, { scale: 1.07, x: 40 });
    return { svg: `${L.sky()}${L.water(900, 300)}${L.ground(900, P.paper3)}
      ${L.person(480, 960, 2.6, { coat: P.ink2, hat: 'bowler', glasses: true, cls: 'person jell' })}
      ${tag(480, 160, 'ARTHUR JELL', { size: 56, fill: P.snow, cls: 'tag t0' })}${tag(800, 300, 'COMPANY TREASURER', { size: 40, cls: 'tag t1' })}${tag(800, 400, 'NOT AN ENGINEER', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag t2' })}
      ${L.blueprint(1000, 470, 420, 300, { cls: 'blueprint bp' })}${label(1210, 520, '?', { font: 'Playfair Display', weight: 900, size: 160, color: P.brick, cls: 'qm' })}
      ${L.clock(1640, 330, 120)}<g class="sh">${L.ship(1600, 900, 0.5)}</g>` };
  },

  s09(A) {
    const t0 = 0.2;
    A.tween('.tank', t0, 2.2, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power2.out');
    A.draw('.dimH', A.cue('fifty'), 0.8); A.fadeIn('.lH', A.cue('fifty'), 0.5, 0);
    A.draw('.dimW', A.cue('ninety'), 0.8); A.fadeIn('.lW', A.cue('ninety'), 0.5, 0);
    A.pop('.gal', A.cue('two point three'));
    A.fadeIn('.homes', A.cue('homes') - 0.2, 0.6, 40);
    A.pop('.fire', A.cue('firehouse'));
    A.pop('.play', A.cue('playground'));
    A.fadeIn('.el', A.cue('elevated') - 0.3, 0.8, -40);
    A.drift('.train', A.cue('elevated'), A.dur - A.cue('elevated'), { x: -900 }, { x: 600 });
    A.camera({ scale: 1.15, y: 40 }, { scale: 1.0, y: 0 }, 'power1.inOut');
    return { svg: `${L.sky()}${L.water(880, 300)}${L.ground(860)}
      ${L.skyline(-100, 560, 860, 7, { cls: 'skyline homes', minH: 220 })}
      ${g('fire', L.rowhouse(1330, 860, 230, 250, P.brick, L.rng(2)) + tag(1445, 640, 'ENGINE 31', { size: 26, noShadow: true }), shadow)}
      ${g('play', `<path d="M1620 860l40 -170l40 170M1780 860l-40 -170M1660 690h140" ${S} fill="none"/><path d="M1700 690v110M1760 690v110" ${Sthin}/><rect x="1690" y="800" width="80" height="12" fill="${P.brick}" ${Sthin}/>`, shadow)}
      ${L.tank(960, 860, 520, 420, { paint: P.slate2 })}
      <path class="dimH" d="M640 860V430" stroke="${P.brick}" stroke-width="6" stroke-dasharray="1 1" pathLength="1"/>${label(600, 650, '50 FT', { font: 'Oswald', weight: 700, size: 46, color: P.brick, anchor: 'end', cls: 'lH' })}
      <path class="dimW" d="M700 340H1220" stroke="${P.brick}" stroke-width="6" stroke-dasharray="1 1" pathLength="1"/>${label(960, 320, '90 FT WIDE', { font: 'Oswald', weight: 700, size: 46, color: P.brick, cls: 'lW' })}
      ${tag(960, 640, '2.3 MILLION GALLONS', { size: 46, fill: P.amber3, cls: 'tag gal' })}
      ${g('el', L.elevated(-100, 2100, 210, 860, 'eltrack') + L.trainCar(700, 176, 380, 'train'))}` };
  },

  s10(A) {
    A.fadeIn('.full', A.cue('filling it'), 0.6, 0);
    A.tween('.wfull', A.cue('filling it'), 2, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power1.inOut');
    A.fadeOut('.wfull', A.cue('Jell skipped') - 0.4, 0.4);
    A.pop('.x1', A.cue('skipped')); A.draw('.x1 path', A.cue('skipped'), 0.5);
    A.tween('.wlow', A.cue('few inches'), 1, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power2.out');
    A.pop('.few', A.cue('few inches') + 0.4);
    A.pop('.ok', A.cue('declared it fine'));
    A.tween('.mfill', A.cue('first load') + 0.2, 3, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power1.inOut');
    return { svg: `${L.sky()}${L.ground(900)}
      <path d="M560 300V900A400 60 0 0 0 1360 900V300" fill="${P.paper}" stroke="${P.ink}" stroke-width="8"/><rect class="wfull" x="565" y="320" width="790" height="580" fill="${P.slate3}" opacity="0.8"/><rect class="wlow" x="565" y="870" width="790" height="30" fill="${P.slate2}"/><rect class="mfill" x="565" y="420" width="790" height="480" fill="url(#molg)"/>
      <ellipse cx="960" cy="300" rx="400" ry="60" fill="none" stroke="${P.ink}" stroke-width="8"/><path d="M560 300V900A400 60 0 0 0 1360 900V300" fill="none" stroke="${P.ink}" stroke-width="8"/>
      ${tag(1620, 200, 'PROPER TEST:', { size: 34, cls: 'tag full' })}${tag(1620, 280, 'FILL TO THE TOP', { size: 34, cls: 'tag full' })}${L.cross(1620, 240, 80, 'xmark x1')}
      ${tag(1640, 840, 'A FEW INCHES', { size: 40, fill: P.amber3, cls: 'tag few' })}${L.stamp(330, 560, 'FINE.', { size: 80, cls: 'stamp ok' })}` };
  },

  s11(A) {
    const tl = A.cue('leaked');
    A.draw('.leak', tl, 1.6); A.pop('.drip', tl + 1.4, 0.4, 0.1);
    A.loop('.drip', { y: 0 }, { y: 16 }, 0.8, tl + 1.9);
    A.pop('.seams', A.cue('streaks'));
    A.slideIn('.fam', A.cue('Neighborhood') - 0.2, 1.2, 500);
    A.loop('.fam .person', { y: 0 }, { y: -5 }, 0.6, A.cue('Neighborhood') + 1);
    A.camera({ scale: 1.25, x: 120, y: 80 }, { scale: 1.02, x: 0, y: 0 });
    const pot = (x, y) => `<path d="M${x - 26} ${y}h52l-6 40h-40z" fill="${P.ink2}" ${Sthin}/>`;
    return { svg: `${L.sky()}${L.skyline(1300, 2100, 880, 3)}${L.ground(880)}${L.tank(760, 880, 640, 560, { leaks: 9, seed: 11 })}
      ${tag(760, 180, 'IT LEAKED FROM DAY ONE', { size: 44, cls: 'tag seams' })}
      ${g('fam', `${L.person(1180, 980, 1, { coat: P.brick, hat: 'bonnet', skirt: true })}${pot(1220, 900)}${L.person(1300, 990, 0.95, { child: true, coat: P.olive, hat: 'cap' })}${pot(1330, 930)}${L.person(1440, 985, 1, { coat: P.slate, hat: 'cap' })}${pot(1480, 900)}`)}` };
  },

  s12(A) {
    const tg = A.cue('groaned');
    A.tween('.tank', tg, 0.18, { rotation: -0.6, ...B }, { rotation: 0.6, ...B }, 'sine.inOut', { repeat: 14, yoyo: true });
    A.pop('.groan', tg, 0.5);
    A.fadeOut('.groan', tg + 3, 0.5);
    A.slideIn('.worker', A.cue('Workers'), 0.9, 400);
    A.pop('.flake', A.cue('flaking steel'));
    A.slideIn('.jell', A.cue("Jell's response") - 0.3, 0.8, -400);
    A.tween('.brown', A.cue('painted brown'), 2.4, { scaleY: 0, ...TO('50% 0%') }, { scaleY: 1, ...TO('50% 0%') }, 'power1.inOut');
    A.drift('.roller', A.cue('painted brown'), 2.4, { y: 0 }, { y: 520 }, 'power1.inOut');
    A.pop('.hide', A.cue('harder to see'));
    return { svg: `${L.sky()}${L.ground(900)}
      ${L.tank(820, 900, 600, 560, { leaks: 8, seed: 3 })}
      <path class="brown" d="M520 340V900A300 50 0 0 0 1120 900V340Z" fill="${P.mol3}" opacity="0.92"/>
      ${g('roller', `<rect x="1080" y="290" width="40" height="110" rx="10" fill="${P.mol2}" ${S}/><path d="M1120 345h60v-120" ${S} fill="none"/>`)}
      ${tag(820, 200, 'G R O A N', { size: 70, fill: P.snow, cls: 'tag groan' })}
      ${L.person(1400, 1000, 1.3, { coat: P.olive, hat: 'cap', cls: 'person worker' })}${g('flake', `<path d="M1460 820l40 -14l12 22l-30 20z" fill="${P.slate2}" ${S}/>`)}
      ${L.person(1680, 1000, 1.4, { coat: P.ink2, hat: 'bowler', glasses: true, cls: 'person jell' })}
      ${tag(820, 620, 'HIDE IT', { size: 60, fill: P.brick2, color: P.snow, cls: 'tag hide' })}` };
  },

  s13(A) {
    const t0 = A.cue('Constitution');
    A.pop('.cal', 0.3);
    A.pop('.n1', A.cue('winning') - 0.2); A.pop('.n2', A.cue('state after state')); A.pop('.n3', A.cue('state after state') + 0.6);
    A.pop('.btl', t0 - 0.8); A.draw('.btlx path', t0, 0.5);
    A.pop('.race', A.cue('racing'));
    A.tween('.race .bar', A.cue('racing'), 4, { scaleX: 0.1, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power1.inOut');
    return { svg: `${L.sky()}${L.calendar(140, 160, 'JANUARY', '1919', '').replace('class="calendar"', 'class="cal"')}
      ${L.newspaper(560, 120, 560, 520, 'THE DAILY', 'DRY LAW GAINS', 'Another state votes for Prohibition', { cls: 'paper n1', headSize: 60 })}
      ${L.newspaper(700, 220, 560, 520, 'EVENING POST', 'NATION NEARLY DRY', 'Ratification only days away', { cls: 'paper n2', headSize: 60 })}
      ${L.newspaper(840, 320, 560, 520, 'THE HERALD', 'BOOZE BAN COMING', 'Distillers rush to finish stock', { cls: 'paper n3', headSize: 60 })}
      ${L.bottle(1650, 640, 1.5, 'btl')}${L.cross(1650, 480, 130, 'xmark btlx')}
      ${g('race', `<rect x="400" y="900" width="1120" height="60" fill="${P.snow}" ${S}/><rect class="bar" x="400" y="900" width="1120" height="60" fill="${P.amber2}" ${S}/>${label(960, 880, 'TURN MOLASSES INTO ALCOHOL BEFORE THE LAW', { font: 'Oswald', weight: 700, size: 34 })}`, shadow)}` };
  },

  s14(A) {
    A.pop('.cal', 0.2);
    A.pop('.thermo', A.cue('bitterly cold') - 0.4);
    A.tween('.merc', A.cue('bitterly cold'), 0.8, { scaleY: 0.12, ...B }, { scaleY: 0.12, ...B }, 'none');
    A.tween('.merc', A.cue('jumped'), 2.2, { scaleY: 0.12, ...B }, { scaleY: 0.55, ...B }, 'power2.inOut');
    A.pop('.f0', A.cue('zero')); A.pop('.f40', A.cue('over forty'));
    A.drift('.sh', A.cue('fresh load') - 0.6, 2.2, { x: 600 }, { x: 0 }, 'power2.out');
    A.tween('.cold', A.cue('fresh load'), 1, { opacity: 0 }, { opacity: 1 }, 'none');
    A.tween('.warm', A.cue('poured'), 2.4, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'power1.inOut');
    A.pop('.lw', A.cue('poured') + 1.2); A.pop('.lc', A.cue('cold molasses'));
    A.pop('.full', A.cue('almost full'));
    A.loop('.water .ripple', { x: 0 }, { x: -50 }, 2.2);
    return { svg: `${L.sky()}${L.water(900, 300)}${L.ground(900, P.paper3)}
      ${L.calendar(90, 120, 'JANUARY', '15', '1919').replace('class="calendar"', 'class="cal"')}
      ${L.thermometer(560, 180, 560)}${tag(730, 668, '~0°F', { size: 38, cls: 'tag f0' })}${tag(730, 440, '40°F+', { size: 38, fill: P.amber3, cls: 'tag f40' })}
      <path d="M940 300V860A320 50 0 0 0 1580 860V300" fill="${P.paper}" stroke="${P.ink}" stroke-width="8"/>
      <rect class="cold" x="944" y="560" width="632" height="300" fill="${P.mol}"/><rect class="warm" x="944" y="345" width="632" height="215" fill="${P.amber}"/>
      <path d="M940 300V860A320 50 0 0 0 1580 860V300" fill="none" stroke="${P.ink}" stroke-width="8"/><ellipse cx="1260" cy="300" rx="320" ry="50" fill="none" stroke="${P.ink}" stroke-width="8"/>
      ${tag(1260, 450, 'WARM, NEW', { size: 34, fill: P.amber3, cls: 'tag lw' })}${tag(1260, 720, 'COLD, OLD', { size: 34, fill: P.slate3, cls: 'tag lc' })}${tag(1260, 220, 'ALMOST FULL', { size: 40, fill: P.brick2, color: P.snow, cls: 'tag full' })}
      <g class="sh">${L.ship(1750, 960, 0.5)}</g>` };
  },

  s15(A) {
    A.pop('.clock', 0.1);
    A.tween('.clock .minute', 0, A.dur, { rotation: -30, ...TO('50% 100%') }, { rotation: 0, ...TO('50% 100%') }, 'none');
    A.fadeIn('.kids', A.cue('Children') - 0.2, 0.6, 20); A.drift('.kids', A.cue('Children'), A.dur, { x: 0 }, { x: 260 }); A.loop('.kids .person', { y: 0 }, { y: -6 }, 0.4);
    A.pop('.shed', A.cue('paving yard'));
    A.pop('.fire', A.cue('Firefighters'));
    A.fadeIn('.el', A.cue('streetcar') - 0.3, 0.6, -30);
    A.drift('.train', A.cue('streetcar'), A.dur - A.cue('streetcar'), { x: -700 }, { x: 900 });
    A.fadeIn('.lower', 0.5, 0.6, 0); A.fadeOut('.lower', 5.5, 0.6);
    A.camera({ scale: 1.0 }, { scale: 1.05, x: -30 });
    return { svg: `${L.sky()}${L.sun(1700, 150, 54)}${L.skyline(-100, 2100, 860, 12, { minH: 180, varH: 120 })}${L.ground(860)}
      ${g('el', L.elevated(-100, 2100, 260, 860) + L.trainCar(400, 226, 380, 'train'))}
      ${L.clock(960, 520, 110)}
      ${g('kids', `${L.person(160, 990, 1, { child: true, coat: P.brick, hat: 'bonnet', skirt: true })}${L.person(260, 995, 1, { child: true, coat: P.olive })}${L.person(350, 990, 1, { child: true, coat: P.amber2, hat: 'bonnet', skirt: true, hatColor: P.slate })}`)}
      ${g('shed', `<rect x="600" y="820" width="320" height="180" fill="${P.olive2}" ${S}/><path d="M580 820l180 -70l180 70z" fill="${P.ink2}" ${S}/>${L.person(690, 990, 0.8, { pose: 'sit', coat: P.slate })}${L.person(820, 990, 0.8, { pose: 'sit', coat: P.brick })}`, shadow)}
      ${g('fire', `${L.rowhouse(1300, 1000, 300, 260, P.brick, L.rng(3))}${tag(1450, 800, 'ENGINE 31', { size: 28, noShadow: true })}${L.person(1400, 1000, 0.8, { hat: 'helmet', coat: P.ink2 })}`, shadow)}`,
      over: lower('12:00 NOON', 'COMMERCIAL STREET') };
  },

  s16(A) {
    const tT = A.cue('thunder'), tR = A.cue('rivets'), tS = A.cue('split open'), tO = A.cue('all at once');
    A.tween('.tank', tT, 0.1, { x: -3 }, { x: 3 }, 'none', { repeat: Math.ceil((tS - tT) / 0.1), yoyo: true });
    A.pop('.snd1', tT); A.pop('.snd2', A.cue('machine gun'));
    A.fadeOut('.snd1, .snd2', tR - 0.2, 0.3);
    for (let i = 0; i < 12; i++) A.tween(`.rv${i}`, tR + i * 0.18, 0.7, { x: 0, y: 0, opacity: 1 }, { x: Math.cos(i * 0.9) * 420, y: Math.sin(i * 0.9) * 260 - 120, opacity: 0 }, 'power2.out');
    A.draw('.crack', tR + 0.6, 1.6);
    A.tween('.halfL', tS, 1.2, { rotation: 0, x: 0, ...TO('0% 100%') }, { rotation: -32, x: -160, ...TO('0% 100%') }, 'power3.out');
    A.tween('.halfR', tS, 1.2, { rotation: 0, x: 0, ...TO('100% 100%') }, { rotation: 32, x: 160, ...TO('100% 100%') }, 'power3.out');
    A.tween('.gush', tS + 0.2, 2.2, { scale: 0.2, opacity: 0, ...B }, { scale: 1.6, opacity: 1, ...B }, 'power3.out');
    A.pop('.ton', tO);
    A.camera({ scale: 1.1 }, { scale: 1.0 }, 'power2.out');
    A.tween('.cam', tS, 0.08, { y: 0 }, { y: 16 }, 'none', { repeat: 15, yoyo: true });
    let rv = ''; for (let i = 0; i < 12; i++) rv += `<circle class="rv${i}" cx="${700 + (i % 6) * 104}" cy="${470 + Math.floor(i / 6) * 200}" r="9" fill="${P.ink}"/>`;
    const half = (cls, x0, x1) => g(cls, `<path d="M${x0} 300V880H${x1}V300Z" fill="${P.slate2}" ${S}/><path d="M${x0} 300V880H${x1}V300Z" fill="url(#hatch)"/>${[400, 520, 640, 760].map((y) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${P.ink}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`).join('')}`, shadow);
    return { svg: `${L.sky('url(#dusk)')}${L.ground(880)}
      <g class="gush"><path d="M650 880C700 640 820 520 960 500C1100 520 1220 640 1270 880Z" fill="url(#molg)" ${S}/></g>
      <g class="tank">${half('halfL', 640, 960)}${half('halfR', 960, 1280)}<path class="crack" d="M960 880l-20 -120l30 -100l-26 -120l24 -100l-10 -140" stroke="${P.amber3}" stroke-width="8" fill="none" pathLength="1" stroke-dasharray="1 1"/>${rv}</g>
      ${tag(420, 240, '"LIKE THUNDER"', { size: 46, cls: 'tag snd1' })}${tag(1500, 240, '"LIKE A MACHINE GUN"', { size: 46, cls: 'tag snd2' })}
      ${tag(960, 160, '~12,000 TONS', { size: 64, fill: P.amber3, cls: 'tag ton' })}` };
  },

  s17(A) {
    const tw = 0.2;
    A.drift('.wave', tw, A.dur - tw, { x: -1300 }, { x: 1300 }, 'power1.inOut');
    A.loop('.wave .drop', { y: 0 }, { y: -20 }, 0.35);
    A.pop('.h25', A.cue('twenty-five')); A.pop('.m35', A.cue('thirty-five'));
    A.tween('.office', A.cue('flattened'), 0.8, { scaleY: 1, rotation: 0, ...B }, { scaleY: 0.15, rotation: 6, ...B }, 'power3.in');
    A.tween('.yard', A.cue('paving yard'), 0.8, { scaleY: 1, ...B }, { scaleY: 0.2, ...B }, 'power3.in');
    const ts = A.cue('sheet');
    A.tween('.sheet', ts, 1.2, { x: -400, y: 200, rotation: 0, opacity: 1, ...C }, { x: 0, y: 0, rotation: 520, opacity: 1, ...C }, 'power2.out');
    A.tween('.post2', ts + 1.1, 0.6, { rotation: 0, ...B }, { rotation: 14, ...B }, 'back.out(2)');
    A.drift('.train', 0, ts + 0.8, { x: 0 }, { x: 1400 }, 'power1.in');
    A.camera({ scale: 1.0 }, { scale: 1.06, x: -40 });
    return { svg: `${L.sky('url(#dusk)')}${L.ground(880)}
      ${g('el', `${L.elevated(-100, 2100, 280, 880)}<g class="post2"><rect x="1250" y="280" width="30" height="600" fill="${P.ink2}" ${S}/></g>${L.trainCar(900, 246, 380, 'train')}`)}
      ${g('office', L.rowhouse(700, 880, 260, 260, P.amber2, L.rng(5)), `${shadow}`)}${g('yard', `<rect x="1500" y="740" width="320" height="140" fill="${P.olive2}" ${S}/><path d="M1480 740l180 -60l180 60z" fill="${P.ink2}" ${S}/>`, shadow)}
      <rect class="sheet" x="1180" y="420" width="140" height="90" fill="${P.slate2}" ${S}/>
      ${L.molassesWave(0, 980, 640)}
      ${tag(380, 200, '~25 FT HIGH', { size: 54, fill: P.amber3, cls: 'tag h25' })}${tag(380, 310, '~35 MPH', { size: 54, fill: P.snow, cls: 'tag m35' })}` };
  },

  s18(A) {
    A.tween('.fh', A.cue('firehouse') - 0.1, 1, { rotation: 0, x: 0, ...B }, { rotation: -9, x: 60, ...B }, 'back.out(1.5)');
    A.tween('.h1', A.cue('crushed'), 0.7, { scaleY: 1, ...B }, { scaleY: 0.25, ...B }, 'power3.in');
    A.tween('.h2', A.cue('crushed') + 0.25, 0.7, { scaleY: 1, ...B }, { scaleY: 0.3, ...B }, 'power3.in');
    A.tween('.truck', A.cue('truck'), 2.2, { x: 0, y: 0, rotation: 0, ...C }, { x: 820, y: 60, rotation: 200, ...C }, 'power1.in');
    A.tween('.truckY', A.cue('truck'), 2.2, { y: 0 }, { y: -260 }, 'sine.out');
    A.tween('.flood', A.cue('flooded') - 0.4, 2.4, { y: 260 }, { y: 0 }, 'power2.out');
    A.pop('.deep', A.cue('two to three'));
    A.loop('.flood .gloss', { x: 0 }, { x: 50 }, 2);
    A.loop('.water .ripple', { x: 0 }, { x: -50 }, 2.2);
    return { svg: `${L.sky('url(#dusk)')}${L.water(820, 400)}<path d="M-200 820H1400L1440 1300H-200Z" fill="${P.paper3}" ${S}/>
      ${g('fh', L.rowhouse(100, 900, 300, 300, P.brick, L.rng(8)) + tag(250, 660, 'ENGINE 31', { size: 26, noShadow: true }), shadow)}
      ${g('h1', L.rowhouse(480, 900, 240, 280, P.rose, L.rng(4)), shadow)}${g('h2', L.rowhouse(740, 900, 220, 240, P.olive2, L.rng(6)), shadow)}
      <g class="truckY"><g class="truck">${g('t', `<rect x="1060" y="760" width="200" height="90" fill="${P.olive}" ${S}/><rect x="1260" y="790" width="80" height="60" fill="${P.ink2}" ${S}/><circle cx="1110" cy="860" r="24" fill="${P.ink}"/><circle cx="1290" cy="860" r="24" fill="${P.ink}"/>`, shadow)}</g></g>
      ${L.flood(820, 'flood', -200, 1440)}${tag(560, 220, 'FLOODED 2–3 FT DEEP', { size: 50, fill: P.amber3, cls: 'tag deep' })}` };
  },

  s19(A) {
    const ta = A.cue('Anthony');
    A.fadeIn('.sis', 0.2, 0.7, 20); A.loop('.sis .person', { y: 0 }, { y: -5 }, 0.45);
    A.fadeIn('.nm', ta, 0.6, 0);
    const tp = A.cue('picked him up');
    A.fadeOut('.sis', tp, 0.4);
    A.drift('.ride', tp - 0.3, 5, { x: -900 }, { x: 600 }, 'power1.inOut');
    A.loop('.ride .boy', { rotation: -10, ...B }, { rotation: 10, ...B }, 0.6, tp);
    A.fadeOut('.ride', A.cue('dropped him') + 0.3, 0.6);
    A.fadeIn('.calm', A.cue('He survived') - 0.3, 0.8, 0);
    A.pop('.cand', A.cue('Maria'));
    A.loop('.flame', { scaleY: 0.85, ...B }, { scaleY: 1.15, ...B }, 0.5, A.cue('Maria'));
    A.fadeIn('.mname', A.cue('Maria') + 0.4, 0.8, 10);
    return { svg: `${L.sky('url(#dusk)')}${L.ground(880)}
      ${g('sis', `${L.person(820, 980, 1.1, { child: true, coat: P.olive, cls: 'person' })}${L.person(940, 985, 1.05, { child: true, coat: P.brick, hat: 'bonnet', skirt: true, cls: 'person' })}${L.person(1050, 985, 1.05, { child: true, coat: P.amber2, hat: 'bonnet', skirt: true, hatColor: P.slate, cls: 'person' })}`)}
      ${tag(960, 200, 'ANTHONY DI STASIO', { size: 52, fill: P.snow, cls: 'tag nm' })}
      <g class="ride">${L.molassesWave(900, 1080, 480, 'wave')}${L.person(720, 650, 1.1, { child: true, coat: P.olive, pose: 'arms', cls: 'person boy' })}</g>
      ${g('calm', `<rect x="-200" y="820" width="2320" height="500" fill="url(#molg)"/><rect x="-200" y="-200" width="2320" height="1020" fill="${P.ink}" opacity="0.35"/>`)}
      ${g('cand', `<rect x="910" y="560" width="100" height="220" fill="${P.snow}" ${S}/><path class="flame" d="M960 480q34 40 0 76q-34 -36 0 -76z" fill="${P.amber3}" ${Sthin}/><circle cx="960" cy="520" r="90" fill="url(#glow)"/>`)}
      ${label(960, 900, 'MARIA DI STASIO · AGE 10', { font: 'Playfair Display', weight: 700, size: 60, color: P.snow, cls: 'mname' })}` };
  },

  s20(A) {
    A.fadeIn('.q', 0.2, 0.6, 0);
    const t1 = A.cue('forty percent');
    A.tween('.bar', t1 - 0.4, 1.2, { scaleY: 0, ...B }, { scaleY: 1, ...B }, 'back.out(1.3)', { stagger: 0.3 });
    A.pop('.p40', t1 + 0.6);
    const tm = A.cue('changes how thick');
    A.fadeOut('.bars', tm - 0.3, 0.4);
    A.fadeIn('.flow', A.cue('warm and moving'), 0.6, 0);
    A.tween('.stream', A.cue('warm and moving'), 1.4, { scaleX: 0, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power2.out');
    A.loop('.stream', { x: 0 }, { x: -30 }, 0.5, A.cue('warm and moving'));
    A.fadeIn('.thick', A.cue('cools down'), 0.6, 0);
    A.tween('.blob', A.cue('cools down'), 2.4, { scaleX: 0.2, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power4.out');
    let st = ''; for (let i = 0; i < 6; i++) st += `<path d="M${1000 + i * 130} 360q30 -20 60 0t60 0" stroke="${P.amber3}" stroke-width="6" fill="none"/>`;
    return { svg: `${L.sky()}${tag(960, 140, 'HOW DOES SYRUP KILL?', { size: 60, fill: P.snow, cls: 'tag q' })}
      ${g('bars', L.bars(560, 900, [{ label: 'WATER', value: 1.0, color: P.slate2, note: '1.0' }, { label: 'MOLASSES', value: 1.4, color: P.mol3, note: '1.4' }], { h: 520, bw: 240, gap: 200 }) + tag(1500, 520, '~40% HEAVIER', { size: 56, fill: P.amber3, cls: 'tag p40' }))}
      ${g('flow', `${L.thermometer(400, 260, 260, { cls: 'thermo warmT' })}${label(400, 230, 'WARM', { font: 'Oswald', weight: 700, size: 40, color: P.brick })}<g class="stream"><rect x="900" y="330" width="1000" height="70" rx="35" fill="${P.amber}" ${S}/>${st}</g>${label(1400, 470, 'FLOWS FAST', { font: 'Oswald', weight: 700, size: 46 })}`)}
      ${g('thick', `${L.thermometer(400, 660, 260, { cls: 'thermo coldT' })}${label(400, 630, 'COLD', { font: 'Oswald', weight: 700, size: 40, color: P.slate })}<path class="blob" d="M900 780q100 -60 260 -20q140 30 250 -10q80 -20 80 60q0 80 -120 70q-200 -16 -380 6q-100 10 -90 -106z" fill="${P.mol}" ${S}/>${label(1250, 980, 'THICK LIKE GLUE', { font: 'Oswald', weight: 700, size: 46 })}`)}` };
  },

  s21(A) {
    const th = A.cue('Harvard');
    A.pop('.hv', th);
    A.fadeIn('.lab', th - 0.4, 0.8, 30);
    A.tween('.syr', A.cue('corn syrup'), 2.6, { scaleX: 0, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power2.out');
    const tc = A.cue('rushed out fast');
    A.fadeOut('.lab, .hv', tc - 0.3, 0.4);
    A.fadeIn('.graph', tc, 0.6, 0);
    A.draw('.curve', tc + 0.3, 3.2);
    const tt = A.cue('Within minutes');
    A.fadeOut('.graph', tt - 0.3, 0.4);
    A.fadeIn('.trap', tt, 0.8, 0);
    A.tween('.stuck', tt, A.dur - tt, { y: 0 }, { y: 70 }, 'power1.in');
    A.pop('.suf', A.cue('suffocated'));
    let houses = ''; for (let i = 0; i < 7; i++) houses += `<rect x="${640 + i * 90}" y="${560 - (i % 3) * 30}" width="60" height="${80 + (i % 3) * 30}" fill="${[P.brick, P.rose, P.olive2][i % 3]}" ${Sthin}/>`;
    return { svg: `${L.sky()}
      ${tag(960, 150, 'HARVARD STUDY · 2016', { size: 50, fill: P.snow, cls: 'tag hv' })}
      ${g('lab', `<path d="M400 680H1520L1600 760H320Z" fill="${P.ink2}" ${S}/><rect x="320" y="760" width="1280" height="40" fill="${P.ink}"/><path d="M500 640H1440V680H500Z" fill="${P.paper3}" ${S}/>${houses}<rect class="syr" x="520" y="630" width="900" height="30" rx="14" fill="${P.amber2}" ${Sthin}/>${label(960, 880, 'SCALE MODEL + CORN SYRUP', { font: 'Oswald', weight: 700, size: 44 })}`, shadow)}
      ${g('graph', `<rect x="420" y="220" width="1080" height="640" fill="${P.snow}" ${S} ${shadow}/><path d="M500 280V780H1440" ${S} fill="none"/>${label(470, 300, 'THICKNESS', { font: 'Oswald', weight: 700, size: 30, anchor: 'start', extra: 'transform="rotate(-90 470 300)" dx="-200"' })}${label(1440, 830, 'MINUTES →', { font: 'Oswald', weight: 700, size: 30, anchor: 'end' })}<path class="curve" d="M500 740C700 735 760 720 820 620S960 330 1440 300" stroke="${P.amber}" stroke-width="10" fill="none" pathLength="1" stroke-dasharray="1 1"/>${label(640, 700, 'FAST', { font: 'Oswald', weight: 700, size: 36, color: P.amber })}${label(1240, 370, 'STUCK', { font: 'Oswald', weight: 700, size: 36, color: P.brick })}`)}
      ${g('trap', `${L.skyline(-100, 2100, 760, 21, { minH: 150, varH: 100 })}<g class="stuck">${L.person(780, 770, 1.3, { pose: 'arms', coat: P.slate })}${L.person(1150, 760, 1.2, { pose: 'arms', coat: P.brick, hat: 'bonnet', skirt: true })}</g>${L.flood(720, 'flood')}${tag(960, 200, 'TRAPPED', { size: 64, fill: P.brick2, color: P.snow, cls: 'tag suf' })}`)}` };
  },

  s22(A) {
    A.fadeIn('.lower', 0.4, 0.6, 0); A.fadeOut('.lower', 5.5, 0.6);
    A.loop('.ship', { rotation: -1.5, ...B }, { rotation: 1.5, ...B }, 2);
    const tr = A.cue('ran toward');
    A.drift('.cadets', tr - 1, A.dur - tr + 1, { x: -200 }, { x: 900 }, 'power1.out');
    A.loop('.cadets .person', { y: 0 }, { y: -10 }, 0.25, tr - 1);
    A.pop('.c116', A.cue('a hundred and sixteen'));
    A.slideIn('.nurses', A.cue('Red Cross') - 0.2, 1, 500);
    A.pop('.hosp', A.cue('emergency hospital'));
    A.loop('.water .ripple', { x: 0 }, { x: -50 }, 2.2);
    let cadets = ''; for (let i = 0; i < 7; i++) cadets += L.person(80 + i * 90, 1000 + (i % 2) * 14, 0.85, { pose: 'run', coat: P.slate, hat: 'sailor', cls: 'person' });
    const rc = (x, y, s = 1) => `<rect x="${x - 30 * s}" y="${y - 10 * s}" width="${60 * s}" height="${20 * s}" fill="${P.brick}"/><rect x="${x - 10 * s}" y="${y - 30 * s}" width="${20 * s}" height="${60 * s}" fill="${P.brick}"/>`;
    return { svg: `${L.sky()}${L.water(760, 500)}<path d="M-200 900H2120V1300H-200Z" fill="${P.paper3}" ${S}/>
      ${L.ship(400, 820, 0.9, { sail: true, hull: P.ink, stripe: P.snow })}${tag(400, 160, 'USS NANTUCKET', { size: 40, fill: P.snow, cls: 'tag nan' })}
      ${g('cadets', cadets)}${tag(960, 300, '116 CADETS', { size: 60, fill: P.amber3, cls: 'tag c116' })}
      ${L.flood(960, 'flood', 1100, 2300)}
      ${g('nurses', `${L.person(1340, 1000, 0.9, { coat: P.snow, hat: 'none', skirt: true })}${rc(1340, 920, 0.6)}${L.person(1440, 1004, 0.9, { coat: P.snow, hat: 'none', skirt: true })}${rc(1440, 924, 0.6)}`)}
      ${g('hosp', `<rect x="1560" y="560" width="340" height="340" fill="${P.paper2}" ${S}/><rect x="1560" y="560" width="340" height="340" fill="url(#bricks)"/><rect x="1660" y="420" width="140" height="100" fill="${P.snow}" ${S}/>${rc(1730, 470, 1)}<path d="M1660 420v140" ${S}/>`, shadow)}`,
      over: lower('FIRST ON THE SCENE', 'MASSACHUSETTS NAUTICAL SCHOOL') };
  },

  s23(A) {
    A.loop('.lantern', { opacity: 0.75 }, { opacity: 1 }, 0.7);
    A.drift('.boat', 0, A.dur, { x: -100 }, { x: 300 });
    A.loop('.water .ripple', { x: 0 }, { x: -50 }, 2.4);
    A.pop('.d4', A.cue('four days'));
    A.fadeOut('.d4', A.cue('Among') - 0.4, 0.4);
    const t21 = A.cue('Among');
    A.fadeIn('.roll', t21 - 0.2, 0.6, 0);
    A.pop('.ic', t21 + 0.1, 0.35, 0.06);
    A.tween('.kid', A.cue('two ten-year-old') , 0.6, { fill: P.snow }, { fill: P.amber3 }, 'none');
    let ic = ''; for (let i = 0; i < 21; i++) { const x = 330 + (i % 11) * 126, y = 520 + Math.floor(i / 11) * 220, kid = i === 5 || i === 9; ic += `<g class="ic"><circle cx="${x}" cy="${y - (kid ? 40 : 70)}" r="${kid ? 18 : 24}" class="${kid ? 'kid' : ''}" fill="${P.snow}" ${Sthin}/><path d="M${x - (kid ? 22 : 30)} ${y}q0 ${kid ? -60 : -80} ${kid ? 22 : 30} ${kid ? -60 : -80}q${kid ? 22 : 30} 0 ${kid ? 22 : 30} ${kid ? 60 : 80}z" class="${kid ? 'kid' : ''}" fill="${P.snow}" ${Sthin}/></g>`; }
    return { svg: `${L.sky(P.ink)}${L.water(800, 500, 'water', P.slate)}
      <g class="boat">${g('b', `<path d="M300 830h300l-40 50h-220z" fill="${P.ink2}" ${S}/>${L.person(450, 830, 0.7, { coat: P.slate, hat: 'cap' })}<circle class="lantern" cx="560" cy="770" r="60" fill="url(#glow)"/><rect x="548" y="760" width="24" height="30" fill="${P.amber3}" ${Sthin}/>`)}</g>
      ${tag(960, 260, 'THE SEARCH LASTED 4 DAYS', { size: 54, fill: P.snow, cls: 'tag d4' })}
      ${g('roll', `<rect x="-200" y="-200" width="2320" height="1480" fill="${P.ink}" opacity="0.6"/>${label(960, 250, 'TWENTY-ONE LIVES', { font: 'Playfair Display', weight: 900, size: 80, color: P.snow })}${ic}`)}` };
  },

  s24(A) {
    A.loop('.water .ripple', { x: 0 }, { x: -50 }, 2.2);
    A.pop('.fb', 0.2);
    const tsw = A.cue('salt water');
    A.draw('.spray', tsw - 0.4, 1.2);
    A.loop('.spray', { opacity: 0.6 }, { opacity: 1 }, 0.3, tsw + 0.8);
    A.pop('.sand', A.cue('sand'), 0.5, 0.15);
    const te = A.cue('everywhere');
    A.fadeIn('.sticky', te - 0.4, 0.6, 0);
    A.pop('.st', te, 0.5, 0.35);
    A.pop('.stk', A.cue('everything a Bostonian'));
    A.tween('.brownw', A.cue('harbor stayed brown'), 2, { opacity: 0 }, { opacity: 0.75 }, 'none');
    return { svg: `${L.sky()}${L.water(760, 500)}<rect class="brownw" x="-200" y="760" width="2320" height="600" fill="${P.mol3}"/>
      <path d="M-200 760H1100L1140 1300H-200Z" fill="${P.paper3}" ${S}/>${L.flood(900, 'flood', -200, 1140)}
      ${g('fb', L.ship(1500, 840, 0.6, { hull: P.brick, stripe: P.snow }))}
      <path class="spray" d="M1420 700C1250 500 1000 560 820 860" stroke="${P.slate3}" stroke-width="22" fill="none" stroke-linecap="round" stroke-dasharray="1 1" pathLength="1"/>
      ${g('sand', `<path d="M180 920q80 -90 160 0z" fill="${P.amber3}" ${S}/>`)}${g('sand', `<path d="M420 930q70 -80 140 0z" fill="${P.amber3}" ${S}/>`)}
      ${g('sticky', `<rect x="-200" y="-200" width="2320" height="1480" fill="${P.paper}" opacity="0.92"/>
        ${g('st', L.trainCar(220, 520, 420, 'tc') + `<path d="M260 430v40M380 430v60M520 430v34" stroke="${P.mol2}" stroke-width="10" stroke-linecap="round"/>`)}
        ${g('st', `<rect x="880" y="260" width="140" height="260" rx="20" fill="${P.ink2}" ${S}/><circle cx="950" cy="340" r="44" fill="${P.paper}" ${S}/><path d="M900 520v40M990 520v60" stroke="${P.mol2}" stroke-width="10" stroke-linecap="round"/>`)}
        ${g('st', `<path d="M1300 520l20 -40l20 40M1400 560l20 -40l20 40M1500 520l20 -40l20 40M1600 560l20 -40l20 40" stroke="${P.mol2}" stroke-width="18" fill="none" stroke-linecap="round"/>`)}
        ${tag(960, 800, '"EVERYTHING A BOSTONIAN TOUCHED WAS STICKY"', { size: 40, fill: P.snow, cls: 'tag stk' })}`)}` };
  },

  s25(A) {
    A.pop('.q', 0.2);
    A.fadeIn('.co', 0.4, 0.8, 20);
    A.pop('.bub', A.cue('ready'));
    A.pop('.bomb', A.cue('anarchists'));
    A.loop('.bomb .spark', { scale: 0.7, ...C }, { scale: 1.3, ...C }, 0.2, A.cue('anarchists'));
    A.pop('.pap', A.cue('explosives'));
    return { svg: `${L.sky()}${L.ground(900)}${tag(960, 130, 'WHO WAS TO BLAME?', { size: 60, fill: P.snow, cls: 'tag q' })}
      ${g('co', `${L.rowhouse(160, 900, 420, 460, P.slate2, L.rng(9))}${tag(370, 520, 'U.S.I.A. CO.', { size: 34, noShadow: true })}${L.person(700, 990, 1.5, { coat: P.ink2, hat: 'bowler' })}`, shadow)}
      ${g('bub', `<path d="M820 240h620q40 0 40 40v300q0 40 -40 40h-460l-110 90l20 -90h-70q-40 0 -40 -40v-300q0 -40 40 -40z" fill="${P.snow}" ${S}/>${label(1130, 330, '"IT WAS A BOMB!"', { font: 'Playfair Display', weight: 900, size: 64 })}`, shadow)}
      ${L.bomb(1130, 470, 0.7)}
      ${L.newspaper(1350, 560, 520, 470, 'THE EVENING NEWS', 'ANARCHISTS?', 'Company points to radicals', { cls: 'paper pap', headSize: 74 })}` };
  },

  s26(A) {
    A.pop('.fam', 0.2, 0.3, 0.03);
    A.pop('.ca', A.cue('class-action'));
    A.slideIn('.og', A.cue('Hugh Ogden') - 0.3, 0.9, 400);
    A.fadeIn('.ognm', A.cue('Hugh Ogden'), 0.5, 10);
    const th = A.cue('three years');
    A.pop('.pile .pg', A.cue('hearings'), 0.3, 0.12);
    A.pop('.y3', th);
    let fam = ''; for (let i = 0; i < 40; i++) { const x = 120 + (i % 10) * 70, y = 420 + Math.floor(i / 10) * 120; fam += `<g class="fam"><circle cx="${x}" cy="${y - 50}" r="16" fill="${[P.brick, P.slate, P.olive, P.amber2][i % 4]}" ${Sthin}/><path d="M${x - 22} ${y}q0 -40 22 -40q22 0 22 40z" fill="${[P.brick, P.slate, P.olive, P.amber2][i % 4]}" ${Sthin}/></g>`; }
    let pile = ''; for (let i = 0; i < 10; i++) pile += `<rect class="pg" x="${1320 + (i % 2) * 8}" y="${880 - i * 34}" width="300" height="30" fill="${P.snow}" ${Sthin}/>`;
    return { svg: `${L.sky()}${L.ground(900)}${fam}${label(470, 300, '119 PEOPLE SUED', { font: 'Oswald', weight: 700, size: 52 })}
      ${L.stamp(470, 960, 'CLASS ACTION', { size: 56, cls: 'stamp ca', rot: -4 })}
      ${g('og', `<rect x="1000" y="700" width="700" height="40" fill="${P.mol3}" ${S}/><rect x="1040" y="740" width="30" height="160" fill="${P.ink2}"/><rect x="1630" y="740" width="30" height="160" fill="${P.ink2}"/>${L.person(1180, 720, 1.4, { coat: P.ink, hat: 'none', glasses: true })}`, shadow)}
      ${tag(1180, 300, 'AUDITOR HUGH OGDEN', { size: 40, fill: P.snow, cls: 'tag ognm' })}
      <g class="pile">${pile}</g>${tag(1470, 460, '~3 YEARS OF HEARINGS', { size: 40, fill: P.amber3, cls: 'tag y3' })}` };
  },

  s27(A) {
    A.pop('.cal', 0.2);
    const tv = A.cue('verdict');
    A.tween('.gavel', tv - 0.3, 0.5, { rotation: -40, ...TO('100% 100%') }, { rotation: 0, ...TO('100% 100%') }, 'power4.in');
    A.tween('.cam', tv + 0.2, 0.06, { y: 0 }, { y: 10 }, 'none', { repeat: 3, yoyo: true });
    A.pop('.bomb', A.cue('There was no bomb') - 0.4); A.draw('.bx path', A.cue('no bomb'), 0.5);
    A.pop('.liable', A.cue('responsible'));
    A.pop('.money .bill', A.cue('paid'), 0.35, 0.12);
    A.pop('.amt', A.cue('six hundred'));
    A.pop('.today', A.cue('eleven million'));
    return { svg: `${L.sky()}${L.ground(900)}${L.calendar(100, 100, 'VERDICT', '1925', '').replace('class="calendar"', 'class="cal"')}
      <rect x="420" y="760" width="460" height="60" fill="${P.mol3}" ${S} ${shadow}/>${L.gavel(560, 700, 1.3)}
      ${L.bomb(1060, 420, 0.8)}${L.cross(1060, 420, 120, 'xmark bx')}
      ${L.stamp(620, 470, 'LIABLE', { size: 90, cls: 'stamp liable' })}
      ${L.moneyStack(1500, 880, 8, 1.2)}${tag(1500, 300, '$628,000', { size: 70, fill: P.amber3, cls: 'tag amt' })}${tag(1500, 410, '≈ $11 MILLION TODAY', { size: 40, cls: 'tag today' })}` };
  },

  s28(A) {
    A.fadeIn('.wall', 0.3, 0.8, 0);
    const th = A.cue('half as thick');
    A.tween('.req', th - 0.4, 1.2, { scaleX: 0, ...TO('0% 50%') }, { scaleX: 1, ...TO('0% 50%') }, 'power2.out');
    A.pop('.lreq', th); A.pop('.lact', th + 0.5);
    A.pop('.mn', A.cue('manganese'));
    A.loop('.mn', { rotation: -2, ...C }, { rotation: 2, ...C }, 0.15, A.cue('brittle'));
    A.pop('.rh', A.cue('rivet holes') - 0.3);
    A.draw('.rcrack', A.cue('rivet holes'), 1.4);
    return { svg: `${L.sky()}${label(960, 130, 'WHAT THE ENGINEERS FOUND', { font: 'Playfair Display', weight: 900, size: 66, cls: 'ttl' })}
      ${g('wall', `<rect x="200" y="300" width="150" height="500" fill="${P.slate2}" ${S}/><rect x="200" y="300" width="150" height="500" fill="url(#hatch)"/>${label(275, 860, 'ACTUAL', { font: 'Oswald', weight: 700, size: 40 })}`, shadow)}
      <rect class="req" x="420" y="300" width="300" height="500" fill="${P.slate3}" ${S} stroke-dasharray="14 10"/>${label(570, 860, 'REQUIRED', { font: 'Oswald', weight: 700, size: 40, cls: 'lreq' })}
      ${tag(470, 230, 'HALF AS THICK', { size: 44, fill: P.amber3, cls: 'tag lact' })}
      ${tag(1350, 330, 'LOW MANGANESE = BRITTLE IN THE COLD', { size: 36, fill: P.snow, cls: 'tag mn' })}
      ${g('rh', `<rect x="1050" y="480" width="620" height="380" fill="${P.slate2}" ${S}/>${[0, 1, 2, 3].map((i) => `<circle cx="${1130 + i * 150}" cy="660" r="26" fill="${P.paper}" ${S}/>`).join('')}<path class="rcrack" d="M1156 660l40 -30l40 20l50 -40l40 20l50 -30l44 24l50 -30" stroke="${P.ink}" stroke-width="7" fill="none" pathLength="1" stroke-dasharray="1 1"/>${label(1360, 820, 'CRACKS AT THE RIVET HOLES', { font: 'Oswald', weight: 700, size: 34, color: P.snow })}`, shadow)}` };
  },

  s29(A) {
    A.fadeIn('.q', 0.2, 0.6, 0);
    A.pop('.c1', A.cue('not by bad luck') ); A.draw('.c1 .xmark path', A.cue('not by bad luck') + 0.3, 0.4);
    A.pop('.c2', A.cue('not by a bomb')); A.draw('.c2 .xmark path', A.cue('not by a bomb') + 0.3, 0.4);
    A.pop('.r1', A.cue('not an engineer'));
    A.pop('.r2', A.cue('tested by no one'));
    A.pop('.r3', A.cue('painted brown'));
    const tl = A.cue('Massachusetts');
    A.fadeOut('.list, .q', tl - 0.3, 0.4);
    A.fadeIn('.bp', tl, 0.8, 30);
    A.pop('.seal', A.cue('licensed engineer'));
    A.draw('.sig', A.cue('sign their name'), 1.6);
    const tb = A.cue('Every bridge');
    A.fadeOut('.bp', tb - 0.3, 0.4);
    A.pop('.icon', tb, 0.5, 0.35);
    A.loop('.seal', { rotation: -3, ...C }, { rotation: 3, ...C }, 1.2, A.cue('licensed engineer') + 0.6);
    const row = (y, txt, cls, ok = false) => g(cls, `${tag(960, y, txt, { size: 42, fill: ok ? P.snow : P.amber3 })}`);
    return { svg: `${L.sky()}${tag(960, 140, 'HOW DID SYRUP KILL 21 PEOPLE?', { size: 52, fill: P.snow, cls: 'tag q' })}
      ${g('list', `${g('c1', `${tag(560, 300, 'BAD LUCK', { size: 44 })}${L.cross(560, 300, 50)}`)}${g('c2', `${tag(1360, 300, 'A BOMB', { size: 44 })}${L.cross(1360, 300, 50)}`)}
        ${row(480, 'BUILT BY A MAN WHO WAS NOT AN ENGINEER', 'r1')}${row(620, 'NEVER PROPERLY TESTED', 'r2')}${row(760, 'WARNINGS PAINTED OVER', 'r3')}`)}
      ${g('bp', `${L.blueprint(460, 200, 1000, 680)}<g class="seal">${`<circle cx="1260" cy="700" r="110" fill="${P.brick}" ${S}/><circle cx="1260" cy="700" r="84" fill="none" stroke="${P.snow}" stroke-width="5"/>`}${label(1260, 690, 'LICENSED', { font: 'Oswald', weight: 700, size: 30, color: P.snow })}${label(1260, 728, 'ENGINEER', { font: 'Oswald', weight: 700, size: 30, color: P.snow })}</g>
        <path class="sig" d="M560 780c30 -60 60 -60 50 0s40 20 60 -30c10 40 40 40 60 0c20 -30 40 10 60 0s40 -40 80 -10" stroke="${P.snow}" stroke-width="6" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><line x1="540" y1="810" x2="960" y2="810" stroke="${P.snow}" stroke-width="3"/>`)}
      ${g('icon', `<path d="M180 800H700M220 800V620M660 800V620M180 620Q440 420 700 620" stroke="${P.ink}" stroke-width="14" fill="none"/>${label(440, 880, 'BRIDGES', { font: 'Oswald', weight: 700, size: 40 })}`, shadow)}
      ${g('icon', `<rect x="880" y="380" width="160" height="420" fill="${P.slate2}" ${S}/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="905" y="${410 + i * 64}" width="40" height="36" fill="${P.amber3}"/><rect x="975" y="${410 + i * 64}" width="40" height="36" fill="${P.amber3}"/>`).join('')}${label(960, 880, 'TOWERS', { font: 'Oswald', weight: 700, size: 40 })}`, shadow)}
      ${L.tank(1480, 800, 300, 280, { cls: 'tank icon' })}${label(1480, 880, 'TANKS', { font: 'Oswald', weight: 700, size: 40, cls: 'icon' })}` };
  },

  s30(A) {
    A.pop('.cal15', 0.2);
    const t16 = A.cue('sixteenth');
    A.tween('.cal15', t16, 0.6, { rotationX: 0, y: 0, opacity: 1 }, { y: -200, opacity: 0 }, 'power2.in');
    A.pop('.cal16', t16 + 0.3);
    A.pop('.neb', A.cue('Nebraska'));
    A.fadeIn('.scroll', A.cue('Prohibition was now') - 0.3, 0.8, 40);
    A.pop('.rat', A.cue('Constitution'));
    A.pop('.oneday', A.cue('one day after'));
    return { svg: `${L.sky()}${L.calendar(160, 180, 'JANUARY', '15', '1919').replace('class="calendar"', 'class="cal15"')}${L.calendar(160, 180, 'JANUARY', '16', '1919').replace('class="calendar"', 'class="cal16"')}
      ${tag(310, 640, 'NEBRASKA: 36TH STATE', { size: 36, fill: P.amber3, cls: 'tag neb' })}
      ${L.document(720, 140, 760, 760, { title: 'AMENDMENT XVIII', size: 56, cls: 'scroll', fill: '#F1E2BE' })}${L.stamp(1110, 640, 'RATIFIED', { size: 90, cls: 'stamp rat' })}
      ${tag(1110, 980, 'ONE DAY AFTER THE TANK COLLAPSED', { size: 44, fill: P.brick2, color: P.snow, cls: 'tag oneday' })}` };
  },

  s31(A) {
    ambient(A);
    A.loop('.kid1', { y: 0 }, { y: -26 }, 0.5); A.loop('.ball', { x: 0, y: 0 }, { x: 260, y: -60 }, 1.3);
    A.fadeIn('.ll', A.cue('Little League'), 0.6, 10);
    const tc = A.cue('concrete base');
    A.draw('.ghost', tc, 2);
    A.pop('.in20', tc + 1.2);
    A.fadeIn('.smell', A.cue('smell'), 1, 20);
    A.loop('.smell path', { x: 0 }, { x: 20 }, 0.9, A.cue('smell'));
    A.camera({ scale: 1.08, y: 20 }, { scale: 1.0, y: 0 });
    return { svg: `${L.sky()}${L.sun(1650, 170, 70)}${L.cloud(400, 220, 1, 'cloud c1')}${L.cloud(1200, 160, 0.8, 'cloud c2')}${L.skyline(-120, 2100, 640, 31, { minH: 170, varH: 120 })}
      <rect x="-200" y="640" width="2320" height="700" fill="${P.olive2}" ${S}/><path d="M960 980L620 790L960 650L1300 790Z" fill="${P.amber3}" ${S}/><path d="M960 940L700 790L960 690L1220 790Z" fill="${P.olive}" ${Sthin}/>
      <ellipse class="ghost" cx="960" cy="800" rx="420" ry="150" fill="none" stroke="${P.mol2}" stroke-width="8" stroke-dasharray="1 1" pathLength="1"/>
      ${tag(1560, 900, 'TANK BASE: ~20 IN. BELOW THE INFIELD', { size: 32, fill: P.snow, cls: 'tag in20' })}
      ${L.person(760, 840, 0.8, { child: true, coat: P.brick, hat: 'cap', cls: 'person kid1' })}${L.person(1180, 830, 0.8, { child: true, coat: P.slate, hat: 'cap' })}<circle class="ball" cx="800" cy="700" r="12" fill="${P.snow}" ${Sthin}/>
      ${tag(960, 140, 'LANGONE PARK, TODAY', { size: 44, fill: P.snow, cls: 'tag ll' })}
      ${g('smell', [0, 1, 2].map((i) => `<path d="M${300 + i * 60} 600q20 -40 0 -80t0 -80" stroke="${P.amber}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join(''))}` };
  },

  s32(A) {
    A.fadeIn('.mem', 0.3, 1.2, 0);
    A.loop('.flame', { scaleY: 0.85, ...B }, { scaleY: 1.15, ...B }, 0.5);
    const tw = A.cue('wave that');
    A.fadeOut('.mem', tw - 0.6, 0.5);
    A.fadeIn('.ttl', tw - 0.2, 1, 30);
    A.pop('.sub', A.cue('subscribe'));
    A.pop('.cm', A.cue('comments'));
    A.camera({ scale: 1.05 }, { scale: 1.0 });
    return { svg: `${L.sky(P.mol)}<rect x="-200" y="-200" width="2320" height="1480" fill="url(#hatchL)" opacity="0.22"/>
      ${g('mem', `${g('c', `<rect x="910" y="460" width="100" height="220" fill="${P.snow}" ${S}/><path class="flame" d="M960 380q34 40 0 76q-34 -36 0 -76z" fill="${P.amber3}" ${Sthin}/><circle cx="960" cy="420" r="100" fill="url(#glow)"/>`)}${label(960, 800, 'IN MEMORY OF THE 21', { font: 'Playfair Display', weight: 900, size: 72, color: P.snow })}${label(960, 870, 'BOSTON · JANUARY 15, 1919', { font: 'Oswald', weight: 500, size: 36, color: P.amber3, letter: 6 })}`)}
      ${label(960, 360, 'THE WAVE THAT', { font: 'Playfair Display', weight: 900, size: 110, color: P.snow, cls: 'ttl' })}${label(960, 490, "WASN'T WATER", { font: 'Playfair Display', weight: 900, size: 130, color: P.amber3, cls: 'ttl' })}
      ${tag(720, 760, 'SUBSCRIBE FOR MORE', { size: 50, fill: P.brick2, color: P.snow, cls: 'tag sub' })}${tag(1260, 760, 'WHICH DISASTER NEXT?', { size: 50, fill: P.amber3, cls: 'tag cm' })}` };
  },
};

// music bed + sound effects
export function sfx(clips) {
  const total = clips.at(-1).start + clips.at(-1).dur;
  const by = Object.fromEntries(clips.map((c) => [c.id, c]));
  const word = (id, w) => { const c = by[id]; const x = c.sc.words.find((q) => q.w.toLowerCase() === w); return c.start + (x ? x.s : 0); };
  return [
    { id: 'm_bed', file: 'music.wav', start: 0, dur: Math.min(720, total), vol: 0.16, fadeIn: 2, fadeOut: 4 },
    { id: 'fx_rush1', file: 'rush.wav', start: word('s02', 'wall') - 0.5, dur: 6, vol: 0.5 },
    { id: 'fx_collapse', file: 'collapse.wav', start: word('s16', 'rivets') - 1.0, dur: 7, vol: 0.75 },
    { id: 'fx_rush2', file: 'rush.wav', start: by.s17.start, dur: 6, vol: 0.6 },
  ];
}
