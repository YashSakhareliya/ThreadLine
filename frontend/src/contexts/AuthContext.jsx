import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../services/authService';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
} from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(loginStart());
        try {
          const res = await authService.getCurrentUser();
          // Backend shape: { success, data: { user } }
          const loadedUser = res?.data?.user || res?.user;
          if (loadedUser) {
            dispatch(loginSuccess(loadedUser));
          } else {
            throw new Error('Invalid auth response');
          }
        } catch (err) {
          dispatch(loginFailure(err.message));
          authService.logout(); // Clear invalid token
        }
      }
    };
    loadUser();
  }, [dispatch]);

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const loginRes = await authService.login(email, password);
      // User data is already in the login response
      dispatch(loginSuccess(loginRes.data.user));
      return loginRes.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    dispatch(loginStart());
    try {
      const registerRes = await authService.register(userData);
      // User data is already in the register response
      dispatch(loginSuccess(registerRes.data.user));
      return registerRes.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      dispatch(loginFailure(message));
      throw new Error(message);
    }
  };

  const logout = () => {
    authService.logout();
    dispatch(logoutAction());
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
