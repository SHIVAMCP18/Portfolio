import * as L from '../../lib/inkamber.mjs';
import * as M from '../../lib/maps.mjs';
import * as E from '../../lib/epic.mjs';
import fs from 'node:fs';
const P = L.P;
const m = M.makeMap({ center: [60, 36], scale: 900 });
const k = [69.17, 34.53];
const svg = `${L.defs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">${m.base()}${m.country('Afghanistan', P.amber2)}
${M.arrow(m, [22.5, 40.8], [64.5, 35.5], { bend: -0.1, w: 22 })}${M.arrow(m, [95, 50], [69, 36.3], { color: P.mol3, w: 22 })}${M.arrow(m, [80, 24], [70.3, 33.2], { color: P.brick2, bend: 0.2, w: 22 })}${M.arrow(m, [66, 52], [67, 37.4], { color: P.olive, w: 22 })}
<rect x="-10" y="-10" width="1940" height="1100" fill="#000" opacity="0.18"/></svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';src:url(../build/assets/baloo-2-devanagari-800-normal.woff2);font-weight:800}
@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:#000}
.o{text-shadow:-5px -5px 0 #2B1D14,5px -5px 0 #2B1D14,-5px 5px 0 #2B1D14,5px 5px 0 #2B1D14,0 6px 0 #2B1D14,6px 0 0 #2B1D14,14px 16px 0 #2B1D14}
.t{position:absolute;left:60px;top:40px;font:700 180px/1 'Oswald';color:#F7F1E3;letter-spacing:2px}
.s{position:absolute;left:70px;bottom:60px;font:800 120px/1.05 'Baloo 2';color:#F0B35A}
.b{position:absolute;right:70px;bottom:90px;background:#A23B2A;color:#F7F1E3;font:800 74px 'Baloo 2';padding:4px 34px;border:6px solid #2B1D14;box-shadow:10px 12px 0 rgba(0,0,0,.45);transform:rotate(-3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png)}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t o">AFGHANISTAN</div><div class="s o">साम्राज्यों का<br>कब्रिस्तान</div><div class="b">2500 साल</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
