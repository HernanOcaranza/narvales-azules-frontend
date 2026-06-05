import React from 'react';
import { X } from 'lucide-react';
import * as grupoService from '../../services/grupoService';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';
import { Select } from '../../components/ui';

export default function ClasesFilters({ filters = {}, onFilterChange = () => {}, onClearFilters = () => {} }) {
  const [grupos, setGrupos] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);

  React.useEffect(() => {
    Promise.all([grupoService.getAll({ limit: 100 }), disciplinaService.getAll(), categoriaService.getAll()]).then(([g, d, c]) => {
      const gruposData = g?.data?.data || g?.data || g || [];
      const disciplinasData = d?.data?.data || d?.data || d || [];
      const categoriasData = c?.data?.data || c?.data || c || [];
      setGrupos(Array.isArray(gruposData) ? gruposData : []);
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    });
  }, []);

  const handleChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Select label="Grupo" value={filters.idGrupo || ''} onChange={(e) => handleChange('idGrupo', e.target.value)}>
          <option value="">Todos</option>
          {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
        </Select>
        <Select label="Disciplina" value={filters.idDisciplina || ''} onChange={(e) => handleChange('idDisciplina', e.target.value)}>
          <option value="">Todas</option>
          {disciplinas.map(d => <option key={d.id_disciplina} value={d.id_disciplina}>{d.disciplina}</option>)}
        </Select>
        <Select label="Categoría" value={filters.idCategoria || ''} onChange={(e) => handleChange('idCategoria', e.target.value)}>
          <option value="">Todas</option>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.categoria}</option>)}
        </Select>
        <Select label="Estado" value={filters.estado || ''} onChange={(e) => handleChange('estado', e.target.value)}>
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="realizada">Realizada</option>
          <option value="suspendida">Suspendida</option>
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