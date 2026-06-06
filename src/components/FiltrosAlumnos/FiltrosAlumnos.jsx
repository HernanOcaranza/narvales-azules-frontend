import React from 'react';
import { X, Search } from 'lucide-react';
import { Button, Input, Select } from '../../components/ui';
import * as categoriaService from '../../services/categoriaService';
import * as condicionService from '../../services/condicionService';
import * as grupoService from '../../services/grupoService';

export default function FiltrosAlumnos({ estadosSeleccionados = [], onEstadosChange, filtrosAdicionales = {}, onFiltrosChange = () => {} }) {
  const [categorias, setCategorias] = React.useState([]);
  const [condiciones, setCondiciones] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);

  React.useEffect(() => {
    Promise.all([categoriaService.getAll({ limit: 100 }), condicionService.getAll({ limit: 100 }), grupoService.getAll({ limit: 100 })]).then(([c, co, g]) => {
      const categoriasData = c?.data?.data || c?.data || c || [];
      const condicionesData = co?.data?.data || co?.data || co || [];
      const gruposData = g?.data?.data || g?.data || g || [];
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setCondiciones(Array.isArray(condicionesData) ? condicionesData : []);
      setGrupos(Array.isArray(gruposData) ? gruposData : []);
    });
  }, []);

  const handleChange = (field, value) => {
    onFiltrosChange({ ...filtrosAdicionales, [field]: value || null });
  };

  const handleClear = () => {
    onFiltrosChange({ tutor: null, idCategoria: null, idCondicion: null, idGrupo: null, estado: '1', certificado: '' });
    onEstadosChange([]);
  };

  const estadosOpciones = [
    { value: 'activa', label: 'Activa' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'suspendida', label: 'Suspendida' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'sin_membresia', label: 'Sin Membresía' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <Select label="Estado" value={filtrosAdicionales.estado || '1'} onChange={(e) => handleChange('estado', e.target.value)}>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </Select>
        <Select label="Estado Membresía" value={estadosSeleccionados.length === 1 ? estadosSeleccionados[0] : ''} onChange={(e) => onEstadosChange(e.target.value ? [e.target.value] : [])}>
          <option value="">Todos</option>
          {estadosOpciones.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
        </Select>
        <Select label="Categoría" value={filtrosAdicionales.idCategoria || ''} onChange={(e) => handleChange('idCategoria', e.target.value)}>
          <option value="">Todas</option>
          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.categoria}</option>)}
        </Select>
        <Select label="Condición" value={filtrosAdicionales.idCondicion || ''} onChange={(e) => handleChange('idCondicion', e.target.value)}>
          <option value="">Todas</option>
          {condiciones.map(c => <option key={c.id_condicion} value={c.id_condicion}>{c.condicion}</option>)}
        </Select>
        <Select label="Grupo" value={filtrosAdicionales.idGrupo || ''} onChange={(e) => handleChange('idGrupo', e.target.value)}>
          <option value="">Todos</option>
          {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
        </Select>
        <Select label="Certificado" value={filtrosAdicionales.certificado || ''} onChange={(e) => handleChange('certificado', e.target.value)}>
          <option value="">Todos</option>
          <option value="1">Sí</option>
          <option value="0">No</option>
        </Select>
      </div>
      <button onClick={handleClear} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 flex items-center gap-1">
        <X className="w-3 h-3" /> Limpiar
      </button>
    </div>
  );
}