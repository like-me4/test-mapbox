import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { name } from '../auth/model.ts';
import type { RootState } from '../store.ts';
import type { IWorldState, LocationType } from './model.ts';

const initialState: IWorldState = {
  status: {
    loaders: [],
    errors: []
  },
  locations: {}
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    setLocationAction: (state, { payload }: PayloadAction<LocationType>) => {
      state.locations[payload.h3Index] = payload;
    }
  }
});

export const { setLocationAction } = slice.actions;

export default slice.reducer;

export const selectLocation = (state: RootState, id: string) => state.world.locations[id];
