import { type FC, useEffect, useRef, useState } from 'react';
import { hexLayerLarge, hexLayerSmall, marsImageryBasemap } from '../../utils/layers.ts';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import NavigationToggle from '@arcgis/core/widgets/NavigationToggle';

import { Point } from '@arcgis/core/geometry';
import Graphic from '@arcgis/core/Graphic';
import SceneView from '@arcgis/core/views/SceneView';
import Map from '@arcgis/core/Map';
import { highlightStyles, marsSR, scaleThreshold } from '../../config';
import { PictureMarkerSymbol, SimpleFillSymbol } from '@arcgis/core/symbols';

import '@arcgis/core/assets/esri/themes/light/main.css';
import * as centroidOperator from '@arcgis/core/geometry/operators/centroidOperator';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';

import { useGame } from '../../context/Game.context.tsx';
import style from './SceneViewComponent.module.scss';
import MapControls, { type ButtonConfig } from './MapControls';
import zoomIn from '../../assets/images/icons/new/zoom-in.png';
import zoomOut from '../../assets/images/icons/new/zoom-out.png';
import rotate from '../../assets/images/icons/new/rotate.png';
import pan from '../../assets/images/icons/new/pan.png';
import compas from '../../assets/images/icons/new/compas.png';
import diamondBg from '../../assets/images/icons/new/diamond_bg.png';
import hexagonBg from '../../assets/images/icons/new/hexagon.png';
import { addInnerShadow } from '../../utils/highlightPath.ts';


const move = (longitude: number, latitude: number, playerGraphic: Graphic) => {
  animateGraphic(playerGraphic, longitude, latitude, 1000);
}

