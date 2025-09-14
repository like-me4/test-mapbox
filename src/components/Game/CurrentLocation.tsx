import style from './Game.module.scss';
import panelBg from '../../assets/images/win_curr_loc_transparent_fixed.png';
import buttonBG from '../../assets/images/btn_bg.png';
import stopHereIcon from '../../assets/images/icons/stop_here_icon.svg';
import Loader from '../UI/Loader/Loader.tsx';
import type { ILocation } from '../../controllers/model.ts';
import type { StateType } from '../../controllers/user/model.ts';
import { round } from '../../utils/round.ts';
import { selectUserWaitAction } from '../../controllers/user';
import { useAppSelector } from '../../hooks/store.ts';

interface IProps {
  currentPosition: string;
  purposePosition?: string;
  state?: StateType;
  currentLocationInfo?: ILocation;
  cancelMoving?: () => void;
  mine?: () => void;
}

const CurrentLocation = ({
                           currentPosition,
                           purposePosition,
                           cancelMoving,
                           state,
                           mine,
                           currentLocationInfo,
                         }: IProps) => {
  const action = useAppSelector(selectUserWaitAction);
  return (
    <div className={style.current__panel} style={{
      backgroundImage: `url(${panelBg})`,
    }}>
      <h2>Current location<br />{currentPosition}</h2>
      {state ? <div className={style.location_info}>
        {state?.type === 'move' ? <>
          Moving <span>[{currentPosition}] → [{purposePosition}]</span><br />
          {/*<span>{time}</span>*/}
        </> : ''}
        {state?.type === 'mine' ? <>
          Mining <span>[{currentPosition}]</span><br />
          <span>Gold mined: {round(state.goldMined)}</span>
        </> : ''}
      </div> : <></>}
      <div className={style.stats}>
        {currentLocationInfo ? <>
          <div><span>Surface</span><span>{currentLocationInfo.surface}</span></div>
          <div><span>Habitability</span><span>{currentLocationInfo.habitability}</span></div>
          <div><span>Dust Density</span><span>{currentLocationInfo.dust_density}</span></div>
          <div><span>Radiation Level</span><span>{currentLocationInfo.radiation_level}</span></div>
          <div><span>Gold left</span><span>{round(currentLocationInfo.goldLeft)}</span></div>
        </> : <Loader />}
      </div>
      <div>
        {action ? <Loader /> :
          !state?.type
            ? <div
              className={style.button}
              style={{
                backgroundImage: `url(${buttonBG})`,
              }}
              onClick={mine}
            >
              <img src={stopHereIcon} />
              Start Digging
            </div>
            : state?.type === 'mine' ?
              <div
                className={style.button}
                style={{
                  backgroundImage: `url(${buttonBG})`,
                }}
                onClick={cancelMoving}
              >
                <img src={stopHereIcon} />
                Stop Digging
              </div>
              : state?.type === 'move' ? <div
                  className={style.button}
                  style={{
                    backgroundImage: `url(${buttonBG})`,
                  }}
                  onClick={cancelMoving}
                >
                  <img src={stopHereIcon} />
                  Stop Here
                </div>
                : ''
        }
      </div>
    </div>
  );
};

export default CurrentLocation;
