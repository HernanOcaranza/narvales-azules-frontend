import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

import { ROUTES } from './utils/constants';

function App() {
  return (
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
                    <Route path="*" element={<Navigate to={ROUTES.ALUMNOS} replace />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;