import Graphic from '@arcgis/core/Graphic';
import PolygonSymbol3D from '@arcgis/core/symbols/PolygonSymbol3D';
import FillSymbol3DLayer from '@arcgis/core/symbols/FillSymbol3DLayer';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
// import { SpatialReference } from '@arcgis/core/geometry';
// import * as geodesicBufferOperator from '@arcgis/core/geometry/operators/geodesicBufferOperator.js';
import * as projection from "@arcgis/core/geometry/projection";
import { marsSR } from '../config';

export async function addInnerShadow({
                                       layer,
                                       polygon,          // esri/geometry/Polygon (у WGS або WebMercator)
                                       widthMeters = 0.4, // ширина зони тіні від краю всередину
                                       steps = 6,        // кількість кілець (чим більше — тим плавніше)
                                       color = [255, 163, 32],// базовий колір тіні (RGB)
                                       maxAlpha = 0.35,  // непрозорість біля краю
                                       minAlpha = 0.0,    // непрозорість біля центру
                                     }) {
  // Починаємо від зовнішнього контуру й рухаємось до центру
  const step = widthMeters / steps;
  console.log('step: ', step);

  // Зовнішня «оболонка» для різниці на кожному кроці
  let outer = polygon;

  for (let i = 1; i <= steps; i++) {
    const insetDist = i * step;

    console.log('polygon: ', polygon);
    console.log('insetDist: ', insetDist);

    // Внутрішній буфер (негативний — звужує полігон)
    // const projected = geometryEngine.project(polygon, new SpatialReference({ wkid: 3857 }));
    await projection.load();
    const projected = projection.project(polygon, marsSR);
    const inner = geometryEngine.buffer(projected, -insetDist);
    // const inner = geodesicBufferOperator.execute(polygon, -insetDist);
    // const inner = geometryEngine.geodesicBuffer(polygon, -insetDist, 'meters');

    // @ts-expect-error should works ok
    if (!inner || inner.isEmpty) break;

    // Кільце = різниця між попереднім зовнішнім контуром і поточним буфером
    const ring = geometryEngine.difference(outer, inner);
    // @ts-expect-error should works ok
    if (!ring || ring.isEmpty) break;

    // Інтерполяція прозорості (темніше біля краю, світліше до центру)
    const t = (i - 1) / (steps - 1);
    const alpha = maxAlpha + (minAlpha - maxAlpha) * t;

    console.log({
      color,
      alpha,
    })

    const ringSymbol = new PolygonSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: { color: [...color, alpha] },
        }),
      ],
    });

    layer.add(new Graphic({ geometry: ring, symbol: ringSymbol }));

    // Зсуваємо «зовнішній» контур для наступного кільця
    outer = inner;
  }
}

// 3) Виклик: ваш полігон у змінній `yourPolygon

// // Опційно: базове заповнення самого полігона (без екструзії)
// const fill = new PolygonSymbol3D({
//   symbolLayers: [new FillSymbol3DLayer({ material: { color: [255, 255, 255, 0.1] } })]
// });
// shadowLayer.add(new Graphic({ geometry: yourPolygon, symbol: fill }));
