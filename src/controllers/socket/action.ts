import { createAction } from '@reduxjs/toolkit';

export const initSocketConnectionAction = createAction('socket/init');
export const closeSocketConnectionAction = createAction('socket/close');
export const socketEventReceivedAction = createAction<{ event: string; payload: any }>('socket/eventReceived');
export const socketEventSendAction = createAction<{ event: string; payload?: any; }>('socket/emitEvent');
export const socketEventWithAckSendAction = createAction<{
  event: string;
  payload?: any;
  callback?: (res: any) => void
}>('socket/emitWithAckEvent');
