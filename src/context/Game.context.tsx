import React, { createContext, useContext, useState } from 'react';
import type { ILocation } from '../controllers/model.ts';
import { useAppSelector } from '../hooks/store.ts';
import type { PathType, StateType, UserType } from '../controllers/user/model.ts';

export interface IGameContext {
  selectedPosition?: string;
  setSelectedPosition?: (position: string) => void;
  currentPosition?: string;
  purposePosition?: string;
  currentLocationInfo?: ILocation;
  purposeLocationInfo?: ILocation;
  selectedLocationInfo?: ILocation;
  path?: PathType;
  time: string;
}

const GameContext = createContext<IGameContext | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within an GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);
  const userState: StateType = useAppSelector(state => state.user.state);
  const userData: UserType = useAppSelector(state => state.user.user);

  const purposePosition = userState?.type === 'move' && userState.path.length > 0 ? userState.path[userState.path.length - 1].location : undefined;
  const currentPosition = userState?.currentLocation || userData?.location || undefined;

  const currentLocationInfo = useAppSelector(state => state.world.locations[currentPosition]);
  const selectedLocationInfo = useAppSelector(state => state.world.locations[selectedPosition]);
  const purposeLocationInfo = useAppSelector(state => state.world.locations[purposePosition]);

  return (
    <GameContext.Provider value={{
      currentPosition,
      purposePosition,
      selectedPosition,
      setSelectedPosition,
      currentLocationInfo,
      purposeLocationInfo,
      selectedLocationInfo,
      path: userState && 'path' in userState ? userState.path : undefined,
      time: "",
    }}>
      {children}
    </GameContext.Provider>
  );
};
