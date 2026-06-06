import React from 'react';
import { X } from 'lucide-react';
import * as empleadoService from '../../services/empleadoService';

export default function PagosFilters({ filters = {}, onFilterChange = () => {}, onClearFilters = () => {} }) {
  const [empleados, setEmpleados] = React.useState([]);

  React.useEffect(() => {
    empleadoService.getAll().then(d => {
      const data = d?.data || d || [];
      setEmpleados(Array.isArray(data) ? data : []);
    });
  }, []);

  const handleChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  const handleProfesorChange = (value) => {
    if (value) {
      onFilterChange({ ...filters, idEmpleado: parseInt(value), sinEmpleado: false });
    } else {
      onFilterChange({ ...filters, idEmpleado: null });
    }
  };

  const handleGeneralesChange = (checked) => {
    if (checked) {
      onFilterChange({ ...filters, sinEmpleado: true, idEmpleado: null });
    } else {
      onFilterChange({ ...filters, sinEmpleado: false });
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          value={filters.idEmpleado || ''}
          onChange={(e) => handleProfesorChange(e.target.value)}
          disabled={filters.sinEmpleado}
        >
          <option value="">Profesor - Todos</option>
          {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.nombre} {e.apellido}</option>)}
        </select>
        <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 ${filters.idEmpleado ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="checkbox"
            checked={!!filters.sinEmpleado}
            onChange={(e) => handleGeneralesChange(e.target.checked)}
            disabled={!!filters.idEmpleado}
            className="w-4 h-4"
          />
          <span className="text-sm">Solo gastos generales</span>
        </label>
        <select
          className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
          value={filters.estado || ''}
          onChange={(e) => handleChange('estado', e.target.value)}
        >
          <option value="">Estado - Todos</option>
          <option value="completado">Completado</option>
          <option value="pendiente">Pendiente</option>
          <option value="parcial">Parcial</option>
        </select>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Desde</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
            value={filters.fechaDesde || ''}
            onChange={(e) => handleChange('fechaDesde', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-secondary">Hasta</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
            value={filters.fechaHasta || ''}
            onChange={(e) => handleChange('fechaHasta', e.target.value)}
          />
        </div>
      </div>
      <button onClick={onClearFilters} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 flex items-center gap-1 w-fit">
        <X className="w-3 h-3" /> Limpiar
      </button>
    </div>
  );
}