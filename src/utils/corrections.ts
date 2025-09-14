import * as h3 from 'h3-js';
import Polygon from '@arcgis/core/geometry/Polygon';
import Polyline from '@arcgis/core/geometry/Polyline';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as normalizeUtils from "@arcgis/core/geometry/support/normalizeUtils.js";
import Graphic from '@arcgis/core/Graphic';

const SR = {wkid: 4326}; // працюємо у WGS84; для Марса базову підкладку теж тримайте у -180..180

// 1) UNWRAP: робимо довготи монотонними (без стрибків через ±180°)
function unwrapRingLngLat(ringLngLat) {
  if (!ringLngLat.length) return ringLngLat;
  const out = [ringLngLat[0].slice()];
  let prev = ringLngLat[0][0]; // lng
  let offset = 0;

  for (let i = 1; i < ringLngLat.length; i++) {
    const [lng, lat] = ringLngLat[i];
    const diff = lng + offset - prev;

    if (diff > 180) offset -= 360;
    else if (diff < -180) offset += 360;

    const adjLng = lng + offset;
    out.push([adjLng, lat]);
    prev = adjLng;
  }
  return out;
}

// 2) Побудова ПРАВИЛЬНОГО полігону з H3
async function h3CellToPolygonFixed(cell) {
  // H3 -> кільце [lng, lat]
  const ring = h3.cellToBoundary(cell, true);

  // UNWRAP
  const unwrapped = unwrapRingLngLat(ring);

  // Закриваємо кільце
  const closed = [...unwrapped, unwrapped[0]];

  // Геодезичне ущільнення ребер: спершу як polyline
  const pl = new Polyline({paths: [closed], spatialReference: SR});
  // крок 10–20 км достатній; для res=0..2 можна 50–100 км
  const densified = geometryEngine.geodesicDensify(pl, 50, 'kilometers');

  // Утворюємо полігон з денсифікованої лінії
  if (densified instanceof Polyline) {
    const poly = new Polygon({
      rings: [densified.paths[0]],
      spatialReference: SR
    });

    // 3) Нормалізація антимеридіану (повертає полігон або масив частин)
    const norm = await normalizeUtils.normalizeCentralMeridian(poly);
    return Array.isArray(norm) ? norm : [norm];
  }
}

export const getGraphics = async () => {
  const cells = h3.getRes0Cells();
  const graphics = [];
  let oid = 1;
  for (const cell of cells) {
    const parts = await h3CellToPolygonFixed(cell);
    for (const geom of parts) {
      // (опц.) geometryEngine.simplify(geom) якщо бачите попередження про самоперетини
      graphics.push(new Graphic({
        geometry: geom,
        attributes: {
          ObjectID: oid++,
          h3: cell,
          isPent: h3.isPentagon(cell) ? 1 : 0,
          res: h3.getResolution(cell)
        }
      }));
    }
  }
  return graphics;
}

