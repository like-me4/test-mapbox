import Login from '../components/Login/Login.tsx';
import Register from '../components/Register/Register.tsx';
import Game from '../components/Game/Game.tsx';
import { Route, Routes } from 'react-router';

export const Redirect = () => {
  window.location.href = '/';
  return <></>;
};

export const Router = () => {
  return <Routes>
    <Route index element={<Game />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="*" element={<Redirect />} />
  </Routes>;
};
