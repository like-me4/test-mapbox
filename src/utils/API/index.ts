/* eslint-disable */
import { Unauthorized, BadRequest } from './Exceptions';

export async function handleErrors<T = unknown>(
  fetch: Promise<Response>,
  validator?: (data: unknown) => T
): Promise<T> {
  try {
    const res = await fetch;
    if (!res.ok) {
      const error = await res.json();
      if (error?.statusCode) {
        if (error.statusCode === 422) {
          throw error;
        }

        if (error.statusCode === 403 || error.statusCode === 401) {
          // throw error;
        } else {
          throw new BadRequest(error?.message);
        }
      } else if (error?.code || error?.message || error?.userMessage) {
        if (error.status === 422) {
          throw {
            code: error.status,
            data: error.response
          };
        }
        if (error.code === 'Unauthorized') {
          throw new Unauthorized(error?.message || error?.userMessage);
        } else {
          throw new BadRequest(error?.message || error?.userMessage);
        }
      } else {
        throw new Error(`Request filed with code: ${res.status}`);
      }
    }

    const data = await res.json();
    console.log('handleErrors', data);

    return validator ? validator(data) : (data as T);
  } catch (error) {
    throw error;
  }
}

export function authHeader(token: string) {
  return {
    authorization: `Bearer ${token}`
  };
}

export function refreshHeader(token: string) {
  return {
    'refresh-token': `Bearer ${token}`
  };
}
