import { getResolution } from './getRessolution.ts';
import * as h3 from 'h3-js';
import type { FeatureCollection } from 'geojson';

export function renderHexes(map): FeatureCollection {
  if (!map) {
    return {
      'type': 'FeatureCollection',
      'features': []
    }
  }
  const latitudeMax = 90;
  const latitudeMin = -latitudeMax;
  const longitudeMax = 180;
  const longitudeMin = -longitudeMax;

  const extraFillArea = 0.5;
  // const blueColor = '#0080ff';
  // const borderLayerName = 'hex-layer-border';
  // const hexSourceName = 'hex-source';

  const currentZoom = map.getZoom();
  const h3res = getResolution(currentZoom);
  console.log('Resolution: ' + JSON.stringify(h3res));

  const iw = window.innerWidth;
  const ih = window.innerHeight;
  const cUL = map.unproject([0, 0]).toArray(); // Upper left
  const cLR = map.unproject([iw, ih]).toArray(); // Lower right
  const x1 = Math.min(cUL[0], cLR[0]);
  const x2 = Math.max(cUL[0], cLR[0]);
  const y1 = Math.min(cUL[1], cLR[1]);
  const y2 = Math.max(cUL[1], cLR[1]);
  const dh = x2 - x1;
  const dv = y2 - y1;
  console.log(`REAL Coordinates x1:${x1} x2:${x2} y1:${y1} y2:${y2} dh:${dh} dv:${dv}`);

  let x1withBuffer = x1 - dh * extraFillArea;
  let x2withBuffer = x2 + dh * extraFillArea;
  let y1withBuffer = y1 - dv * extraFillArea;
  let y2withBuffer = y2 + dv * extraFillArea;
  const fullX = x1withBuffer < longitudeMin || x2withBuffer > longitudeMax;

  x1withBuffer = Math.max(x1withBuffer, longitudeMin);
  x2withBuffer = Math.min(x2withBuffer, longitudeMax);
  y1withBuffer = Math.max(y1withBuffer, latitudeMin);
  y2withBuffer = Math.min(y2withBuffer, latitudeMax);
  console.log(`BUFF Coordinates x1:${x1withBuffer} x2:${x2withBuffer} y1:${y1withBuffer} y2:${y2withBuffer} fullView:${fullX}`);

  const coordinates = [];
  if (fullX) {
    coordinates.push([
      [latitudeMin, longitudeMin],
      [latitudeMin, 0],
      [latitudeMax, 0],
      [latitudeMax, longitudeMin]
    ]);

    coordinates.push([
      [latitudeMin, 0],
      [latitudeMin, longitudeMax],
      [latitudeMax, longitudeMax],
      [latitudeMax, 0]
    ]);
  } else {
    const xIncrement = 180;
    let lowerX = x1withBuffer;
    while (lowerX < longitudeMax && lowerX < x2withBuffer) {
      const upperX = Math.min(lowerX + xIncrement, x2withBuffer, 180);
      coordinates.push([[
        [y2withBuffer, lowerX],
        [y2withBuffer, upperX],
        [y1withBuffer, upperX],
        [y1withBuffer, lowerX]
      ]]);
      console.log(`PUSH Coordinates x1:${lowerX} x2:${upperX} y1:${y1withBuffer} y2:${y2withBuffer}`);
      lowerX += xIncrement;
    }
  }

  const shapes = [].concat(...coordinates.map(e => {
    return h3.polygonToCells(e, h3res);
  }));
  const hexBoundaries = [];
  const pentaBoundaries = [];
  for (let i = 0; i < shapes.length; i++) {
    let h = h3.cellToBoundary(shapes[i], true);
    if (h.find((e) => e[0] < -128) !== undefined) {
      h = h.map((e) => e[0] > 0 ? [e[0] - 360, e[1]] : e);
    }

    if (h3.isPentagon(shapes[i])) {
      pentaBoundaries.push(h);
    } else {
      hexBoundaries.push(h);
    }
  }
  console.log(`currentZoom: ${currentZoom}, resolution: ${h3res}, shapes: ${hexBoundaries.length}`);

  return {
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'properties': {'color': 'blue'},
      'geometry': {
        'type': 'Polygon',
        'coordinates': hexBoundaries
      }
    },
      {
        'type': 'Feature',
        'properties': {'color': 'red'},
        'geometry': {
          'type': 'Polygon',
          'coordinates': pentaBoundaries
        }
      }]
  };
}
