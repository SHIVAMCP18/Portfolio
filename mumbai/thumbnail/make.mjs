import * as L from '../../lib/inkamber.mjs';
import * as X from '../../lib/space.mjs';
import * as MU from '../../lib/mumbai.mjs';
import fs from 'node:fs';
const svg = `${L.defs()}${X.spaceDefs()}${MU.mumbaiDefs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">${MU.nightSky(26)}${MU.sea(900)}${MU.tajHotel(1280, 900, 1.25, { fire: true, lit: 0.45 })}
<g opacity="0.95">${[[1520,170,70],[1610,110,100],[1730,40,135],[1880,-30,170],[1450,210,50]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#5A5560" stroke="#2B2730" stroke-width="5"/>`).join("")}</g><rect x="-10" y="-10" width="1940" height="1100" fill="#000" opacity="0.1"/></svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Baloo 2';src:url(../build/assets/baloo-2-devanagari-800-normal.woff2);font-weight:800}@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:#000}
.o{text-shadow:-5px -5px 0 #120D0A,5px -5px 0 #120D0A,-5px 5px 0 #120D0A,5px 5px 0 #120D0A,0 6px 0 #120D0A,6px 0 0 #120D0A,14px 16px 0 #120D0A}
.t{position:absolute;left:60px;top:30px;font:700 330px/1 Oswald;color:#F7F1E3;letter-spacing:4px}
.s{position:absolute;left:70px;bottom:80px;font:800 150px/1.05 'Baloo 2';color:#F0B35A}
.b{position:absolute;left:80px;top:400px;background:#A23B2A;color:#F7F1E3;font:800 72px 'Baloo 2';padding:4px 34px;border:6px solid #120D0A;box-shadow:10px 12px 0 rgba(0,0,0,.45);transform:rotate(-3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png)}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t o">26/11</div><div class="b">पूरी कहानी</div><div class="s o">वो <span style="font-family:Oswald">60</span> घंटे</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
