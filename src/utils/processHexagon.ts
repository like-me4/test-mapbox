import { Polygon } from '@arcgis/core/geometry';
import { marsSR } from '../config';

export const splitHexagonToGeoJSON = (hexCoords: number[][]) => {
  const wrapLng = 180;

  function normalizeLng(lng: number) {
    if (lng > 180) return lng - 360;
    if (lng < -180) return lng + 360;
    return lng;
  }

  function isCrossingAntimeridian(coords: number[][]) {
    for (let i = 0; i < coords.length - 1; i++) {
      const delta = Math.abs(coords[i][0] - coords[i + 1][0]);
      if (delta > 180) return true;
    }
    return false;
  }

  // Normalize all coordinates first
  const normalized = hexCoords.map(([lng, lat]) => [normalizeLng(lng), lat]);

  if (!isCrossingAntimeridian(normalized)) {
    return new Polygon({
      rings: [normalized],
      spatialReference: marsSR
    });
  }

  // Split into left and right parts
  const left:number[][] = [];
  const right:number[][] = [];

  function interpolateLat(lat1:number, lng1:number, lat2:number, lng2:number, cutLng:number) {
    const ratio = (cutLng - lng1) / (lng2 - lng1);
    return lat1 + (lat2 - lat1) * ratio;
  }

  for (let i = 0; i < normalized.length - 1; i++) {
    const [lng1, lat1] = normalized[i];
    const [lng2, lat2] = normalized[i + 1];

    // const segment = [[lng1, lat1]];

    const crosses = Math.abs(lng1 - lng2) > 180;

    if (lng1 >= 0) right.push([lng1, lat1]);
    else left.push([lng1, lat1]);

    if (crosses) {
      const cutLng = lng1 > 0 ? wrapLng : -wrapLng;
      const cutLat = interpolateLat(lat1, lng1, lat2, lng2, cutLng);

      // Add edge points to both parts
      if (lng1 > 0) {
        right.push([wrapLng, cutLat]);
        left.push([-wrapLng, cutLat]);
      } else {
        left.push([-wrapLng, cutLat]);
        right.push([wrapLng, cutLat]);
      }
    }
  }

  // Close both rings
  if (left.length > 0) left.push(left[0]);
  if (right.length > 0) right.push(right[0]);

  const result = {
    spatialReference: marsSR,
    type: "polygon",
    rings: [],
  };

  if (left.length >= 4) {
    result.rings.push(left);
  }
  if (right.length >= 4) {
    result.rings.push(right);
  }

  return new Polygon(result);
}
