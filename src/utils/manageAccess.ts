import { authTypeEnum } from 'config/enums/authTypeEnum.d';
import type { TokensPair } from 'controllers/model';

export const saveAccess = ({ accessToken, refreshToken }: TokensPair) => {
  localStorage[authTypeEnum.access] = accessToken;
  localStorage[authTypeEnum.refresh] = refreshToken;
};

export const clearAccess = () => {
  localStorage.removeItem(authTypeEnum.access);
  localStorage.removeItem(authTypeEnum.refresh);
};

export const getSavedAccess = (): TokensPair | undefined => {
  const accessToken = localStorage[authTypeEnum.access];
  const refreshToken = localStorage[authTypeEnum.refresh];
  if (accessToken && refreshToken) {
    return {
      accessToken,
      refreshToken
    };
  }
};

export const getSavedAccessToken = () => {
  return localStorage[authTypeEnum.access];
};

export const getSavedRefreshToken = () => {
  return localStorage[authTypeEnum.refresh];
};