function animateGraphic(graphic: Graphic, targetLon: number, targetLat: number, duration = 1000) {
  const start = performance.now();
  const startPoint = graphic?.geometry;
  if (startPoint instanceof Point) {
    const startCoords = {
      longitude: startPoint.longitude,
      latitude: startPoint.latitude
    };

    function step(timestamp: number) {
      const elapsed = timestamp - start;
      const t = Math.min(elapsed / duration, 1); // 0..1
      const newLon = (startCoords?.longitude || 0) + t * (targetLon - (startCoords?.longitude || 0));
      const newLat = (startCoords?.latitude || 0) + t * (targetLat - (startCoords?.latitude || 0));

      graphic.geometry = new Point({
        longitude: newLon,
        latitude: newLat,
        spatialReference: marsSR,
        z: 2
      });
      if (t < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }
}

let view: SceneView;
let graphicsLayerSelectedHexagon: GraphicsLayer;
let shadowLayer: GraphicsLayer;
// let pathHighlight: Graphic | null = null;
let playerGraphic;

const SceneViewComponent: FC = () => {
  const {
    purposePosition,
    currentPosition,
    selectedPosition,
    setSelectedPosition,
    path
  } = useGame();

  const [storedLocation, setStoredLocation] = useState<string | null>(currentPosition);
  const selectedHexagonRef = useRef<Graphic>(null);
  const storedPathRef = useRef<string>('');
  // const currentHexagonRef = useRef<Graphic>(null);
  const purposeHexagonRef = useRef<Graphic>(null);
  const userRef = useRef<string>(null);
  const [sceneView, setSceneView] = useState<SceneView | null>(null);
  const buttons: ButtonConfig[] = [
    {
      id: 'zoom-in',
      icon: zoomIn,
      background: diamondBg,
      onClick: (v) => v.goTo({ zoom: v.zoom + 1 })
    },
    {
      id: 'zoom-out',
      icon: zoomOut,
      background: diamondBg,
      onClick: (v) => v.goTo({ zoom: v.zoom - 1 })
    },
    {
      id: 'pan',
      icon: pan,
      background: diamondBg,
      onClick: (v) => {
        const nav = new NavigationToggle({ view: v });
        nav.viewModel.navigationMode = "pan";
      }
    },
    {
      id: 'rotate',
      icon: rotate,
      background: diamondBg,
      onClick: (v) => {
        const nav = new NavigationToggle({ view: v });
        nav.viewModel.navigationMode = "rotate";
      }
    },
    {
      id: 'compass',
      icon: compas,
      background: hexagonBg,
      onClick: (v) => v.goTo({ heading: 0, tilt: 0 })
    }
  ];

  useEffect(() => {
    if(!storedLocation){
      setStoredLocation(currentPosition)
    }
  }, [currentPosition]);

  // const [line, setLine] = useState<string[]>([]);

  const mapDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mapDiv.current) return;
    let interactingHandle;
    let pointerDownHandle;
    let mouseWheelHandle;
    if (!view) {
      const map = new Map({
        basemap: marsImageryBasemap,
        ground: {
          surfaceColor: [144, 106, 100]
        }
      });

      view = new SceneView({
        container: mapDiv.current,
        map,
        qualityProfile: 'high',
        spatialReference: marsSR,
        environment: {
          lighting: {
            type: 'virtual',
            directShadowsEnabled: true,
          }
        },
        camera: {
          position: {
            spatialReference: {
              wkid: 104971
            },
            x: -57.10234077359152,
            y: -24.37565105257643,
            z: scaleThreshold * 1.2
          },
          heading: 293.23407097843636,
          tilt: 0
        },
        theme: {
          accentColor: 'rgb(0,255,0)'
        }
      });
      view.ui.remove('attribution');
      view.ui.remove('zoom');
      view.ui.remove('navigation-toggle');
      view.ui.remove('compass');
      // view.map.layers.add(hexLayerSmall);
      view.map.layers.add(hexLayerLarge);
      setSceneView(view);

      // const stopSpin = () => {
      //   spinGlobe?.remove();
      //   spinGlobe = null;
      // };
      // interactingHandle = view.watch('interacting', (v) => v && stopSpin());
      // pointerDownHandle = view.on('pointer-down', stopSpin);
      // mouseWheelHandle = view.on('mouse-wheel', stopSpin);

      view.watch('camera', (camera) => {
        const center = view.center;
        if(view.center){
          // console.log('center: ', center);
          const direction = [
            center.x - camera.position?.x,
            center.y - camera.position?.y,
            center.z - camera.position?.z
          ];
          const length = Math.hypot(direction[0], direction[1], direction[2]) || 1;

          (view.environment.lighting as any).mainLight = {
            ...(view.environment.lighting as any).mainLight,
            direction: direction.map((d) => d / length)
          };
        }
      });

      let highlightSmall;
      let highlightLarge;
      view.whenLayerView(hexLayerSmall).then(function (layerView) {
        view.on('pointer-move', function (event) {
          if (view.scale > scaleThreshold) return;
          view.hitTest(event).then(function (response) {
            const results = response.results.filter(function (result) {
              return 'graphic' in result ? result.graphic.layer === hexLayerSmall : false;
            });

            if (results.length > 0 && 'graphic' in results[0]) {
              const graphic = results[0].graphic;

              if (highlightSmall) {
                highlightSmall.remove();
              }
              highlightSmall = layerView.highlight(graphic);
            } else {
              if (highlightSmall) {
                highlightSmall.remove();
                highlightSmall = null;
              }
            }
          });
        });
      });

      view.whenLayerView(hexLayerLarge).then(function (layerView) {
        view.on('click', function (event) {
          if (view.scale < scaleThreshold) return;
          view.hitTest(event).then(function (response) {
            const results = response.results.filter(function (result) {
              return 'graphic' in result ? result.graphic.layer === hexLayerLarge : false;
            });
            if (results.length > 0 && 'graphic' in results[0]) {
              const graphic = results[0].graphic;
              console.log('window.locations[graphic.attributes.id].h3Index:', window.locations[graphic.attributes.id].h3Index);
              console.log('window.locations[graphic.attributes.id].ring:', window.locations[graphic.attributes.id].ring);
              console.log('graphic.geometry: ', graphic.geometry);
              if ('centroid' in graphic.geometry) {
                view.goTo({
                  center: graphic.geometry?.centroid,
                  zoom: 4
                }, {
                  easing: 'ease-in-out',
                  duration: 400
                });
              }
            }
          });
        });
        view.on('pointer-move', function (event) {
          if (view.scale < scaleThreshold) return;
          view.hitTest(event).then(function (response) {
            const results = response.results.filter(function (result) {
              return 'graphic' in result ? result.graphic.layer === hexLayerLarge : false;
            });

            if (results.length > 0 && 'graphic' in results[0]) {
              const graphic = results[0].graphic;

              if (highlightLarge) {
                highlightLarge.remove();
              }
              highlightLarge = layerView.highlight(graphic);
            } else {
              if (highlightLarge) {
                highlightLarge.remove();
                highlightLarge = null;
              }
            }
          });
        });
      });
      // view.on("click", (event) => {
      //   view.hitTest(event).then((response) => {
      //     const g = response.results[0]?.graphic;
      //     if (g?.attributes?.role === "player") {
      //       view.goTo({
      //         center: g,
      //         zoom: 5
      //       }, {
      //         easing: "ease-in-out",
      //         duration: 400
      //       });
      //     }
      //   });
      // });

      graphicsLayerSelectedHexagon = new GraphicsLayer({
        // @ts-expect-error for some reason TypeScript doesn't recognize this property
        spartialReference: marsSR,
        minScale: scaleThreshold
      });
      shadowLayer = new GraphicsLayer({
        elevationInfo: { mode: "on-the-ground" },
        spatialReference: marsSR,
      });
      view.map.layers.addMany([graphicsLayerSelectedHexagon, shadowLayer]);
    }
    return () => {
      interactingHandle?.remove();
      pointerDownHandle?.remove();
      mouseWheelHandle?.remove();
    };
  }, []);


  useEffect(() => {
    if (!userRef.current && currentPosition) {
      userRef.current = currentPosition;
      const graphicsLayer = new GraphicsLayer({
        // @ts-expect-error for some reason typescript doesn't recognize this property
        spartialReference: marsSR
      });

      view?.map.layers.add(graphicsLayer);
      if (!window.locations) return;
      const res = Object.entries(window.locations).find(el => {
        const [, location] = el;
        return location?.h3Index === currentPosition;
      })

      if (!Array.isArray(res) || !res?.[1]) {
        console.error('Current location not found for user');
        return;
      }

      const currentLocation = res?.[1];
      const center = centroidOperator.execute(currentLocation.geometry);

      const playerPoint = new Point({
        longitude: center.longitude,
        latitude: center.latitude,
        spatialReference: marsSR,
        z: 2
      });

      const symbol = new PictureMarkerSymbol({
        url: '/user.png',
        width: '64px',
        height: '64px'
      });

      playerGraphic = new Graphic({
        geometry: playerPoint,
        symbol: symbol
      });

      graphicsLayer.add(playerGraphic);

      setTimeout(() => {
        view.goTo({
          center,
          zoom: 4
        }, {
          easing: 'ease-in-out',
          duration: 1000
        });
      }, 2000)
      view.on('click', function (event) {
        if (view.scale > scaleThreshold) return;
        view.hitTest(event).then(function (response) {
          const results = response.results.filter(function (result) {
            return 'graphic' in result ? result.graphic.layer === hexLayerSmall : false;
          });

          if (results.length > 0 && 'graphic' in results[0]) {
            const graphic = results[0].graphic;
            if ('centroid' in graphic.geometry) {
              console.log('graphic.attributes.id:', graphic.attributes.id);
              // const centroid = graphic.geometry?.centroid;
              setSelectedPosition(window.locations[graphic.attributes.id].h3Index);
              // move(centroid.longitude, centroid.latitude, playerGraphic);
            }
          }
        });
      });
    }
  }, [currentPosition, setSelectedPosition]);

  useEffect(() => {
    // if (currentPosition) {
    //   if (currentHexagonRef.current) {
    //     graphicsLayerSelectedHexagon?.remove(currentHexagonRef.current)
    //   }
    //   const [, location] = Object.entries(window.locations).find(el => {
    //     const [, location] = el;
    //     return location?.h3Index === currentPosition;
    //   });
    //   const highlightCurrent = new Graphic({
    //     geometry: location.geometry,
    //     symbol: new SimpleFillSymbol(highlightStyles['current']),
    //     attributes: {
    //       id: 'purpose_location' + location.h3Index
    //     }
    //   });
    //   currentHexagonRef.current = highlightCurrent;
    //   graphicsLayerSelectedHexagon?.add(highlightCurrent);
    // } else {
    //   graphicsLayerSelectedHexagon?.remove(currentHexagonRef.current)
    // }
    if (selectedPosition) {
      if (selectedHexagonRef.current) {
        graphicsLayerSelectedHexagon?.remove(selectedHexagonRef.current)
      }

      const [, selectedLocation] = Object.entries(window.locations).find(el => {
        const [, location] = el;
        return location?.h3Index === selectedPosition;
      });
      const highlightSelect = new Graphic({
        geometry: selectedLocation.geometry,
        symbol: new SimpleFillSymbol(highlightStyles['purpose']),
        attributes: {
          id: 'select_location' + selectedLocation.h3Index
        }
      });
      selectedHexagonRef.current = highlightSelect;
      graphicsLayerSelectedHexagon?.add(highlightSelect);
    } else {
      graphicsLayerSelectedHexagon?.remove(selectedHexagonRef.current)
    }
    if (purposePosition) {
      if (purposeHexagonRef.current) {
        graphicsLayerSelectedHexagon?.remove(purposeHexagonRef.current)
      }

      const [, purposeLocation] = Object.entries(window.locations).find(el => {
        const [, location] = el;
        return location?.h3Index === purposePosition;
      });

      const highlightPurpose = new Graphic({
        geometry: purposeLocation.geometry,
        symbol: new SimpleFillSymbol(highlightStyles['warning']),
        attributes: {
          id: 'purpose_location' + purposeLocation.h3Index
        }
      });
      purposeHexagonRef.current = highlightPurpose;
      graphicsLayerSelectedHexagon?.add(highlightPurpose);
    } else {
      // purposeHexagonRef.current.
      graphicsLayerSelectedHexagon?.remove(purposeHexagonRef.current)
    }
  }, [currentPosition, selectedPosition, purposePosition]);

  useEffect(() => {
    const pathLocations = path?.map(i => i.location).join()
    if (path && path.length) {
      if(storedPathRef.current !== pathLocations){
        const polygons = path.map((pathItem) => {
          const [, location] = Object.entries(window.locations).find((el) => {
            const [, location] = el;
            return location?.h3Index === pathItem.location;
          });
          return location?.geometry;
        });

        const unionGeometry = geometryEngine.union(polygons);
        addInnerShadow({
          layer: shadowLayer,
          polygon: unionGeometry,
          widthMeters: 0.5,
          steps: 5,
          color: [255, 163, 32],
          maxAlpha: 0.4,
          minAlpha: 0
        });
        // pathHighlight = createPathHighlight(unionGeometry);
        // graphicsLayerSelectedHexagon?.add(pathHighlight);
        storedPathRef.current = pathLocations
      }
    } else {
      shadowLayer?.removeAll();
      // graphicsLayerSelectedHexagon?.remove(pathHighlight);
      // pathHighlight = null;
    }
  }, [path]);

  useEffect(() => {
    if(storedLocation !== currentPosition){
      const res = Object.entries(window.locations).find(el => {
        const [, location] = el;
        return location?.h3Index === currentPosition;
      })
      if (!res?.[1]) {
        console.error('Current location not found for user');
        return;
      }
      const center = centroidOperator.execute(res?.[1].geometry);
      move(center.longitude, center.latitude, playerGraphic);
      setStoredLocation(currentPosition)
    }
  }, [storedLocation, currentPosition]);

  return <div style={{height: '100vh', width: '100%', position: 'relative'}}>
    <div style={{height: '100vh', width: '100%'}} ref={mapDiv}/>
    {sceneView && <MapControls view={sceneView} buttons={buttons} />}
    <div className={style.vignette} />
    {/*{line?.length ? <div className={style.list}>*/}
    {/*  <ul>*/}
    {/*    {line.map((h3Index) => {*/}
    {/*      return <li key={h3Index} className={classNames({[style.selected]: currentPosition === h3Index})}>{h3Index}</li>*/}
    {/*    })}*/}
    {/*  </ul>*/}
    {/*  <div className={style.button} onClick={moveForward}>Move forward</div>*/}
    {/*</div> : ""}*/}
  </div>
};

export default SceneViewComponent;
