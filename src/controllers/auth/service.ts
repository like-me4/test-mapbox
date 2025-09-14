import { MODE, SERVER_ENDPOINT } from 'config/api';
import { authHeader, handleErrors } from 'utils/API';
import { Unauthorized } from 'utils/API/Exceptions';
import {
  validateLoginResponse,
  validateRefreshResponse,
  validateUser,
  validateRegisterResponse
} from '../validators.ts';
import { AuthExceptionCodeEnum } from 'config/enums/authExceptionCodeEnum.d';
import type { ILoginRequest, IRegisterRequest } from './model.ts';
import type { TokensPair, User } from '../model.ts';

class API {
  async register(
    data: IRegisterRequest,
  ): Promise<{ id: number; email: string } | { error: string }> {
    return handleErrors(
      fetch(SERVER_ENDPOINT + '/auth/register', {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
      }),
      validateRegisterResponse
    );
  }

  async login(
    data: ILoginRequest,
  ): Promise<(TokensPair & Record<string, unknown>) | { error: string }> {
    console.log('MODE: ', MODE);
    console.log('MODE === "development": ', MODE === 'development');
    // if(MODE) {
    //   if(data.username === "admin" && data.password === "admin") {
    //     return {
    //       account: {
    //         id: 1,
    //         email: 'test@test.test',
    //         name: 'Test',
    //         location: '82b237fffffffff',
    //         oxygen: 500,
    //         goldBalance: 0,
    //         provision: 600,
    //         martianDollars: 300
    //       },
    //       tokens: {
    //         accessToken: "123",
    //         refreshToken: "321"
    //       }
    //     }
    //   } else {
    //     return {
    //       error: "Invalid username or password",
    //     };
    //   }
    // }

    return handleErrors(
      fetch(SERVER_ENDPOINT + '/auth/login', {
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }),
      validateLoginResponse,
    );
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const data = new FormData();
    data.set('jwt', refreshToken);
    return handleErrors(
      fetch(SERVER_ENDPOINT + '/auth/refresh', {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      }),
      validateRefreshResponse,
    );
  }

  async getCurrentAccount({ accessToken }: TokensPair): Promise<User> {
    const res = fetch(SERVER_ENDPOINT + '/auth/profile', {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(accessToken),
      },
      method: 'GET',
    });

    const response = await res;

    console.log('response: ', response);

    if (response.status !== 401) {
      return handleErrors(res, validateUser);
    }

    const parsedRes = await response.json();
    if (response.status === 401 && typeof parsedRes === 'object' && parsedRes.code === AuthExceptionCodeEnum.Expired) {
      console.log('expired token, can\'t to refresh');
      throw new Unauthorized(parsedRes?.message || parsedRes?.userMessage);
    } else {
      throw new Unauthorized(parsedRes?.message || parsedRes?.userMessage);
    }
  }
}

export const AuthAPI = new API();
