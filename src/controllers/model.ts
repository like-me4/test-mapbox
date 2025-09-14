export interface IStatusState {
  loaders: ILoader[];
  errors: IError[];
}

export interface ILoader {
  id: string;
  message?: string;
}

export interface IError {
  id: string;
  code?: number;
  message?: string;
  error?: boolean;
  data: any;
}

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}

export type User = {
  email: string;
  id: number;
  name: string;
  location: string;
  oxygen: number;
  gold: number;
  provision: number;
  martian_dollars: number;
}; // Replace with actual User type


export interface ILocation {
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
