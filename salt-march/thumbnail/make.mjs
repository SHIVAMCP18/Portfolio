import * as L from '../../lib/inkamber.mjs';
import * as I from '../../lib/india.mjs';
import fs from 'node:fs';
const svg = `${L.defs()}<svg viewBox="0 0 1920 1080" width="1920" height="1080" style="position:absolute;inset:0">
${L.sky('url(#dusk)')}${L.sun(1500, 430, 110)}${I.beach(600, 820)}${I.palm(1830, 900, 1.2)}${I.crowd(1100, 1700, 880, 9, 0.7, 2)}
${I.gandhi(780, 1000, 2.4, { pose: 'bend' })}${I.saltPile(1100, 1000, 0.9)}</svg>`;
const html = `<!doctype html><html><head><style>
@font-face{font-family:'Playfair Display';src:url(../build/assets/playfair-display-latin-900-normal.woff2);font-weight:900}
@font-face{font-family:'Oswald';src:url(../build/assets/oswald-latin-700-normal.woff2);font-weight:700}
html,body{margin:0}#c{position:relative;width:1920px;height:1080px;overflow:hidden;background:url(../build/assets/paper.jpg)}
svg{mix-blend-mode:multiply}
.t{position:absolute;left:70px;top:60px;font:900 200px/0.9 'Playfair Display';color:#F7F1E3;-webkit-text-stroke:6px #2B1D14;text-shadow:12px 14px 0 #2B1D14}
.t span{color:#F0B35A}
.b{position:absolute;right:80px;top:80px;background:#A23B2A;color:#F7F1E3;font:700 64px 'Oswald';letter-spacing:4px;padding:14px 30px;border:6px solid #2B1D14;box-shadow:10px 12px 0 rgba(43,29,20,.35);transform:rotate(3deg)}
.v{position:absolute;inset:0;background:url(../build/assets/vignette.png)}
</style></head><body><div id="c">${svg}<div class="v"></div><div class="t">ILLEGAL<br><span>SALT</span></div><div class="b">INDIA 1930</div></div></body></html>`;
fs.writeFileSync(new URL('./thumb.html', import.meta.url), html);
