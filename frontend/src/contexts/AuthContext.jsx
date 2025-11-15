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
      
      // Always dispatch loginStart to set loading state
      dispatch(loginStart());
      
      if (token) {
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
          console.error('Auth check failed:', err);
          dispatch(loginFailure(err.message));
          authService.logout(); // Clear invalid token
        }
      } else {
        // No token found - finish loading
        dispatch(loginFailure('No token found'));
      }
    };
    loadUser();
  }, [dispatch]);

  const login = async (email, password, role) => {
    dispatch(loginStart());
    try {
      const loginRes = await authService.login(email, password, role);
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
