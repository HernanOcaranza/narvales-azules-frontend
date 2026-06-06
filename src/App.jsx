import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import RecuperarClave from './pages/Auth/RecuperarClave';
import CambiarClave from './pages/Auth/CambiarClave';
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
import ReportesLayout from './pages/Reportes/ReportesLayout';
import AsistenciaAlumnosReporte from './pages/Reportes/AsistenciaAlumnosReporte';
import AsistenciaEmpleadosReporte from './pages/Reportes/AsistenciaEmpleadosReporte';
import MembresiasReporte from './pages/Reportes/MembresiasReporte';
import ReporteFinanciero from './pages/Reportes/ReporteFinanciero';

import { ROUTES } from './utils/constants';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.OLVIDE_CLAVE} element={<RecuperarClave />} />
          <Route path={ROUTES.CAMBIAR_CLAVE} element={<CambiarClave />} />
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
                    <Route path={ROUTES.CAMBIAR_CONTRASENIA} element={<CambiarClave />} />
                    <Route path={ROUTES.CONFIGURACION_CATEGORIAS} element={<Categorias />} />
                    <Route path={ROUTES.CONFIGURACION_DISCIPLINAS} element={<Disciplinas />} />
                    <Route path={ROUTES.CONFIGURACION_CONDICIONES} element={<Condiciones />} />
                    <Route path={ROUTES.CONFIGURACION_TIPO_MEMBRESIAS} element={<TipoMembresias />} />
                    <Route path={ROUTES.REPORTES} element={<ReportesLayout />}>
                      <Route index element={<Navigate to={ROUTES.REPORTES_ASISTENCIA_ALUMNOS} replace />} />
                      <Route path="asistencia-alumnos" element={<AsistenciaAlumnosReporte />} />
                      <Route path="asistencia-empleados" element={<AsistenciaEmpleadosReporte />} />
                      <Route path="membresias" element={<MembresiasReporte />} />
                      <Route path="financiero" element={<ReporteFinanciero />} />
                    </Route>
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