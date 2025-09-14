import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import 'assets/scss/index.scss';
import { AuthProvider } from 'context/Auth.context.tsx';
import { store } from 'controllers/store.ts';
import { GameProvider } from './context/Game.context.tsx';
import MapApp from './components/MapApp/MapApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <GameProvider>
            <MapApp />
            {/*<App/>*/}
          </GameProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
