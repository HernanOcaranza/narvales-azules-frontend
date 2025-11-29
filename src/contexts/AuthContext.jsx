import React from 'react';
import * as authService from '../services/authService';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => authService.isAuthenticated());
  const [loading, setLoading] = React.useState(false);

  const login = async (usuario, contrasenia) => {
    setLoading(true);
    try {
      const data = await authService.login(usuario, contrasenia);
      setUser(data.usuario || data);
      setIsAuthenticated(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

