import React, { useState, useEffect } from 'react';
import reporteService from '../../services/reporteService';
import { getAll as getEmpleados } from '../../services/empleadoService';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import { FileText, Download, Search } from 'lucide-react';
import { getTodayLocalDate, getOneMonthAgoLocalDate } from '../../utils/helpers';

function AsistenciaEmpleadosReporte() {
  const [modo, setModo] = useState('general');
  const [empleados, setEmpleados] = useState([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [fechaDesde, setFechaDesde] = useState(getOneMonthAgoLocalDate());
  const [fechaHasta, setFechaHasta] = useState(getTodayLocalDate());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmpleados({ limit: 100 }).then(res => {
      const list = res?.rows || res?.data?.rows || res || [];
      setEmpleados(Array.isArray(list) ? list : []);
    }).catch(() => {});
  }, []);

  const handleGenerar = async () => {
    setError('');
    setData(null);
    setLoading(true);

    try {
      const params = { tipo: modo, fechaDesde: fechaDesde || undefined, fechaHasta: fechaHasta || undefined };
      if (modo === 'empleado') params.idEmpleado = idEmpleado;

      const result = await reporteService.getAsistenciaEmpleados(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDF = () => {
    const params = { tipo: modo, fechaDesde: fechaDesde || undefined, fechaHasta: fechaHasta || undefined };
    if (modo === 'empleado') params.idEmpleado = idEmpleado;
    reporteService.descargarPDFAsistenciaEmpleados(params);
  };

  const renderPreview = () => {
    if (!data) return null;

    if (modo === 'empleado') {
      const asistencias = data.asistencias || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {data.empleado?.apellido}, {data.empleado?.nombre}
              </h3>
              <p className="text-sm text-gray-500">
                {data.empleado?.tipo} · {data.total} clases · {data.presentes} presentes · {data.porcentaje}% asistencia
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
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Rol</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Estado Clase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {asistencias.map((a, idx) => (
                  <tr key={a.id_clase + '-' + idx} className="hover:bg-gray-50">
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
                    <td className="px-3 py-2 text-center">{a.rol || '—'}</td>
                    <td className="px-3 py-2 text-center capitalize">{a.estado_clase || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    const empleadosList = Array.isArray(data) ? data : [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Resumen General</h3>
            <p className="text-sm text-gray-500">{empleadosList.length} empleados</p>
          </div>
          <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-1" /> PDF
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Empleado</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Tipo</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Clases</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Presentes</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Ausentes</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">% Asistencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empleadosList.map(e => (
                <tr key={e.id_empleado} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{e.apellido}, {e.nombre}</td>
                  <td className="px-3 py-2 text-center capitalize">{e.tipo}</td>
                  <td className="px-3 py-2 text-center">{e.total_clases}</td>
                  <td className="px-3 py-2 text-center">{e.total_presentes}</td>
                  <td className="px-3 py-2 text-center">{e.total_ausentes}</td>
                  <td className={`px-3 py-2 text-center font-bold ${
                    e.porcentaje >= 75 ? 'text-green-600' : e.porcentaje >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>{e.porcentaje}%</td>
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
        <h2 className="text-xl font-semibold text-gray-900">Reporte de Asistencia de Empleados</h2>
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
              <option value="general">General</option>
              <option value="empleado">Por empleado</option>
            </select>
          </div>

          {modo === 'empleado' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
              <select
                value={idEmpleado}
                onChange={e => setIdEmpleado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
              >
                <option value="">Seleccionar empleado</option>
                {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.apellido}, {e.nombre} ({e.tipo})</option>)}
              </select>
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

        <div className="flex items-center gap-2">
          <Button onClick={handleGenerar} disabled={loading || (modo === 'empleado' && !idEmpleado)}>
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

export default AsistenciaEmpleadosReporte;
