import style from './Game.module.scss';

import { useGame } from '../../context/Game.context.tsx';

import { useEffect } from 'react';
import CurrentLocation from './CurrentLocation.tsx';
import Header from './Header.tsx';
import SelectedLocation from './SelectedLocation.tsx';
import { selectUser, selectUserState, setUserWaitAction } from '../../controllers/user';
import { useAppDispatch, useAppSelector } from '../../hooks/store.ts';
import { socketEventSendAction, socketEventWithAckSendAction } from '../../controllers/socket/action.ts';
import { setLocationAction } from '../../controllers/world';

const Game = () => {
  const user = useAppSelector(selectUser);
  const state = useAppSelector(selectUserState);
  const dispatch = useAppDispatch();

  const {
    currentPosition,
    purposePosition,
    selectedPosition,
    setSelectedPosition,
    currentLocationInfo,
    selectedLocationInfo,
  } = useGame();

  const getLocationInfo = (position: string) => {
    console.log('getLocationInfo: ', position);
    dispatch(socketEventWithAckSendAction(
      {
        event: 'get_location',
        payload: {
          id: position,
        },
        callback: (res: any) => {
          console.log('Location info received: ', res);
          dispatch(setLocationAction(res));
          return res;
        },
      }));
  };

  // Get selected location info
  useEffect(() => {
    if (selectedPosition) {
      getLocationInfo(selectedPosition);
    }
  }, [selectedPosition]);

  // Get current location info
  useEffect(() => {
    if (currentPosition) {
      getLocationInfo(currentPosition);
    }
  }, [currentPosition]);

  // Get purpose location info
  useEffect(() => {
    if (purposePosition) {
      getLocationInfo(purposePosition);
    }
  }, [purposePosition]);

  const stop = () => {
    dispatch(socketEventSendAction({
      event: 'cancel_action', payload: {
        playerId: user?.id,
      },
    }));
    dispatch(setUserWaitAction({
      type: null
    }));
  };

  const move = (currentPosition: string, position: string) => {
    console.log('move:', {
      event: 'move', payload: {
        playerId: user?.id,
        from: currentPosition,
        to: position,
      },
    })
    dispatch(socketEventSendAction({
      event: 'move', payload: {
        playerId: user?.id,
        from: currentPosition,
        to: position,
      },
    }));
    dispatch(setUserWaitAction({
      type: 'move'
    }));
  };

  const mine = (position: string) => {
    dispatch(socketEventSendAction({
      event: 'mine', payload: {
        playerId: user?.id,
        location: position,
      },
    }));
    dispatch(setUserWaitAction({
      type: 'mine'
    }));
  };

  return (
    <div className={style.interface}>
      <Header user={user} />
      {selectedPosition ?
        <SelectedLocation
          selectedPosition={selectedPosition}
          selectedLocationInfo={selectedLocationInfo}
          move={() => {
            // setPurposePosition(selectedPosition);
            setSelectedPosition(undefined);
            move(currentPosition, selectedPosition);
          }} />
        : <></>}
      {currentPosition ?
        <CurrentLocation
          currentPosition={currentPosition}
          purposePosition={purposePosition}
          state={state}
          currentLocationInfo={currentLocationInfo}
          cancelMoving={() => {
            setSelectedPosition(undefined);
            stop();
          }}
          mine={() => {
            setSelectedPosition(undefined);
            mine(currentPosition);
          }}
        /> : <></>}

      <svg height="40" width="40" className={style.loader}>
        <circle cx="20" cy="20" r="18" stroke="#428bca" strokeWidth="4" />
      </svg>
    </div>
  );
};

export default Game;
