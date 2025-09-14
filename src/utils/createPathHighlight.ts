import Graphic from '@arcgis/core/Graphic';
import { CIMSymbol } from '@arcgis/core/symbols';

export function createPathHighlight(geometry: __esri.Geometry) {
  console.log('geometry: ', geometry);
  return new Graphic({
    geometry,
    symbol: new CIMSymbol({
      data: {
        type: "CIMSymbolReference",
        symbol: {
          type: "CIMGradientStroke",
          enable: true,
          gradientMethod: "AcrossLine",
          gradientSize: 100,
          gradientSizeUnits: "Relative",
          gradientType: "Continuous",
          capStyle: "Round",
          joinStyle: "Round",
          miterLimit: 4,
          width: 12,
          colorRamp: {
            type: "CIMMultipartColorRamp",
            colorRamps: [
              {
                type: "CIMLinearContinuousColorRamp",
                fromColor: [255, 255, 255, 255], // white
                toColor: [190, 232, 255, 255] // light blue
              }
            ],
            weights: [1]
          }
        }
      }
    }),
  });
}
