import React from 'react';
import { X } from 'lucide-react';

export default function PagosFilters({ filters = {}, onFilterChange = () => {}, onClearFilters = () => {} }) {
  const handleChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
          value={filters.tipo || ''}
          onChange={(e) => handleChange('tipo', e.target.value)}
        >
          <option value="">Tipo - Todos</option>
          <option value="mensual">Mensual</option>
          <option value="matricula">Matrícula</option>
        </select>
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