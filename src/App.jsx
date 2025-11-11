import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Alumnos from './pages/Alumnos/Alumnos';
import Membresias from './pages/Membresias/Membresias';
import Pagos from './pages/Pagos/Pagos';
import Clases from './pages/Clases/Clases';
import { ROUTES } from './utils/constants';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={esES}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ALUMNOS} element={<Alumnos />} />
            <Route path={ROUTES.MEMBRESIAS} element={<Membresias />} />
            <Route path={ROUTES.PAGOS} element={<Pagos />} />
            <Route path={ROUTES.CLASES} element={<Clases />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
