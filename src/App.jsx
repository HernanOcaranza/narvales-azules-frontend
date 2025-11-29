import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Alumnos from './pages/Alumnos/Alumnos';
import Membresias from './pages/Membresias/Membresias';
import Pagos from './pages/Pagos/Pagos';
import Clases from './pages/Clases/Clases';
import Grupos from './pages/Grupos/Grupos';
import NuevoGrupo from './pages/Grupos/NuevoGrupo';
import Empleados from './pages/Empleados/Empleados';
import Categorias from './pages/Configuracion/Categorias';
import Disciplinas from './pages/Configuracion/Disciplinas';
import Condiciones from './pages/Configuracion/Condiciones';
import { ROUTES } from './utils/constants';
import './App.css';

// Tema mobile-first
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Routes>
                      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                      <Route path={ROUTES.ALUMNOS} element={<Alumnos />} />
                      <Route path={ROUTES.MEMBRESIAS} element={<Membresias />} />
                      <Route path={ROUTES.PAGOS} element={<Pagos />} />
                      <Route path={ROUTES.CLASES} element={<Clases />} />
                      <Route path={ROUTES.GRUPOS} element={<Grupos />} />
                      <Route path={ROUTES.GRUPOS_NUEVO} element={<NuevoGrupo />} />
                      <Route path={ROUTES.EMPLEADOS} element={<Empleados />} />
                      <Route path={ROUTES.CONFIGURACION_CATEGORIAS} element={<Categorias />} />
                      <Route path={ROUTES.CONFIGURACION_DISCIPLINAS} element={<Disciplinas />} />
                      <Route path={ROUTES.CONFIGURACION_CONDICIONES} element={<Condiciones />} />
                      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                    </Routes>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
