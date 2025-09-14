import Graphic from '@arcgis/core/Graphic';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';

import * as h3 from 'h3-js';
// import { splitHexagonToGeoJSON } from './processHexagon';
import { mapServer, resolution, scaleThreshold } from '../config';
import { Polygon } from '@arcgis/core/geometry';
// import { getGraphics } from './corrections.ts';
import * as normalizeUtils from '@arcgis/core/geometry/support/normalizeUtils';
import { splitHexagonToGeoJSON } from './processHexagon.ts';
import Polyline from '@arcgis/core/geometry/Polyline';
// import geometryEngine from "esri/geometry/geometryEngine";
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';

export const marsImagery = new TileLayer({
  id: 'marsImagery',
  portalItem: {
    id: '1efb16809db84f0c892b9b0662dab0c8'
  },
  url: 'https://ternala.dev/mars/',
  sourceJSON: mapServer,
  title: 'Mars Imagery',
  copyright: 'USGS Astrogeology Science Center, NASA, JPL, Esri',
  opacity: 1
});

export const marsImageryBasemap = new Basemap({
  id: 'marsBasemap',
  title: 'marsBasemap',
  thumbnailUrl:
    'https://www.arcgis.com/sharing/rest/content/items/1efb16809db84f0c892b9b0662dab0c8/info/thumbnail/thumbnail1552849034608.png',
  baseLayers: [marsImagery]
});

const res0 = h3.getRes0Cells();
// const graphicsLarge = res0.map((h3Index) => {
//   // const boundary = h3.cellToBoundary(h3Index, true); // true = замкнений полігон
//   const ring = h3.cellToBoundary(h3Index, true);
//   const closed = [...ring, ring[0]];
//
//   const poly = new Polygon({
//     rings: [closed],
//     spatialReference: { wkid: 4326 } // працюємо в географічних градусах
//   });
//   // const geo = splitHexagonToGeoJSON(boundary)
//   return new Graphic({
//     geometry: poly,
//     attributes: {
//       id: 'large_' + h3Index,
//       title: h3Index
//     }
//   });
// }, []);

// const hexIndexes = res0.flatMap(h => h3.cellToChildren(h, resolution));
window.locations = {};
const hexagones = [
  '80e9fffffffffff',
  '80e3fffffffffff',
  '80ebfffffffffff',
  '80effffffffffff',
  '80e7fffffffffff',
  '80e1fffffffffff',
  '80e5fffffffffff',
  '80d9fffffffffff',
//   another row,
  '80f3fffffffffff',
  '80edfffffffffff',
  '80f1fffffffffff',
]

let counter = 10000;
const graphicsSmall = await Promise.all(res0.map(async (h3Index) => {
  if(!hexagones.includes(h3Index)) return;

  // const boundary = h3.cellToBoundary(h3Index, true); // true = замкнений полігон
  // const geo = splitHexagonToGeoJSON(boundary)
  const ring = h3.cellToBoundary(h3Index, true);
  console.log('ring: ', ring);

  // const geo = splitHexagonToGeoJSON(ring)
  //
  // // 2) замкнути
  const closed = [...ring];
  // 3) Polygon (WGS84)
  const poly = new Polygon({
    rings: [closed],
    spatialReference: { wkid: 4326 }
  });
  console.log('h3Index: ', h3Index);
  console.log('closed: ', closed);
  const geoArr = await normalizeUtils.normalizeCentralMeridian(poly);

  const dateline = new Polyline({
    paths: [[[180, -90], [180, 90]]],
    spatialReference: { wkid: 4326 }
  });
  const parts = geoArr.flatMap(g => geometryEngine.cut(g, dateline) ?? [g]);
  console.log('part: ', geometryEngine.cut(geoArr[0], dateline))
  // geometryEngine.cut(geoArr, dateline)
  const cleaned = parts.map(p => geometryEngine.simplify(p) ?? p);

  console.log('h3Index: ', h3Index);
  console.log('geoArr: ', geoArr);
  console.log('parts: ', parts);
  console.log('cleaned: ', cleaned);

  // counter++;
  // window.locations[counter] = {
  //   geometry: geo,
  //   h3Index,
  //   ring
  // };
  // return new Graphic({
  //   geometry: geo,
  //   attributes: {
  //     id: counter,
  //     h3Index: counter,
  //     name: counter
  //   }
  // });
  return cleaned.map(geo => {
    counter++;
    window.locations[counter] = {
      geometry: geo,
      h3Index
    };

    return new Graphic({
      geometry: geo,
      attributes: {
        id: counter,
        h3Index: counter,
        name: counter
      }
    });
  })
}, []));

// const graphics = await getGraphics()
// console.log('graphics: ', graphics);

export const hexLayerLarge = new FeatureLayer({
  source: graphicsSmall.filter(Boolean).flat(1),
  fields: [
    {name: 'id', type: 'string'},
    {name: 'title', type: 'string'}
  ],
  objectIdField: 'id',
  geometryType: 'polygon',
  spatialReference: { wkid: 4326 },
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: [255, 255, 255, 0.1], // прозорий
      outline: {
        color: [197, 165, 130],
        width: 0.5
      }
    }
  },
  elevationInfo: {
    mode: 'on-the-ground'
  },
  minScale: 0,
  maxScale: scaleThreshold
})
export const hexLayerSmall = new FeatureLayer({
  source: [],
  fields: [
    {
      name: 'id',
      alias: 'id',
      type: 'integer'
    },
    {name: 'h3Index', alias: 'h3Index', type: 'integer'}
  ],
  objectIdField: 'id',
  geometryType: 'polygon',
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-fill',
      color: [255, 255, 255, 0.01], // прозорий
      outline: {
        color: [197, 165, 130],
        width: 0.5
      }
    }
  },
  elevationInfo: {
    mode: 'on-the-ground'
  },
  minScale: scaleThreshold
})
