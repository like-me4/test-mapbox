import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { loginAction, registerAction, loginByTokenAction, refreshTokenAction } from './actions';
import { type IAuthState, name } from './model';
import type { TokensPair } from '../model';

const initialState: IAuthState = {
  status: {
    loaders: [],
    errors: []
  }
};

const slice = createSlice({
  name,
  initialState,
  reducers: {
    updateAuthDataAction: (state, { payload }: PayloadAction<TokensPair>) => {
      state.authData = payload;
    },
    logoutAction: state => {
      state.authData = undefined;
    }
  },
  extraReducers: builder => {
    builder.addCase(registerAction.pending, (state, action) => {
      state.status.loaders.push({
        id: action.meta.requestId
      });
    });
    builder.addCase(registerAction.fulfilled, (state, { meta }) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== meta.requestId);
    });
    builder.addCase(registerAction.rejected, (state, action) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
      state.status.errors.push({
        id: action.meta.requestId,
        data: action.payload
      });
    });
    builder.addCase(loginAction.pending, (state, action) => {
      state.status.loaders.push({
        id: action.meta.requestId
      });
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      // console.log({action});
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
      // state.account = action.payload.account;
      state.authData = action.payload;
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
      state.status.errors.push({
        id: action.meta.requestId,
        data: action.payload
      });
    });
    builder.addCase(loginByTokenAction.pending, (state, action) => {
      state.status.loaders.push({
        id: action.meta.requestId
      });
    });
    builder.addCase(loginByTokenAction.fulfilled, (state, action) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
    });
    builder.addCase(loginByTokenAction.rejected, (state, action) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
      state.status.errors.push({
        id: action.meta.requestId,
        data: action.payload
      });
    });

    builder.addCase(refreshTokenAction.pending, (state, action) => {
      state.status.loaders.push({
        id: action.meta.requestId
      });
    });
    builder.addCase(refreshTokenAction.fulfilled, (state, action) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
    });
    builder.addCase(refreshTokenAction.rejected, (state, action) => {
      state.status.loaders = state.status.loaders.filter(loader => loader.id !== action.meta.requestId);
      state.status.errors.push({
        id: action.meta.requestId,
        data: action.payload
      });
    });
  }
});

export const { updateAuthDataAction, logoutAction } = slice.actions;

export default slice.reducer;

export const selectAuthData = (state: RootState) => state.auth.authData;
export const selectAccessToken = (state: RootState) => state.auth.authData?.accessToken;
export const selectStatus = (state: RootState) => state.auth.status;
export const selectedLoaders = (state: RootState) => state.auth.status?.loaders;
export const selectErrors = (state: RootState) => state.auth.status?.loaders.length !== 0;
