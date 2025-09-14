import style from './Game.module.scss';
import buttonBG from '../../assets/images/btn_bg.png';
import Loader from '../UI/Loader/Loader.tsx';
import type { ILocation } from '../../controllers/model.ts';
import locationBg from '../../assets/images/location_bg.png';
import moveIcon from '../../assets/images/icons/move_icon.png';
import { round } from '../../utils/round.ts';

interface IProps {
  selectedPosition: string;
  selectedLocationInfo?: ILocation;
  move?: () => void;
}

const SelectedLocation = ({
                           move,
                           selectedLocationInfo,
                           selectedPosition
                         }: IProps) => {
  return (
    <div className={style.selected__panel} style={{
      backgroundImage: `url(${locationBg})`
    }}>
      <h2>Location<br/>{selectedPosition}</h2>
      <div className={style.stats}>
        {selectedLocationInfo ? <>
          <div><span>Surface</span><span>{selectedLocationInfo.surface}</span></div>
          <div><span>Habitability</span><span>{selectedLocationInfo.habitability}</span></div>
          <div><span>Dust Density</span><span>{selectedLocationInfo.dust_density}</span></div>
          <div><span>Radiation Level</span><span>{selectedLocationInfo.radiation_level}</span></div>
          <div><span>Gold left</span><span>{round(selectedLocationInfo.goldLeft)}</span></div>
        </> : <Loader/>}
      </div>
      <div className={style.button} style={{
        backgroundImage: `url(${buttonBG})`
      }} onClick={move}>
        <img src={moveIcon}/>
        Move Here
      </div>
    </div>
  );
};

export default SelectedLocation;
