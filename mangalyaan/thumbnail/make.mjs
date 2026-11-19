import * as L from '../../lib/inkamber.mjs';
import * as X from '../../lib/space.mjs';
import fs from 'node:fs';
const svg = `${L.defs()}${X.spaceDefs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">
${X.spaceBg(77, { nx: 400, ny: 200 })}${X.mars(1400, 640, 470)}${X.mom(820, 640, 1.5, { flame: true })}</svg>`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:'Baloo 2';src:url(../build/assets/baloo-2-devanagari-800-normal.woff2);font-weight:800}
@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:#120E1F}
.t{position:absolute;left:70px;top:40px;font:800 190px/1.05 'Baloo 2';color:#F7F1E3;text-shadow:-4px -4px 0 #2B1D14,4px -4px 0 #2B1D14,-4px 4px 0 #2B1D14,4px 4px 0 #2B1D14,0 5px 0 #2B1D14,5px 0 0 #2B1D14,12px 14px 0 #2B1D14}
.t span{color:#F0B35A}
.b{position:absolute;left:90px;bottom:80px;background:#A23B2A;color:#F7F1E3;font:800 70px 'Baloo 2';padding:6px 34px;border:6px solid #2B1D14;box-shadow:10px 12px 0 rgba(0,0,0,.4);transform:rotate(-3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png);opacity:.8}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t">पहली बार में<br><span>मंगल!</span></div><div class="b">सिर्फ़ ₹450 करोड़</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
