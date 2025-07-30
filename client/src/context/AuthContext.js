import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
  });

  useEffect(() => {
    const loadUserOnMount = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('http://localhost:5001/api/auth');
          setAuthState({
            token: token,
            isAuthenticated: true,
            loading: false,
            user: res.data
          });
        } catch (err) {
          localStorage.removeItem('token');
          setAuthState({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
          });
        }
      } else {
        setAuthState({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
        });
      }
    };
    
    loadUserOnMount();
  }, []);

  const login = async (token) => {
    setAuthToken(token);
    try {
        const res = await axios.get('http://localhost:5001/api/auth');
        localStorage.setItem('token', token);
        setAuthState({
            token: token,
            isAuthenticated: true,
            loading: false,
            user: res.data
        });
    } catch (err) {
        localStorage.removeItem('token');
        setAuthState({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null
        });
    }
  };

  const logout = () => {
      localStorage.removeItem('token');
      setAuthState({ token: null, isAuthenticated: false, loading: false, user: null });
      setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};