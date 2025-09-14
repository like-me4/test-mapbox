import SceneViewComponent from '../SceneViewComponent/SceneViewComponent.tsx';
import style from './App.module.scss';

const App = () => {
  return (
    <div className={style.app}>
      <SceneViewComponent />
    </div>
  );
};

export default App;
