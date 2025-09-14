import { type BaseQueryFn, type FetchArgs, fetchBaseQuery, type FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SERVER_ENDPOINT } from 'config/api';
import type { RootState } from '../store';
import { updateAuthDataAction } from './index';
import { logoutUserAction } from './actions.ts';
import { AuthExceptionCodeEnum } from 'config/enums/authExceptionCodeEnum';
import { saveAccess } from 'utils/manageAccess';
import { authTypeEnum } from 'config/enums/authTypeEnum';

const baseQuery = fetchBaseQuery({
  baseUrl: SERVER_ENDPOINT,
  prepareHeaders: (headers, {getState}) => {
    const store = getState() as RootState;
    const accessToken = store.auth.authData?.accessToken;
    if (accessToken) {
      headers.set(authTypeEnum.access, `Bearer ${accessToken}`);
    }
    return headers;
  }
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && result.error.data) {
    const errorData = result.error.data as { code?: string };

    if (
      typeof errorData === 'object' &&
      'code' in errorData &&
      [
        AuthExceptionCodeEnum.TokenExpired,
        AuthExceptionCodeEnum.TokenNeedRefresh,
        AuthExceptionCodeEnum.Expired
      ].includes(errorData.code as AuthExceptionCodeEnum)
    ) {
      const refreshToken = (api.getState() as RootState).auth.authData?.refreshToken;

      if (refreshToken) {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { token: refreshToken }
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const tokens = refreshResult.data as { accessToken: string; refreshToken: string };
          api.dispatch(updateAuthDataAction(tokens));
          saveAccess(tokens);
          return await baseQuery(args, api, extraOptions);
        }
      }

      api.dispatch(logoutUserAction());
    }
  }

  return result;
};
