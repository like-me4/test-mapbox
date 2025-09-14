import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type IUserState, name, type StateType, type UserType } from './model.ts';
import type { RootState } from '../store.ts';

const initialState: IUserState = {
  status: {
    loaders: [],
    errors: []
  }
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setUserAction: (state, { payload }: PayloadAction<Partial<UserType>>) => {
      console.log('setUserAction payload: ', payload);
      state.user = {
        ...state.user,
        ...payload
      }
    },
    setStateAction: (state, { payload }: PayloadAction<StateType>) => {
      console.log('setStateAction payload: ', payload);
      state.state = payload;
    },
    setLatestTickAction: (state, { payload }: PayloadAction<number>) => {
      console.log('setLatestTickAction payload: ', payload);
      state.latestTick = payload;
      state.waitAction = undefined;
    },
    setUserWaitAction: (state, { payload }: PayloadAction<{ type: 'move' | 'mine' | null }>) => {
      console.log('setUserWaitAction payload: ', payload);
      state.waitAction = {
        tick: state.latestTick,
        type: payload.type
      };
    },
  }
});

export const { setUserAction, setStateAction, setLatestTickAction, setUserWaitAction } = slice.actions;

export default slice.reducer;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserState = (state: RootState) => state.user.state;
export const selectLatestTick = (state: RootState) => state.user.latestTick;
export const selectUserWaitAction = (state: RootState) => state.user.waitAction;
