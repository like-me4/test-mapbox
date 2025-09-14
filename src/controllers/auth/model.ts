import type { IStatusState, TokensPair } from '../model';

export const name = 'auth';

export interface IAuthState {
  authData?: TokensPair;
  status: IStatusState;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}


