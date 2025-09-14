import type { FC } from 'react';
import SceneView from '@arcgis/core/views/SceneView';
import style from './SceneViewComponent.module.scss';

import navigationLine from '../../assets/images/navigation.png';

export interface ButtonConfig {
  id: string;
  icon: string;
  background: string;
  onClick: (view: SceneView) => void;
}

interface MapControlsProps {
  view: SceneView;
  buttons?: ButtonConfig[];
}

const MapControls: FC<MapControlsProps> = ({ view, buttons = [] }) => {
  return (
    <div className={style.controls}>
      <img src={navigationLine} alt="" className={style.controls_bg}/>
      {buttons.map(({ id, icon, background, onClick }) => (
        <button
          key={id}
          className={style.button}
          style={{ backgroundImage: `url(${background})` }}
          onClick={() => onClick(view)}
        >
          <img src={icon} alt="" />
        </button>
      ))}
    </div>
  );
};

export default MapControls;
