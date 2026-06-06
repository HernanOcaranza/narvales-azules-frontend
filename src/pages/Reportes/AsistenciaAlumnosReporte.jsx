import React, { useState, useEffect, useRef } from 'react';
import reporteService from '../../services/reporteService';
import { getAll as getGrupos } from '../../services/grupoService';
import { getAll as getAlumnos } from '../../services/alumnoService';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import { FileText, Download, Search, User } from 'lucide-react';
import { getTodayLocalDate, getOneMonthAgoLocalDate } from '../../utils/helpers';

const MODOS = [
  { value: 'grupo', label: 'Por grupo' },
  { value: 'alumno', label: 'Por alumno' },
  { value: 'general', label: 'General' },
];

function AsistenciaAlumnosReporte() {
  const [modo, setModo] = useState('grupo');
  const [grupos, setGrupos] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSearch, setAlumnoSearch] = useState('');
  const [alumnoDropdownOpen, setAlumnoDropdownOpen] = useState(false);
  const [idGrupo, setIdGrupo] = useState('');
  const [idAlumno, setIdAlumno] = useState('');
  const [alumnoNombre, setAlumnoNombre] = useState('');
  const [fechaDesde, setFechaDesde] = useState(getOneMonthAgoLocalDate());
  const [fechaHasta, setFechaHasta] = useState(getTodayLocalDate());
  const [soloActivas, setSoloActivas] = useState(true);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getGrupos({ limit: 200 }).then(res => {
      const list = res?.data || res?.rows || [];
      setGrupos(Array.isArray(list) ? list : []);
    }).catch(() => {});
  }, []);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (modo === 'alumno') {
      getAlumnos({ limit: 500 }).then(res => {
        const list = res?.data || res?.rows || [];
        setAlumnos(Array.isArray(list) ? list : []);
      }).catch(() => {});
    }
  }, [modo]);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAlumnoDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const alumnosFiltrados = alumnoSearch.trim()
    ? alumnos.filter(a =>
        `${a.nombre} ${a.apellido} ${a.dni || ''}`
          .toLowerCase()
          .includes(alumnoSearch.toLowerCase())
      ).slice(0, 20)
    : alumnos.slice(0, 20);

  const handleGenerar = async () => {
    setError('');
    setData(null);
    setLoading(true);

    try {
      const params = { tipo: modo, fechaDesde: fechaDesde || undefined, fechaHasta: fechaHasta || undefined, soloActivas };
      if (modo === 'grupo') params.idGrupo = idGrupo;
      if (modo === 'alumno') params.idAlumno = idAlumno;

      const result = await reporteService.getAsistenciaAlumnos(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDF = () => {
    const params = { tipo: modo, fechaDesde: fechaDesde || undefined, fechaHasta: fechaHasta || undefined, soloActivas };
    if (modo === 'grupo') params.idGrupo = idGrupo;
    if (modo === 'alumno') params.idAlumno = idAlumno;
    reporteService.descargarPDFAsistenciaAlumnos(params);
  };

  const renderPreview = () => {
    if (!data) return null;

    if (modo === 'grupo') {
      const alumnos = data.alumnos || [];
      const clases = data.clases || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Grupo: {data.grupo?.nombre}</h3>
              <p className="text-sm text-gray-500">{clases.length} clases · {alumnos.length} alumnos</p>
            </div>
            <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 sticky left-0 bg-gray-50">Alumno</th>
                  {clases.map(c => (
                    <th key={c.id_clase} className="px-2 py-2 text-center font-medium text-gray-600 whitespace-nowrap">
                      {new Date(c.fecha_clase).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' })}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-center font-medium text-gray-600">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumnos.map(alumno => (
                  <tr key={alumno.id_alumno} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium whitespace-nowrap sticky left-0 bg-white">{alumno.apellido}, {alumno.nombre}</td>
                    {alumno.asistencias.map((asi, idx) => (
                      <td key={idx} className="px-2 py-2 text-center">
                        {asi === null ? (
                          <span className="text-gray-300">—</span>
                        ) : asi.presente === 1 ? (
                          <span className="text-green-600 font-bold">✓</span>
                        ) : (
                          <span className="text-red-600 font-bold">✗</span>
                        )}
                      </td>
                    ))}
                    <td className={`px-2 py-2 text-center font-bold ${
                      alumno.porcentaje >= 75 ? 'text-green-600' : alumno.porcentaje >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {alumno.porcentaje}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (modo === 'alumno') {
      const asistencias = data.asistencias || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {data.alumno?.apellido}, {data.alumno?.nombre}
              </h3>
              <p className="text-sm text-gray-500">
                {data.total} clases · {data.presentes} presentes · {data.ausentes} ausentes · {data.porcentaje}% asistencia
              </p>
            </div>
            <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Fecha</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Grupo</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Presente</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Recuperación</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Observación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {asistencias.map(a => (
                  <tr key={a.id_asistencia} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {a.fecha_clase ? new Date(a.fecha_clase).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="px-3 py-2">{a.grupo_nombre || '—'}</td>
                    <td className="px-3 py-2 text-center">
                      {a.presente === 1 ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : a.presente === 0 ? (
                        <span className="text-red-600 font-bold">✗</span>
                      ) : '—'}
                    </td>
                    <td className="px-3 py-2 text-center">{a.es_recuperacion ? 'Sí' : 'No'}</td>
                    <td className="px-3 py-2 text-gray-500">{a.observacion || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    const grupos = Array.isArray(data) ? data : [];
    const totalAlumnos = grupos.reduce((s, g) => s + g.total_alumnos, 0);
    const totalClases = grupos.reduce((s, g) => s + g.total_clases, 0);
    const promedioGeneral = grupos.length > 0
      ? Math.round(grupos.reduce((s, g) => s + g.porcentaje, 0) / grupos.length)
      : 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resumen General</h3>
            <p className="text-sm text-gray-500">{grupos.length} grupos · {totalAlumnos} alumnos · {totalClases} clases · {promedioGeneral}% promedio</p>
          </div>
          <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-1" /> PDF
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Grupo</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Alumnos</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Clases</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Total Asist.</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Presentes</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">% Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grupos.map(g => (
                <tr key={g.id_grupo} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{g.grupo}</td>
                  <td className="px-3 py-2 text-center">{g.total_alumnos}</td>
                  <td className="px-3 py-2 text-center">{g.total_clases}</td>
                  <td className="px-3 py-2 text-center">{g.total_asistencias}</td>
                  <td className="px-3 py-2 text-center">{g.total_presentes}</td>
                  <td className={`px-3 py-2 text-center font-bold ${
                    g.porcentaje >= 75 ? 'text-green-600' : g.porcentaje >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{g.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Reporte de Asistencia de Alumnos</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modo</label>
            <select
              value={modo}
              onChange={e => setModo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
            >
              {MODOS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {modo === 'grupo' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <select
                value={idGrupo}
                onChange={e => setIdGrupo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
              >
                <option value="">Seleccionar grupo</option>
                {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
              </select>
            </div>
          )}

          {modo === 'alumno' && (
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alumno</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={alumnoSearch}
                  onChange={e => { setAlumnoSearch(e.target.value); setAlumnoDropdownOpen(true); }}
                  onFocus={() => setAlumnoDropdownOpen(true)}
                  placeholder="Buscar alumno por nombre..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
                />
              </div>
              {alumnoDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {alumnosFiltrados.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400">Sin resultados</div>
                  ) : alumnosFiltrados.map(a => (
                    <button
                      key={a.id_alumno}
                      type="button"
                      onClick={() => {
                        setIdAlumno(a.id_alumno);
                        setAlumnoNombre(`${a.apellido}, ${a.nombre}`);
                        setAlumnoSearch(`${a.apellido}, ${a.nombre}`);
                        setAlumnoDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-primary-main/5 transition-colors ${
                        idAlumno === a.id_alumno ? 'bg-primary-main/10 text-primary-main font-medium' : 'text-gray-700'
                      }`}
                    >
                      {a.apellido}, {a.nombre} {a.dni ? `(${a.dni})` : ''}
                    </button>
                  ))}
                </div>
              )}
              {alumnoNombre && (
                <p className="mt-1 text-xs text-green-600">Seleccionado: {alumnoNombre}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={e => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={e => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={soloActivas}
              onChange={e => setSoloActivas(e.target.checked)}
              className="rounded border-gray-300 text-primary-main focus:ring-primary-main"
            />
            Solo membresías activas
          </label>

          <Button onClick={handleGenerar} disabled={loading || (modo === 'grupo' && !idGrupo) || (modo === 'alumno' && !idAlumno)}>
            {loading ? <Spinner className="w-4 h-4 mr-1" /> : <Search className="w-4 h-4 mr-1" />}
            Generar reporte
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {data && renderPreview()}

      {!data && !loading && !error && (
        <div className="text-center py-12 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3" />
          <p>Selecciona los filtros y haz clic en "Generar reporte"</p>
        </div>
      )}
    </div>
  );
}

export default AsistenciaAlumnosReporte;
