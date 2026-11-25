import * as L from '../../lib/inkamber.mjs';
import * as M from '../../lib/maps.mjs';
import * as BH from '../../lib/bharat.mjs';
import fs from 'node:fs';
const P = L.P;
const m = M.makeMap({ center: [70, 22], scale: 900 });
const [ix, iy] = m.xy(79, 22);
const svg = `${L.defs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">${m.base()}<circle cx="${ix}" cy="${iy}" r="330" fill="url(#glow)"/>
${BH.lionCapital(1500, 1000, 1.1)}<rect x="-10" y="-10" width="1940" height="1100" fill="#000" opacity="0.12"/></svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';src:url(../build/assets/baloo-2-devanagari-800-normal.woff2);font-weight:800}@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:#000}
.o{text-shadow:-5px -5px 0 #2B1D14,5px -5px 0 #2B1D14,-5px 5px 0 #2B1D14,5px 5px 0 #2B1D14,0 6px 0 #2B1D14,6px 0 0 #2B1D14,14px 16px 0 #2B1D14}
.t{position:absolute;left:70px;top:10px;font:800 250px/1.1 'Baloo 2';color:#F7F1E3}
.s{position:absolute;left:80px;bottom:70px;font:700 140px/1 Oswald;color:#F0B35A}
.s span{color:#E8893A}
.b{position:absolute;right:70px;top:80px;background:#A23B2A;color:#F7F1E3;font:800 74px 'Baloo 2';padding:4px 34px;border:6px solid #2B1D14;box-shadow:10px 12px 0 rgba(0,0,0,.45);transform:rotate(3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png)}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t o">भारत</div><div class="s o">25% → <span>4%</span> → ?</div><div class="b">5000 साल</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
