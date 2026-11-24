// Ink & Amber — cartography from Natural Earth (world-atlas, public domain).
// Land is drawn as one merged mass (no internal borders), so disputed lines are never shown;
// only the countries you name in `highlight` get their outline drawn.
import { createRequire } from 'node:module';
import { geoMercator, geoPath } from 'd3-geo';
import { feature, merge } from 'topojson-client';
import { P, g, label } from './inkamber.mjs';
const require = createRequire(import.meta.url);
const topo = require('world-atlas/countries-50m.json');
const COUNTRIES = feature(topo, topo.objects.countries).features;
const LAND = merge(topo, topo.objects.countries.geometries);
const byName = (n) => COUNTRIES.find((f) => f.properties.name === n);

const round = (d) => (d ? d.replace(/(\d+\.\d)\d+/g, '$1') : 'M0 0');

// view: { center:[lon,lat], scale }  → { proj, svg pieces, xy(lon,lat) }
export function makeMap(view, o = {}) {
  const W = 1920, H = 1080, pad = 300;
  const proj = geoMercator().center(view.center).scale(view.scale).translate([W / 2, H / 2]).clipExtent([[-pad, -pad], [W + pad, H + pad]]);
  const path = geoPath(proj);
  const xy = (lon, lat) => proj([lon, lat]).map((v) => Math.round(v * 10) / 10);
  const sea = `<rect x="-300" y="-300" width="2520" height="1680" fill="${o.sea || '#8FA6AA'}"/><rect x="-300" y="-300" width="2520" height="1680" fill="url(#hatch)" opacity="0.18"/>`;
  const land = `<path class="land" d="${round(path(LAND))}" fill="${o.land || P.paper2}" stroke="${P.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  let grat = '';
  if (o.graticule !== false) {
    for (let lon = -180; lon <= 180; lon += 5) grat += `<path d="${round(path({ type: 'LineString', coordinates: Array.from({ length: 33 }, (_, i) => [lon, -80 + i * 5]) }))}" stroke="${P.ink}" stroke-width="1" opacity="0.12" fill="none"/>`;
    for (let lat = -80; lat <= 80; lat += 5) grat += `<path d="${round(path({ type: 'LineString', coordinates: Array.from({ length: 73 }, (_, i) => [-180 + i * 5, lat]) }))}" stroke="${P.ink}" stroke-width="1" opacity="0.12" fill="none"/>`;
  }
  const country = (name, fill = P.amber2, cls = 'hl') => {
    const f = byName(name);
    if (!f) throw new Error('no country ' + name);
    return `<path class="${cls}" d="${round(path(f))}" fill="${fill}" stroke="${P.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  };
  const outline = (name, cls = 'ol', color = P.brick) => `<path class="${cls}" d="${round(path(byName(name)))}" fill="none" stroke="${color}" stroke-width="5" stroke-dasharray="1 1" pathLength="1"/>`;
  return { proj, xy, sea, land, grat, country, outline, base: () => `${sea}${land}${grat}` };
}

// a place marker + label
export function place(m, name, lon, lat, o = {}) {
  const [x, y] = m.xy(lon, lat);
  const size = o.size || 34;
  return g(o.cls || 'place', `<circle cx="${x}" cy="${y}" r="${o.r || 11}" fill="${o.color || P.ink}" stroke="${P.snow}" stroke-width="3"/>${label(x + (o.dx ?? 18), y + (o.dy ?? 10), name, { font: o.font || "'Mukta', Oswald", weight: 700, size, anchor: o.anchor || 'start', color: o.textColor || P.ink, extra: `paint-order="stroke" stroke="${P.paper}" stroke-width="7"` })}`);
}
// big region label (country/empire names)
export function regionLabel(m, text, lon, lat, o = {}) {
  const [x, y] = m.xy(lon, lat);
  return label(x, y, text, { font: o.font || "'Baloo 2', Oswald", weight: 800, size: o.size || 54, color: o.color || P.ink2, cls: o.cls || 'rlabel', extra: `letter-spacing="${o.letter || 2}" opacity="${o.op ?? 0.85}" paint-order="stroke" stroke="${P.paper}" stroke-width="8"` });
}
// curved invasion arrow from A to B (drawn with A.draw on `.cls`) + arrow head (popped)
export function arrow(m, from, to, o = {}) {
  const [x1, y1] = m.xy(...from), [x2, y2] = m.xy(...to);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
  const bend = o.bend ?? 0.2;
  const cx = mx - dy * bend, cy = my + dx * bend;
  const ang = Math.atan2(y2 - cy, x2 - cx) * 180 / Math.PI;
  const c = o.color || P.brick, w = o.w || 14;
  return g(o.cls || 'arrow', `<path class="shaft" d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="${P.ink}" stroke-width="${w + 7}" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><path class="shaft" d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><g class="head" transform="translate(${x2} ${y2}) rotate(${ang})"><path d="M${w * 0.6} 0L${-w * 2.2} ${-w * 1.6}L${-w * 2.2} ${w * 1.6}z" fill="${c}" stroke="${P.ink}" stroke-width="4" stroke-linejoin="round"/></g>`);
}
// soft empire extent: a smooth blob through lon/lat points
export function blob(m, pts, o = {}) {
  const xy = pts.map((p) => m.xy(...p));
  let d = `M${xy[0][0]} ${xy[0][1]}`;
  for (let i = 0; i < xy.length; i++) {
    const p0 = xy[(i - 1 + xy.length) % xy.length], p1 = xy[i], p2 = xy[(i + 1) % xy.length], p3 = xy[(i + 2) % xy.length];
    d += `C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return `<path class="${o.cls || 'blob'}" d="${d}Z" fill="${o.fill || P.brick}" fill-opacity="${o.op ?? 0.35}" stroke="${o.stroke || o.fill || P.brick}" stroke-width="5" stroke-dasharray="14 10"/>`;
}
// mountain range glyphs along a polyline of lon/lat points
export function mountains(m, pts, o = {}) {
  const xy = pts.map((p) => m.xy(...p));
  let out = '', k = 0;
  for (let i = 0; i < xy.length - 1; i++) {
    const [x1, y1] = xy[i], [x2, y2] = xy[i + 1], n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / (o.step || 46)));
    for (let j = 0; j < n; j++) {
      const x = x1 + ((x2 - x1) * j) / n, y = y1 + ((y2 - y1) * j) / n + ((k++ % 2) * 12 - 6), s = (o.size || 26) * (0.8 + (k % 3) * 0.15);
      out += `<path d="M${x - s} ${y + s * 0.6}L${x} ${y - s * 0.7}L${x + s} ${y + s * 0.6}z" fill="${P.ink3}" stroke="${P.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${x - s * 0.3} ${y - s * 0.3}L${x} ${y - s * 0.7}L${x + s * 0.3} ${y - s * 0.3}z" fill="${P.snow}"/>`;
    }
  }
  return g(o.cls || 'mtns', out);
}
