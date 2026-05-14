import React from 'react';
import * as authService from '../services/authService';
import { AuthContext } from './authContextValue';

export const ROLES = {
  ADMIN: 'admin',
  RECEPCIONISTA: 'recepcionista',
  PROFESOR: 'profesor',
};

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => authService.isAuthenticated());
  const [loading, setLoading] = React.useState(false);

  const login = async (usuario, contrasenia) => {
    setLoading(true);
    try {
      const data = await authService.login(usuario, contrasenia);
      const usuarioData = data.empleado || data.usuario || data;
      setUser(usuarioData);
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

  const hasRole = (role) => {
    return user?.tipo === role;
  };

  const value = {
    user,
    userRole: user?.tipo || null,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    isAdmin: () => user?.tipo === ROLES.ADMIN,
    isRecepcionista: () => user?.tipo === ROLES.RECEPCIONISTA,
    isProfesor: () => user?.tipo === ROLES.PROFESOR,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

