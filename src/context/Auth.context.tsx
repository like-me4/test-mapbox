import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { getSavedAccess } from '../utils/manageAccess.ts';
import { loginByTokenAction, logoutUserAction } from '../controllers/auth/actions.ts';
import { useAppDispatch } from '../hooks/store.ts';
interface AuthContextType {
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAuthorizedData = async () => {
    // console.log('loadAuthorizedData: ', loadAuthorizedData);
    const authData = getSavedAccess();
    console.log('authData: ', authData);
    if (authData?.accessToken && authData?.refreshToken) {
      try {
        console.log('loginByTokenAction: ', authData);
        await dispatch(loginByTokenAction(authData)).unwrap();
        setIsLoading(false);
      } catch (e) {
        console.log('error: ', e);
        await dispatch(logoutUserAction()).unwrap();
        setIsLoading(false);
        navigate('/login', {replace: true});
      }
    } else {
      setIsLoading(false);
      navigate('/login', {replace: true});
    }
  }

  useEffect(() => {
    loadAuthorizedData();
  }, []);

  return (<AuthContext.Provider value={{loading: isLoading}}>
    {children}
  </AuthContext.Provider>);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
