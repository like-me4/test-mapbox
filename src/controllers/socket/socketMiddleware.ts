import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import {
  socketEventWithAckSendAction,
  socketEventSendAction, initSocketConnectionAction, closeSocketConnectionAction,
} from './action.ts';
import { WS_ENDPOINT } from '../../config/api.ts';
import type { AppDispatch, RootState } from '../store.ts';
import { setLatestTickAction, setStateAction, setUserAction } from '../user';
import { logoutUserAction, refreshTokenAction } from '../auth/actions.ts';
import { validatePlayerUpdate, validateUser } from '../validators.ts';

let socket: Socket | null = null;

const URL = `${WS_ENDPOINT}/game`;
console.log('WS_ENDPOINT: ', WS_ENDPOINT);

export const socketMiddleware: Middleware<unknown, RootState> =
  (store: MiddlewareAPI<AppDispatch, RootState>) =>
    (next) =>
      (action) => {
        console.log('action: ', action);
        if (initSocketConnectionAction.match(action)) {
          const token = store.getState().auth.authData?.accessToken;
          console.log('token: ', token);
          console.log('socket: ', socket);
          if (!socket && token) {
            console.log('URL: ', URL);
            socket = io(URL, {
              auth: {
                token: store.getState().auth.authData?.accessToken,
              },
              transports: ['websocket']
            });

            socket.on('connect', () => {
              console.log('✅ Socket connected');
              store.dispatch(socketEventWithAckSendAction({
                event: 'get_player', callback: (result) => {
                  if (result) {
                    try {
                      const user = validateUser(result);
                      store.dispatch(setUserAction(user));
                    } catch (e) {
                      console.error('Invalid user data', e);
                    }
                  }
                },
              }));
            });

            socket.on('disconnect', () => {
              console.log('❌ Socket disconnected');
            });

            const handleTokenRefresh = async () => {
              const refreshToken = store.getState().auth.authData?.refreshToken;
              if (!refreshToken) {
                store.dispatch(logoutUserAction());
                return;
              }

              try {
                await store.dispatch(refreshTokenAction()).unwrap();
                if (socket) {
                  socket.disconnect();
                  socket.auth = {
                    token: store.getState().auth.authData?.accessToken,
                  };
                  socket.connect();
                }
              } catch (e) {
                console.error('Token refresh failed', e);
                store.dispatch(logoutUserAction());
              }
            };

            socket.on('token_expired', handleTokenRefresh);
            socket.on('token_need_refresh', handleTokenRefresh);

            socket.on('player_update', (update: unknown) => {
              console.log('player_update.data: ', update);
              try {
                const parsed = validatePlayerUpdate(update);
                const { state, data: userData } = parsed.data;
                store.dispatch(setUserAction(userData));
                store.dispatch(setStateAction(state));
                store.dispatch(setLatestTickAction(parsed.tick));
              } catch (e) {
                console.error('Invalid player update', e);
              }
            });

          }
        }

        if (closeSocketConnectionAction.match(action)) {
          if (socket) {
            socket.disconnect();
            socket = null;
          }
        }

        if (socketEventSendAction.match(action)) {
          console.log('socketEventSendAction: ', action);
          if (socket && socket.connected) {
            console.log('📡 Sending message:', action.payload.event, action.payload.payload);
            socket.emit(action.payload.event, action.payload.payload);
          } else {
            console.warn('📡 Socket not connected. Message not sent.');
          }
        }

        if (socketEventWithAckSendAction.match(action)) {
          if (socket && socket.connected) {
            console.log('📡 Sending message:', action.payload.event, action.payload.payload);
            socket.emitWithAck(action.payload.event, action.payload.payload).then((res) => {
              console.log('📡 Acknowledged response:', res);
              if (action.payload.callback) {
                action.payload.callback(res.result);
              }
            });
          } else {
            console.warn('📡 Socket not connected. Message not sent.');
          }
        }

        return next(action);
      };
