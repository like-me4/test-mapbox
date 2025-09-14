import style from './Game.module.scss';
import bg from '../../assets/images/hud_container 1.png';
import flag from '../../assets/images/flag_profile.png';
import simpleButtonBG from '../../assets/images/simple_btn.png';
import balanceIcon from '../../assets/images/icons/balance_icon.png';
import spqmIcon from '../../assets/images/icons/spqm_icon.png';
import marsDollarIcon from '../../assets/images/icons/mars_dollar_icon.png';
import { round } from '../../utils/round.ts';
import goldIcon from '../../assets/images/icons/gold_icon.png';
import o2Icon from '../../assets/images/icons/o2_icon.png';
import supplIcon from '../../assets/images/icons/suppl_icon.png';
import type { UserType } from '../../controllers/user/model.ts';

interface IProps {
  user?: UserType
}

const Header = ({user}: IProps) => {
  return (
    <div className={style.header} style={{
      backgroundImage: `url(${bg})`
    }}>
      <div className={style.left}>
        <img src={flag} alt=""/>
        <div className={style.buttons}>
          <div className={style.button} style={{
            backgroundImage: `url(${simpleButtonBG})`,
            height: 60
          }}>
            Profile
          </div>
          <div className={style.button} style={{
            backgroundImage: `url(${simpleButtonBG})`,
            height: 60
          }}>
            <img src={balanceIcon} alt="Balance"/>
            Balance
          </div>
          <div className={style.button} style={{
            backgroundImage: `url(${simpleButtonBG})`,
            height: 60
          }}>
            <img src={spqmIcon} alt="SPQM"/>
            SPQM
          </div>
        </div>
      </div>
      <div className={style.right}>
        <div className={style.resources}>
          <div className={style.resource}>
            <img src={marsDollarIcon} alt="" className={style.resource_icon}/>
            <span className={style.resource_value}>{round(user?.martian_dollars || '')}</span>
          </div>
          <div className={style.resource}>
            <img src={goldIcon} alt="" className={style.resource_icon}/>
            <span className={style.resource_value}>{round(user?.gold || '')}</span>
          </div>
          <div className={style.resource}>
            <img src={o2Icon} alt="" className={style.resource_icon}/>
            <span className={style.resource_value}>{round(user?.oxygen || '')}</span>
          </div>
          <div className={style.resource}>
            <img src={supplIcon} alt="" className={style.resource_icon}/>
            <span className={style.resource_value}>{round(user?.provision || '')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
