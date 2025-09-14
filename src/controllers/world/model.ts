import type { IStatusState } from '../model.ts';

export const name = 'world';

export interface IWorldState {
  status: IStatusState;
  locations?: Record<string, LocationType>
}


export type LocationType = {
  centerLat: number,
  centerLng: number,
  dust_density: number,
  goldLeft: number,
  h3Index: string
  habitability: number;
  id: number;
  radiation_level: number;
  surface: number;
  type: 'DESERT' | 'CITY' | 'OTHER';
}
