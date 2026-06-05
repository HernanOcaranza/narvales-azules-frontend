import React from 'react';
import { X, Search } from 'lucide-react';
import { Button, Input, Select } from '../../components/ui';
import * as categoriaService from '../../services/categoriaService';
import * as condicionService from '../../services/condicionService';

export default function FiltrosAlumnos({ estadosSeleccionados = [], onEstadosChange, orden = 'asc', onOrdenChange, filtrosAdicionales = {}, onFiltrosChange = () => {} }) {
  const [categorias, setCategorias] = React.useState([]);
  const [condiciones, setCondiciones] = React.useState([]);

  React.useEffect(() => {
    Promise.all([categoriaService.getAll({ limit: 100 }), condicionService.getAll({ limit: 100 })]).then(([c, co]) => {
      const categoriasData = c?.data?.data || c?.data || c || [];
      const condicionesData = co?.data?.data || co?.data || co || [];
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
      setCondiciones(Array.isArray(condicionesData) ? condicionesData : []);
    });
  }, []);

  const handleChange = (field, value) => {
    onFiltrosChange({ ...filtrosAdicionales, [field]: value || null });
  };

  const handleClear = () => {
    onFiltrosChange({ tutor: null, idCategoria: null, idCondicion: null, estado: '', certificado: '' });
    onEstadosChange([]);
    onOrdenChange('asc');
  };

  const estadosOpciones = [
    { value: 'activa', label: 'Activa' },
    { value: 'por_vencer', label: 'Por Vencer' },
    { value: 'vencida', label: 'Vencida' },
    { value: 'sin_membresia', label: 'Sin Membresía' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Select label="Estado" value={filtrosAdicionales.estado || ''} onChange={(e) => handleChange('estado', e.target.value)}>
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
        <Select label="Certificado" value={filtrosAdicionales.certificado || ''} onChange={(e) => handleChange('certificado', e.target.value)}>
          <option value="">Todos</option>
          <option value="1">Sí</option>
          <option value="0">No</option>
        </Select>
        <Select label="Orden Estado" value={orden} onChange={(e) => onOrdenChange(e.target.value)}>
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {estadosOpciones.map(estado => (
          <button
            key={estado.value}
            onClick={() => {
              const newEstados = estadosSeleccionados.includes(estado.value)
                ? estadosSeleccionados.filter(e => e !== estado.value)
                : [...estadosSeleccionados, estado.value];
              onEstadosChange(newEstados);
            }}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              estadosSeleccionados.includes(estado.value)
                ? 'bg-primary-main text-white'
                : 'bg-gray-100 text-text-primary hover:bg-gray-200'
            }`}
          >
            {estado.label}
          </button>
        ))}
        <button onClick={handleClear} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-text-secondary hover:bg-gray-200 flex items-center gap-1">
          <X className="w-3 h-3" /> Limpiar
        </button>
      </div>
    </div>
  );
}