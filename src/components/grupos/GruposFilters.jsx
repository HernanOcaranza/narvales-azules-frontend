import React from 'react';
import { X } from 'lucide-react';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';
import { Select } from '../../components/ui';

export default function GruposFilters({ filters = {}, onFilterChange = () => {}, onClearFilters = () => {} }) {
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);

  React.useEffect(() => {
    Promise.all([disciplinaService.getAll({ limit: 100 }), categoriaService.getAll({ limit: 100 })]).then(([d, c]) => {
      const disciplinasData = d?.data?.data || d?.data || d || [];
      const categoriasData = c?.data?.data || c?.data || c || [];
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    });
  }, []);

  const handleChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </Select>
      </div>
      <button onClick={onClearFilters} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 flex items-center gap-1 w-fit">
        <X className="w-3 h-3" /> Limpiar
      </button>
    </div>
  );
}