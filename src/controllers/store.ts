import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Reducers
import authReducer from './auth';
import userReducer from './user';
import worldReducer from './world';
import { socketMiddleware } from './socket/socketMiddleware.ts';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  world: worldReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(socketMiddleware)
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
