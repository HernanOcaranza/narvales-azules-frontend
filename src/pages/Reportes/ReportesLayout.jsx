import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const tabs = [
  { path: ROUTES.REPORTES_ASISTENCIA_ALUMNOS, label: 'Asistencia Alumnos' },
  { path: ROUTES.REPORTES_ASISTENCIA_EMPLEADOS, label: 'Asistencia Empleados' },
  { path: ROUTES.REPORTES_MEMBRESIAS, label: 'Membresías' },
];

function ReportesLayout() {
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary-main text-primary-main'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}

export default ReportesLayout;
