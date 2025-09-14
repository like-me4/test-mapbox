import type { IStatusState } from '../model.ts';

export type PathItemType = { location: string; distance: number };
export type PathType = PathItemType[];

export const name = 'user';

export interface IUserState {
  status: IStatusState;
  user?: UserType;
  state?: StateType;
  latestTick?: number;
  waitAction?: {
    tick: number;
    type: 'move' | 'mine' | null;
  }
}

export type UserType = {
  email: string;
  id: number;
  name: string;
  location: string;
  oxygen: number;
  gold: number;
  provision: number;
  martian_dollars: number;
};

export type StateType = IMoveAction | IMineAction | null;

export interface IMoveAction{

  actionId: string;
  playerId: string;
  progress: number;
  currentLocation: string;
  type: 'move';
  pathLength: number;
  path: PathType;
  wayProgress: number;
}

export interface IMineAction{
  actionId: string;
  playerId: string;
  progress: number;
  currentLocation: string;
  type: 'mine';
  goldMined: number;
  duration?: number;
}
