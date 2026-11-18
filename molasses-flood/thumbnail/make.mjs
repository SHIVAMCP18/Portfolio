import * as L from '../../lib/inkamber.mjs';
import fs from 'node:fs';
const { P } = L;
const svg = `${L.defs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">
${L.sky('url(#dusk)')}${L.steeple(1640, 700, 0.9)}${L.skyline(-120, 2100, 860, 4, { minH: 220, varH: 160 })}${L.ground(860)}
${L.person(1500, 960, 1.4, { pose: 'run', coat: P.brick, hat: 'bonnet', skirt: true })}${L.person(1700, 975, 1.3, { pose: 'run', coat: P.slate, hat: 'bowler' })}
<g transform="translate(260 0)">${L.molassesWave(900, 1100, 980)}</g></svg>`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:'Playfair Display';src:url(../build/assets/playfair-display-latin-900-normal.woff2);font-weight:900}
@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:url(../build/assets/paper.jpg)}
svg{mix-blend-mode:multiply}
.t{position:absolute;left:70px;top:70px;font:900 210px/0.9 'Playfair Display';color:#F7F1E3;-webkit-text-stroke:6px #2B1D14;text-shadow:12px 14px 0 #2B1D14}
.t span{color:#F0B35A}
.b{position:absolute;right:80px;top:80px;background:#A23B2A;color:#F7F1E3;font:700 64px 'Oswald';letter-spacing:4px;padding:14px 30px;border:6px solid #2B1D14;box-shadow:10px 12px 0 rgba(43,29,20,.35);transform:rotate(3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png)}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t">KILLER<br><span>SYRUP</span></div><div class="b">BOSTON 1919</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
