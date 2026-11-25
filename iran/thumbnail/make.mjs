import * as L from '../../lib/inkamber.mjs';
import * as M from '../../lib/maps.mjs';
import * as R from '../../lib/persia.mjs';
import fs from 'node:fs';
const P = L.P;
const m = M.makeMap({ center: [42, 32], scale: 820 });
const ach = [[20, 41], [28, 43], [40, 42], [50, 42], [60, 43], [70, 39], [73, 33], [70, 25], [60, 24], [52, 25], [40, 24], [33, 22], [26, 27], [25, 31], [30, 36]];
const svg = `${L.defs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">${m.base()}${M.blob(m, ach, { fill: P.brick, op: 0.45 })}${m.country('Iran', P.amber2)}
<g transform="translate(1230 470) scale(0.48)">${R.persepolis(300, 1300, 1000, 'p', { n: 5 })}</g>${R.missile(1650, 260, 0.9, -30)}<rect x="-10" y="-10" width="1940" height="1100" fill="#000" opacity="0.12"/></svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';src:url(../build/assets/baloo-2-devanagari-800-normal.woff2);font-weight:800}
@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:#000}
.o{text-shadow:-5px -5px 0 #2B1D14,5px -5px 0 #2B1D14,-5px 5px 0 #2B1D14,5px 5px 0 #2B1D14,0 6px 0 #2B1D14,6px 0 0 #2B1D14,14px 16px 0 #2B1D14}
.t{position:absolute;left:60px;top:30px;font:700 230px/1 'Oswald';color:#F7F1E3;letter-spacing:4px}
.s{position:absolute;left:70px;bottom:60px;font:800 118px/1.05 'Baloo 2';color:#F0B35A}
.b{position:absolute;right:70px;bottom:90px;background:#A23B2A;color:#F7F1E3;font:800 74px 'Baloo 2';padding:4px 34px;border:6px solid #2B1D14;box-shadow:10px 12px 0 rgba(0,0,0,.45);transform:rotate(-3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png)}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t o">IRAN</div><div class="s o">पहला सुपरपावर<br>आज जंग में</div><div class="b">5000 साल</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
