// Assemble a HyperFrames composition from scenes.json (narration timings) + a scene module.
// Usage: node lib/build.mjs <project_dir>
import fs from 'node:fs';
import path from 'node:path';
import { defs, P } from './inkamber.mjs';

const proj = path.resolve(process.argv[2]);
const studio = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(proj, 'build');
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
fs.mkdirSync(path.join(out, 'audio'), { recursive: true });

const data = JSON.parse(fs.readFileSync(path.join(proj, 'scenes.json'), 'utf8'));
const mod = await import(path.join(proj, 'scenes.mjs') + `?v=${Date.now()}`);
const chapters = mod.chapters || {}; // { sceneId: [num, title] } — a chapter card is inserted before that scene
const CHAPTER_LEN = 2.8;

// ---------- timeline ----------
let t = 0;
const clips = [];
for (const sc of data) {
  if (chapters[sc.id]) { clips.push({ kind: 'chapter', id: `ch${chapters[sc.id][0]}`, start: t, dur: CHAPTER_LEN, chap: chapters[sc.id] }); t += CHAPTER_LEN; }
  clips.push({ kind: 'scene', id: sc.id, start: t, dur: sc.audio_dur, sc }); t += sc.audio_dur;
}
const TOTAL = Math.round((t + 0.6) * 1000) / 1000;

