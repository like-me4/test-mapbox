import Map, { NavigationControl, ScaleControl, FullscreenControl, GeolocateControl, Layer, Source } from 'react-map-gl/mapbox';
import { useRef, useState } from 'react';
import { renderHexes } from '../../utils/renderHexes.ts';
import 'mapbox-gl/dist/mapbox-gl.css';
// import { renderHexes } from '../../utils/renderHexes.ts';

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
      maxZoom={8}
      minPitch={0}
      maxPitch={85}
      reuseMaps
      mapboxAccessToken="pk.eyJ1IjoidGhlLWhhbmRzb21lLWFuZHJldyIsImEiOiJjbWZqZ3U0eTQweWt6MmtzYWZndnoza2NhIn0.kxRwgqSyJCGP--FYNfra7w"
      // initialViewState={viewState}
      onMove={(e) => setViewState(e.viewState)}
      style={{width: '100vw', height: '100vh'}}
      mapStyle="mapbox://styles/mapbox/standard"
      projection={'globe'}
      onLoad={(e) => setHexData(renderHexes(e.target))}
      onZoomEnd={(e) => setHexData(renderHexes(e.target))}
      onMoveEnd={(e) => setHexData(renderHexes(e.target))}
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
              'line-width': 2
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
