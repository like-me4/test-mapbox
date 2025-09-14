export const SOCKET_CONNECT = 'socket/connect';
export const SOCKET_DISCONNECT = 'socket/disconnect';
export const SOCKET_EVENT_RECEIVED = 'socket/eventReceived';
export const SOCKET_SEND_MESSAGE = 'socket/sendMessage';
export const SOCKET_EVENT_MESSAGE = 'message';
export const SOCKET_EVENT_NOTIFICATION = 'notification';
export const SOCKET_EVENT_WORLD_UPDATE = 'world_update';

export const SOCKET_EVENTS = {
  MESSAGE: SOCKET_EVENT_MESSAGE,
  NOTIFICATION: SOCKET_EVENT_NOTIFICATION,
  WORLD_UPDATE: SOCKET_EVENT_WORLD_UPDATE,
} as const;
