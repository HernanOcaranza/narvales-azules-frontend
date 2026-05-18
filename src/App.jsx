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
import Empleados from './pages/Empleados/Empleados';
import Categorias from './pages/Configuracion/Categorias';
import Disciplinas from './pages/Configuracion/Disciplinas';
import Condiciones from './pages/Configuracion/Condiciones';
import TipoMembresias from './pages/Configuracion/TipoMembresias';
import PrecioMembresias from './pages/Configuracion/PrecioMembresias';
import { ROUTES } from './utils/constants';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D7CAD',
      light: '#3AA8D0',
      dark: '#085A7D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#8DCDE5',
      light: '#B8E4F5',
      dark: '#5BA8C9',
      contrastText: '#0D3244',
    },
    background: {
      default: '#DCEFF7',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#0D3244',
      secondary: '#4A7A8C',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
    },
    divider: 'rgba(13, 50, 68, 0.12)',
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
      color: '#0D3244',
    },
    h2: {
      fontWeight: 600,
      color: '#0D3244',
    },
    h3: {
      fontWeight: 600,
      color: '#0D3244',
    },
    h4: {
      fontWeight: 600,
      color: '#0D3244',
    },
    h5: {
      fontWeight: 600,
      color: '#0D3244',
    },
    h6: {
      fontWeight: 600,
      color: '#0D3244',
    },
    body1: {
      color: '#0D3244',
    },
    body2: {
      color: '#4A7A8C',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(13, 124, 173, 0.25)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(13, 124, 173, 0.35)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(13, 50, 68, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(13, 50, 68, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3AA8D0',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0D7CAD',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#0D7CAD',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            letterSpacing: '0.02em',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(13, 124, 173, 0.04)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(13, 50, 68, 0.9)',
          borderRadius: 6,
          fontSize: '0.75rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(13, 124, 173, 0.08)',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
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
                      <Route path={ROUTES.EMPLEADOS} element={<Empleados />} />
                      <Route path={ROUTES.CONFIGURACION_CATEGORIAS} element={<Categorias />} />
                      <Route path={ROUTES.CONFIGURACION_DISCIPLINAS} element={<Disciplinas />} />
                      <Route path={ROUTES.CONFIGURACION_CONDICIONES} element={<Condiciones />} />
                      <Route path={ROUTES.CONFIGURACION_TIPO_MEMBRESIAS} element={<TipoMembresias />} />
                      <Route path={ROUTES.CONFIGURACION_PRECIO_MEMBRESIAS} element={<PrecioMembresias />} />
                      <Route path="*" element={<Navigate to={ROUTES.ALUMNOS} replace />} />
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
