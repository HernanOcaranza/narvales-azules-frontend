import React from 'react';
import { X, Search } from 'lucide-react';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import * as disciplinaService from '../../services/disciplinaService';
import * as grupoService from '../../services/grupoService';
import * as alumnoService from '../../services/alumnoService';
import { Select } from '../../components/ui';

export default function MembresiasFilters({ filters = {}, onFilterChange = () => {}, onClearFilters = () => {} }) {
  const [tipos, setTipos] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [searching, setSearching] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchRef = React.useRef(null);
  const debounceRef = React.useRef(null);

  const selectedAlumno = filters.idAlumno && searchResults.length > 0
    ? searchResults.find(a => a.id_alumno === parseInt(filters.idAlumno))
    : null;

  React.useEffect(() => {
    Promise.all([
      tipoMembresiasService.getAll({ limit: 100 }),
      disciplinaService.getAll({ limit: 100 }),
      grupoService.getAll({ limit: 100 }),
    ]).then(([t, d, g]) => {
      const tiposData = t?.data?.data || t?.data || t || [];
      const disciplinasData = d?.data?.data || d?.data || d || [];
      const gruposData = g?.data?.data || g?.data || g || [];
      setTipos(Array.isArray(tiposData) ? tiposData : []);
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
      setGrupos(Array.isArray(gruposData) ? gruposData : []);
    });
  }, []);

  React.useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await alumnoService.searchByNombre(value.trim());
        const data = res?.data || res || [];
        setSearchResults(Array.isArray(data) ? data : []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectAlumno = (alumno) => {
    setSearchText(`${alumno.apellido}, ${alumno.nombre}`);
    setShowDropdown(false);
    onFilterChange({ ...filters, idAlumno: alumno.id_alumno });
  };

  const handleClearAlumno = () => {
    setSearchText('');
    setSearchResults([]);
    onFilterChange({ ...filters, idAlumno: null });
  };

  const handleChange = (field, value) => onFilterChange({ ...filters, [field]: value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        <div className="md:col-span-2 relative" ref={searchRef}>
          <label className="block text-sm font-medium text-text-primary mb-1">Alumno</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder={filters.idAlumno && !searchText ? '' : 'Buscar alumno...'}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
              className="w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
            />
            {searchText && (
              <button onClick={() => { setSearchText(''); setSearchResults([]); setShowDropdown(false); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {filters.idAlumno && !searchText && (
            <div className="mt-1 flex items-center gap-1 text-sm text-primary-main font-medium">
              <span>Filtrando por: </span>
              <span className="bg-primary-light/20 px-2 py-0.5 rounded-full">{selectedAlumno ? `${selectedAlumno.apellido}, ${selectedAlumno.nombre}` : `ID #${filters.idAlumno}`}</span>
              <button onClick={handleClearAlumno} className="hover:bg-gray-100 rounded p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map(a => (
                <button
                  key={a.id_alumno}
                  onClick={() => handleSelectAlumno(a)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${parseInt(filters.idAlumno) === a.id_alumno ? 'bg-primary-light/10 font-medium' : ''}`}
                >
                  {a.apellido}, {a.nombre} {a.dni ? `- DNI: ${a.dni}` : ''}
                </button>
              ))}
            </div>
          )}
          {showDropdown && searching && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-text-secondary">
              Buscando...
            </div>
          )}
          {showDropdown && !searching && searchText && searchResults.length === 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-text-secondary">
              No se encontraron alumnos
            </div>
          )}
        </div>
        <Select label="Estado" value={filters.estado || ''} onChange={(e) => handleChange('estado', e.target.value)}>
          <option value="">Todos</option>
          <option value="activa">Activa</option>
          <option value="vencida">Vencida</option>
          <option value="suspendida">Suspendida</option>
          <option value="cancelada">Cancelada</option>
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