// ---------- animation records ----------
const recs = [];
function makeAnim(T, dur, sid, words) {
  const firstSeen = new Set();
  const norm = (w) => w.toLowerCase().normalize('NFC').replace(/[\s.,!?;:।"“”‘’()—–'-]/g, '');
  const cue = (word, nth = 1, fallback = 0) => {
    const parts = word.toLowerCase().split(' ').map(norm);
    let n = 0;
    for (let i = 0; i < words.length; i++) {
      if (parts.every((p, j) => words[i + j] && norm(words[i + j].w) === p) && ++n === nth) return words[i].s;
    }
    console.warn(`  ! cue "${word}" not found in ${sid}`); return fallback;
  };
  const q = (sel) => sel.split(',').map((s) => `#${sid} ${s.trim()}`).join(', ');
  const add = (sel, t0, d, from, to, extra = {}) => {
    const s = q(sel);
    for (const k of Object.keys(from || {})) {
      const parts = s.split(', ').filter((one) => !firstSeen.has(one + '|' + k));
      parts.forEach((one) => firstSeen.add(one + '|' + k));
      if (parts.length) recs.push({ s: parts.join(', '), t: T, d: 0, to: { [k]: from[k] } });
    }
    recs.push({ s, t: T + t0, d, from, to, ...extra });
  };
  const A = {
    T, dur, cue,
    set: (sel, t0, vars) => recs.push({ s: q(sel), t: T + t0, d: 0, to: vars }),
    tween: (sel, t0, d, from, to, ease = 'power2.inOut', extra = {}) => add(sel, t0, d, from, to, { ease, ...extra }),
    fadeIn: (sel, t0, d = 0.7, y = 30) => add(sel, t0, d, { opacity: 0, y }, { opacity: 1, y: 0 }, { ease: 'power2.out' }),
    // fade from whatever opacity the element has now; never pre-sets a starting state
    fadeOut: (sel, t0, d = 0.6) => recs.push({ s: q(sel), t: T + t0, d, to: { opacity: 0 }, ease: 'power1.in' }),
    pop: (sel, t0, d = 0.6, stagger = 0) => add(sel, t0, d, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, { ease: 'back.out(1.8)', stagger }),
    slideIn: (sel, t0, d = 0.9, x = -400) => add(sel, t0, d, { opacity: 0, x }, { opacity: 1, x: 0 }, { ease: 'power3.out' }),
    draw: (sel, t0, d = 1) => add(sel, t0, d, { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, { ease: 'power1.inOut' }),
    drift: (sel, t0, d, from, to, ease = 'none') => add(sel, t0, d, from, to, { ease }),
    // looping motion for the whole scene (bobbing, ripples, smoke)
    loop: (sel, from, to, period, t0 = 0, ease = 'sine.inOut') => {
      const reps = Math.max(1, Math.ceil((dur - t0) / period));
      add(sel, t0, period, from, to, { ease, repeat: reps, yoyo: true });
    },
    smoke: (sel, t0 = 0, period = 3.2, rise = 160, n = 5) => {
      for (let i = 0; i < n; i++) {
        const st = t0 + (i * period) / n, reps = Math.max(1, Math.ceil((dur - st) / period));
        add(`${sel} .p${i}`, st, period, { opacity: 0.9, y: 0, x: 0, scale: 0.6 }, { opacity: 0, y: -rise, x: 60, scale: 1.6 }, { ease: 'none', repeat: reps });
      }
    },
    camera: (from, to, ease = 'sine.inOut', t0 = 0, d = dur) => add('.cam', t0, d, from, to, { ease }),
  };
  return A;
}

// ---------- HTML ----------
let html = '';
let audio = '';
for (const c of clips) {
  if (c.kind === 'chapter') {
    const svg = mod.chapterSvg(c.chap[0], c.chap[1]);
    html += `<div class="scene clip" id="${c.id}" data-start="${c.start.toFixed(3)}" data-duration="${c.dur}"><div class="cam"><svg viewBox="0 0 1920 1080" width="1920" height="1080">${svg}</svg></div></div>\n`;
    const A = makeAnim(c.start, c.dur, c.id, []);
    A.tween('', 0, 0.4, { opacity: 0 }, { opacity: 1 }, 'none');
    A.fadeIn('.chap-num', 0.2, 0.6, 20);
    A.tween('.chap-rule', 0.4, 0.8, { scaleX: 0 }, { scaleX: 1 }, 'power3.out');
    A.fadeIn('.chap-title', 0.6, 0.9, 40);
    A.camera({ scale: 1 }, { scale: 1.05 }, 'none');
    A.fadeOut('.cam', c.dur - 0.35, 0.35);
    audio += `<audio id="a_${c.id}" src="audio/sting.wav" data-start="${c.start.toFixed(3)}" data-duration="${c.dur}" data-volume="0.55"></audio>\n`;
    continue;
  }
  const A = makeAnim(c.start, c.dur, c.id, c.sc.words);
  const scene = mod.scenes[c.id];
  if (!scene) throw new Error(`no scene builder for ${c.id}`);
  const { svg, over = '' } = scene(A);
  // every scene: quick dip from paper + default slow camera unless the scene set one
  A.tween('', 0, 0.35, { opacity: 0 }, { opacity: 1 }, 'none');
  if (!recs.some((r) => r.s === `#${c.id} .cam` && r.d > 0)) A.camera({ scale: 1.0, x: 0 }, { scale: 1.06, x: -20 });
  html += `<div class="scene clip" id="${c.id}" data-start="${c.start.toFixed(3)}" data-duration="${c.dur}"><div class="cam"><svg viewBox="0 0 1920 1080" width="1920" height="1080">${svg}</svg></div>${over}</div>\n`;
  audio += `<audio id="a_${c.id}" src="audio/${c.id}.wav" data-start="${c.start.toFixed(3)}" data-duration="${c.dur}" data-volume="1"></audio>\n`;
  fs.copyFileSync(path.join(proj, 'audio', `${c.id}.wav`), path.join(out, 'audio', `${c.id}.wav`));
}
for (const extra of mod.sfx ? mod.sfx(clips) : []) audio += `<audio id="${extra.id}" src="audio/${extra.file}" data-start="${extra.start.toFixed(3)}" data-duration="${extra.dur}" data-volume="${extra.vol}" ${extra.fadeIn ? `data-fade-in="${extra.fadeIn}"` : ''} ${extra.fadeOut ? `data-fade-out="${extra.fadeOut}"` : ''}></audio>\n`;

// recs: '#id ' with empty selector means the scene root
for (const r of recs) r.s = r.s.replace(/#(\w+) $/, '#$1');

const fontFace = (fam, file, w) => `@font-face{font-family:'${fam}';src:url(assets/${file}) format('woff2');font-weight:${w};font-display:block}`;
const fonts = [['Playfair Display', 'playfair-display-latin-700-normal.woff2', 700], ['Playfair Display', 'playfair-display-latin-900-normal.woff2', 900], ['Special Elite', 'special-elite-latin-400-normal.woff2', 400], ['Oswald', 'oswald-latin-500-normal.woff2', 500], ['Oswald', 'oswald-latin-700-normal.woff2', 700]];
for (const f of mod.fonts || []) fonts.push(f);
for (const [fam, file] of fonts) fs.copyFileSync(path.join(studio, 'node_modules/@fontsource', fam.toLowerCase().replace(' ', '-'), 'files', file), path.join(out, 'assets', file));
for (const a of ['paper.jpg', 'vignette.png', 'grain.png']) fs.copyFileSync(path.join(studio, 'lib/assets', a), path.join(out, 'assets', a));
fs.copyFileSync(path.join(studio, 'node_modules/gsap/dist/gsap.min.js'), path.join(out, 'assets/gsap.min.js'));
for (const a of fs.readdirSync(path.join(proj, 'audio')).filter((f) => !/^s\d+\.wav$/.test(f))) fs.copyFileSync(path.join(proj, 'audio', a), path.join(out, 'audio', a));

const page = `<!doctype html><html><head><meta charset="utf-8"><title>${mod.title || 'film'}</title><style>
${fonts.map((x) => fontFace(...x)).join('\n')}
html,body{margin:0;background:${P.paper}}
#root{position:relative;width:1920px;height:1080px;overflow:hidden;background:${P.paper} url(assets/paper.jpg);}
.scene{position:absolute;inset:0;overflow:hidden;background:url(assets/paper.jpg)}
.cam{position:absolute;inset:0;transform-origin:50% 50%}
.cam svg{position:absolute;inset:0;mix-blend-mode:multiply}
.overlay{position:absolute;inset:0;pointer-events:none;background:url(assets/vignette.png);z-index:50}
.grain{position:absolute;inset:0;pointer-events:none;background:url(assets/grain.png);mix-blend-mode:overlay;opacity:.5;z-index:51}
.lower{position:absolute;left:90px;bottom:80px;padding:14px 30px 12px;background:${P.ink};color:${P.paper};font:400 34px 'Special Elite';letter-spacing:2px;box-shadow:8px 10px 0 rgba(43,29,20,.25)}
.lower b{color:${P.amber3};font-weight:400}
${mod.css || ''}
</style></head><body>
<div id="root" data-composition-id="root" data-width="1920" data-height="1080" data-start="0" data-duration="${TOTAL}">
${defs()}${mod.defs ? mod.defs() : ''}
${html}
${audio}
<div class="overlay"></div><div class="grain"></div>
</div>
<script src="assets/gsap.min.js"></script>
<script>
const R=${JSON.stringify(recs)};
const tl=gsap.timeline({paused:true});
for(const r of R){
  const v=Object.assign({},r.to,{duration:r.d,immediateRender:false,smoothOrigin:false});
  if(r.ease)v.ease=r.ease; if(r.repeat)v.repeat=r.repeat; if(r.yoyo)v.yoyo=true; if(r.stagger)v.stagger=r.stagger;
  if(r.d===0||!r.from) tl.to(r.s,v,r.t); else tl.fromTo(r.s,r.from,v,r.t);
}
tl.set({}, {}, ${TOTAL});
window.__timelines={root:tl};
</script></body></html>`;
fs.writeFileSync(path.join(out, 'index.html'), page);

// captions (SRT) + chapter list for the YouTube description
const ts = (s) => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, se = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(se).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
let srt = '', n = 0;
for (const c of clips.filter((c) => c.kind === 'scene')) for (const s of c.sc.sentences) srt += `${++n}\n${ts(c.start + s.s)} --> ${ts(c.start + s.e)}\n${s.text}\n\n`;
fs.writeFileSync(path.join(proj, 'captions.srt'), srt);
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
fs.writeFileSync(path.join(proj, 'chapters.txt'), ['0:00 Intro', ...clips.filter((c) => c.kind === 'chapter').map((c) => `${mmss(c.start)} ${c.chap[1]}`)].join('\n') + '\n');
fs.writeFileSync(path.join(proj, 'timeline.json'), JSON.stringify(clips.map(({ sc, ...c }) => c), null, 1));
console.log(`built ${clips.length} clips, ${recs.length} tweens, ${TOTAL.toFixed(1)}s → ${path.relative(studio, out)}/index.html`);
