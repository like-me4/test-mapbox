import Map, { NavigationControl, ScaleControl, FullscreenControl, GeolocateControl, Layer, Source } from 'react-map-gl/mapbox';
import { useRef, useState } from 'react';
import { renderHexes } from '../../utils/renderHexes.ts';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapServer } from '../../config';
// import { renderHexes } from '../../utils/renderHexes.ts';


const tileUrl = 'https://ternala.dev/mars/tile/{z}/{y}/{x}';
const tileSize = mapServer.tileInfo.cols;                    // 512
const maxZoom  = mapServer.tileInfo.lods[mapServer.tileInfo.lods.length - 1]!.level;      // 17


const marsStyle: mapboxgl.Style = {
  version: 8,
  sources: {
    mars: {
      type: 'raster',
      tiles: [tileUrl],
      tileSize,
      bounds: [-180, -90, 180, 90],
      attribution: mapServer.copyrightText
    }
  },
  layers: [{ id: 'mars-layer', type: 'raster', source: 'mars' }],
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  fog: {
    range: [0.6, 8],               // де зникає поверхня
    color: 'rgba(255,120,60,0.05)', // помаранчевий відтінок біля горизонту
    'horizon-blend': 0.005,          // плавний перехід
    'high-color': 'rgba(255,120,60,0.5)',
    'space-color': '#000',         // колір космосу (чорний)
    'star-intensity': 0.1            // 0 – без зірок, >0 – зірки
  }
};

const MapApp = () => {
  const [hexData, setHexData] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 0,
    zoom: 1.5,
    pitch: 0,
    bearing: 0
  });
  const mapRef = useRef(null);

  return (
    <Map
      mapLib={import('mapbox-gl')}
      ref={mapRef}
      dragPan={true}
      dragRotate={true}          // обертання правою кнопкою або Ctrl+лівий drag
      pitchWithRotate={true}     // при rotate можна міняти pitch
      scrollZoom={true}
      boxZoom={true}
      doubleClickZoom={true}
      touchZoomRotate={true}     // pinch-to-zoom + rotate на тачпадах/мобільних
      touchPitch={true}
      keyboard={true}
      cooperativeGestures={false}
      minZoom={0.5}
      maxZoom={maxZoom}
      minPitch={0}
      maxPitch={85}
      reuseMaps
      mapboxAccessToken="pk.eyJ1IjoidGhlLWhhbmRzb21lLWFuZHJldyIsImEiOiJjbWZqZ3U0eTQweWt6MmtzYWZndnoza2NhIn0.kxRwgqSyJCGP--FYNfra7w"
      initialViewState={viewState}
      onMove={(e) => setViewState(e.viewState)}
      style={{width: '100vw', height: '100vh'}}
      mapStyle={marsStyle}
      // mapStyle="mapbox://styles/mapbox/light-v10"
      projection={'globe'}
      onLoad={(e) => {
        setHexData(renderHexes(e.target))
        e.target.setLight({
          position: [1, 180, 90],
          intensity: 0.5
        })
      }}
      onZoomEnd={(e) => setHexData(renderHexes(e.target))}
      onMoveEnd={(e) => setHexData(renderHexes(e.target))}
      onDragEnd={(e) => setHexData(renderHexes(e.target))}
      // onLoad={(e) => {
      //   //   // Атмосфера для глобуса (необов’язково)
      //   // const map = e.target;
      //   console.log('loaded: ', map);
      //   // console.log('mapRef.current: ', mapRef.current);
      //   // console.log(' getSource: ', mapRef.current.getSource('hex-source'));
      //   // console.log(' addSource: ', mapRef.current.addSource);
      //   //   // map.setFog({
      //   //   //   range: [0.5, 10],
      //   //   //   color: "rgba(200, 200, 255, 0.05)",
      //   //   //   "horizon-blend": 0.2
      //   //   // });
      // }}
    >
      {hexData && (<Source id={'grid'} type={'geojson'} data={hexData}>
        <Layer
          id={'hex-layer-border'}
          source={'grid'}
          type={'line'}
          paint={{
              'line-color': ['get', 'color'],
              'line-width': 1
          }}
        />
      </Source>)}
      {/*<NavigationControl position="top-right" visualizePitch={true} />*/}
      <GeolocateControl position="top-right" trackUserLocation={true}/>
      <ScaleControl position="bottom-left"/>
      <FullscreenControl position="top-right"/>
      {/*<ScaleControl    />*/}
      <NavigationControl
        position={'top-left'}
        visualizePitch={true}
        showCompass={true}
        showZoom={true}
      />
    </Map>
  );
};

export default MapApp;
