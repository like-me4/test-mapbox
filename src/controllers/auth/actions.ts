import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearAccess, saveAccess } from 'utils/manageAccess';

import { logoutAction, updateAuthDataAction } from './index';
import { type ILoginRequest, type IRegisterRequest, name as sliceName } from './model';
import { AuthAPI } from './service';
import type { TokensPair } from '../model.ts';
import type { RootState } from '../store.ts';
import { closeSocketConnectionAction, initSocketConnectionAction } from '../socket/action.ts';

export const registerAction = createAsyncThunk(`${sliceName}/register`, async (
  data: IRegisterRequest,
  { rejectWithValue }
) => {
  try {
    const res = await AuthAPI.register(data);
    console.log('registerAction');
    if ('id' in res && 'email' in res) {
      return { id: res.id, email: res.email };
    }
    return rejectWithValue(res);
  } catch (err) {
    console.error('e: ', err);
    console.log('registerAction failed');
    return rejectWithValue(err);
  }
});

export const loginAction = createAsyncThunk(`${sliceName}/login`, async (data: ILoginRequest, {
  rejectWithValue,
  dispatch
}) => {
  try {
    const res = await AuthAPI.login(data);
    console.log('loginAction');
    if ('accessToken' in res) {
      const { accessToken, refreshToken } = res;
      const tokens: TokensPair = { accessToken, refreshToken };

      console.log('saveAccess: ', tokens);
      saveAccess(tokens);

      dispatch(updateAuthDataAction(tokens));
      dispatch(initSocketConnectionAction());

      return tokens;
    } else {
      return rejectWithValue(res);
    }
  } catch (err) {
    console.error('e: ', err);
    console.log('loginAction failed');
    return rejectWithValue(err);
  }
});

// export const wpAuthAction = createAsyncThunk(`${sliceName}/wp-login`, async (nonce: string, { rejectWithValue, dispatch }) => {
//   try {
//     console.log('wpAuthAction');
//     const res = await AuthAPI.wpLogin(nonce);
//     saveAccess(res.data);
//     await dispatch(updateAuthDataAction(res.data));
//     await dispatch(loginByTokenAction());
//     return true;
//   } catch (err) {
//     console.log('wpAuthAction failed');
//     console.error('e: ', err);
//     return rejectWithValue(err);
//   }
// });

export const loginByTokenAction = createAsyncThunk(`${sliceName}/login-by-token`, async (
  tokens: TokensPair,
  { rejectWithValue, dispatch }
) => {
  const { accessToken, refreshToken } = tokens || {};
  console.log('loginByTokenAction: ', tokens);
  if (!accessToken) {
    return rejectWithValue("Token wasn't provided");
  }
  console.log('try get user: ');
  const user = await AuthAPI.getCurrentAccount({
    accessToken,
    refreshToken
  });
  try {
    console.log('loginByTokenAction');
    console.log('user: ', user);
    if (user) {
      dispatch(updateAuthDataAction(tokens));
      dispatch(initSocketConnectionAction());
      return tokens;
    } else {
      return rejectWithValue("Token doesn't work");
    }
  } catch (err) {
    console.log('loginByTokenAction failed');
    console.error('e: ', err);
    return rejectWithValue(err);
  }
});

export const refreshTokenAction = createAsyncThunk(`${sliceName}/refresh-token`, async (
  _,
  { rejectWithValue, dispatch, getState }
) => {
  try {
    const state = getState() as RootState;
    const refreshToken = state.auth.authData?.refreshToken;
    if (!refreshToken) {
      return rejectWithValue('No refresh token');
    }

    const res = await AuthAPI.refresh(refreshToken);
    if ('accessToken' in res) {
      const { accessToken, refreshToken: newRefreshToken } = res;
      const tokens: TokensPair = {
        accessToken,
        refreshToken: newRefreshToken
      };

      saveAccess(tokens);
      dispatch(updateAuthDataAction(tokens));

      return tokens;
    }

    return rejectWithValue(res);
  } catch (err) {
    console.error('refreshTokenAction failed', err);
    return rejectWithValue(err);
  }
});


export const logoutUserAction = createAsyncThunk<void, void>(`${sliceName}/logout`, async (_, {
  rejectWithValue,
  dispatch
}) => {
  console.log('logoutAction');
  try {
    dispatch(closeSocketConnectionAction());
    dispatch(logoutAction())
    clearAccess();
  } catch (err) {
    console.log('loginByTokenAction failed');
    console.error('e: ', err);
    return rejectWithValue(err);
  }
});
