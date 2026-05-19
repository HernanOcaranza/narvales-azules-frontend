import React from 'react';
import { X } from 'lucide-react';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import * as disciplinaService from '../../services/disciplinaService';
import * as grupoService from '../../services/grupoService';
import { Select } from '../../components/ui';

export default function MembresiasFilters({ filters = {}, onFilterChange = () => {}, onClearFilters = () => {} }) {
  const [tipos, setTipos] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);

  React.useEffect(() => {
    Promise.all([tipoMembresiasService.getAll({ limit: 100 }), disciplinaService.getAll({ limit: 100 }), grupoService.getAll({ limit: 100 })]).then(([t, d, g]) => {
      const tiposData = t?.data?.data || t?.data || t || [];
      const disciplinasData = d?.data?.data || d?.data || d || [];
      const gruposData = g?.data?.data || g?.data || g || [];
      setTipos(Array.isArray(tiposData) ? tiposData : []);
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
      setGrupos(Array.isArray(gruposData) ? gruposData : []);
    });
  }, []);

  const handleChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Select label="Estado" value={filters.estado || ''} onChange={(e) => handleChange('estado', e.target.value)}>
          <option value="">Todos</option>
          <option value="activa">Activa</option>
          <option value="vencida">Vencida</option>
          <option value="pendiente">Pendiente</option>
        </Select>
        <Select label="Tipo" value={filters.idTipoMembrecia || ''} onChange={(e) => handleChange('idTipoMembrecia', e.target.value)}>
          <option value="">Todos</option>
          {tipos.map(t => <option key={t.id_tipo_membrecia} value={t.id_tipo_membrecia}>{t.tipo_membrecia}</option>)}
        </Select>
        <Select label="Disciplina" value={filters.idDisciplina || ''} onChange={(e) => handleChange('idDisciplina', e.target.value)}>
          <option value="">Todas</option>
          {disciplinas.map(d => <option key={d.id_disciplina} value={d.id_disciplina}>{d.disciplina}</option>)}
        </Select>
        <Select label="Grupo" value={filters.idGrupo || ''} onChange={(e) => handleChange('idGrupo', e.target.value)}>
          <option value="">Todos</option>
          {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
        </Select>
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