/// <reference types="@arcgis/map-components/types/react" />
/// <reference types="vite/client" />

// import type { CoordPair } from 'h3-js';

declare global {
  interface Window {
    locations: Record<string, {
      geometry: geo,
      h3Index: string
      // ring: CoordPair[];
    }>;
  }
}

export {};
