import React, { useState, useEffect } from 'react';
import reporteService from '../../services/reporteService';
import { getAll as getGrupos } from '../../services/grupoService';
import { getAll as getTipoMembresias } from '../../services/tipoMembresiasService';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import { FileText, Download, Search, DollarSign, Clock, List } from 'lucide-react';
import { getTodayLocalDate, getOneMonthAgoLocalDate } from '../../utils/helpers';

const TABS = [
  { key: 'listado', label: 'Listado General', icon: List },
  { key: 'proximas-a-vencer', label: 'Próximas a Vencer', icon: Clock },
  { key: 'ingresos', label: 'Ingresos', icon: DollarSign },
];

function MembresiasReporte() {
  const [tab, setTab] = useState('listado');
  const [grupos, setGrupos] = useState([]);
  const [tiposMembresia, setTiposMembresia] = useState([]);
  const [estado, setEstado] = useState('');
  const [idTipoMembrecia, setIdTipoMembrecia] = useState('');
  const [idGrupo, setIdGrupo] = useState('');
  const [fechaDesde, setFechaDesde] = useState(getOneMonthAgoLocalDate());
  const [fechaHasta, setFechaHasta] = useState(getTodayLocalDate());
  const [dias, setDias] = useState(30);
  const [agrupar, setAgrupar] = useState('mensual');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getGrupos({ limit: 200 }).then(res => {
      const list = res?.data || res?.rows || [];
      setGrupos(Array.isArray(list) ? list : []);
    }).catch(() => {});
    getTipoMembresias({ limit: 100 }).then(res => {
      const list = res?.rows || res?.data?.rows || res || [];
      setTiposMembresia(Array.isArray(list) ? list : []);
    }).catch(() => {});
  }, []);

  const handleGenerar = async () => {
    setError('');
    setData(null);
    setLoading(true);

    try {
      const params = { tipo: tab };

      if (tab === 'listado') {
        if (estado) params.estado = estado;
        if (idTipoMembrecia) params.idTipoMembrecia = idTipoMembrecia;
        if (idGrupo) params.idGrupo = idGrupo;
        if (fechaDesde) { params.fechaDesde = fechaDesde; params.fechaHasta = fechaHasta; }
      } else if (tab === 'proximas-a-vencer') {
        params.dias = dias;
      } else if (tab === 'ingresos') {
        if (fechaDesde) { params.fechaDesde = fechaDesde; params.fechaHasta = fechaHasta; }
        params.agrupar = agrupar;
      }

      const result = await reporteService.getMembresias(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDF = () => {
    const params = { tipo: tab };
    if (tab === 'listado') {
      if (estado) params.estado = estado;
      if (idTipoMembrecia) params.idTipoMembrecia = idTipoMembrecia;
      if (idGrupo) params.idGrupo = idGrupo;
      if (fechaDesde) { params.fechaDesde = fechaDesde; params.fechaHasta = fechaHasta; }
    } else if (tab === 'proximas-a-vencer') {
      params.dias = dias;
    } else if (tab === 'ingresos') {
      if (fechaDesde) { params.fechaDesde = fechaDesde; params.fechaHasta = fechaHasta; }
      params.agrupar = agrupar;
    }
    reporteService.descargarPDFMembresias(params);
  };

  const renderPreview = () => {
    if (!data) return null;

    const list = Array.isArray(data) ? data : [];

    if (tab === 'listado') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{list.length} membresías encontradas</p>
            <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Alumno</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Tipo</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Inicio</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Fin</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Estado</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Grupo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map(m => (
                  <tr key={m.id_membrecia} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">{m.alumno_apellido}, {m.alumno_nombre}</td>
                    <td className="px-3 py-2 text-center">{m.tipo_membrecia}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {m.fecha_inicio ? new Date(m.fecha_inicio).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {m.fecha_fin ? new Date(m.fecha_fin).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        m.estado === 'activa' ? 'bg-green-100 text-green-800' :
                        m.estado === 'vencida' ? 'bg-red-100 text-red-800' :
                        m.estado === 'suspendida' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>{m.estado}</span>
                    </td>
                    <td className="px-3 py-2 text-center">{m.grupo_nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tab === 'proximas-a-vencer') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{list.length} membresías próximas a vencer</p>
            <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Alumno</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Tipo</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Vencimiento</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Días Rest.</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Grupo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map(m => (
                  <tr key={m.id_membrecia} className="hover:bg-gray-50">
                    <td className="px-3 py-2">{m.alumno_apellido}, {m.alumno_nombre}</td>
                    <td className="px-3 py-2 text-center">{m.tipo_membrecia}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {m.fecha_fin ? new Date(m.fecha_fin).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className={`px-3 py-2 text-center font-bold ${
                      m.dias_restantes <= 7 ? 'text-red-600' : 'text-yellow-600'
                    }`}>{m.dias_restantes} días</td>
                    <td className="px-3 py-2 text-center">{m.grupo_nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (tab === 'ingresos') {
      const totalesPorPeriodo = list.reduce((acc, item) => {
        if (!acc[item.periodo]) acc[item.periodo] = { periodo: item.periodo, total: 0, total_membresias: 0 };
        acc[item.periodo].total += parseFloat(item.total);
        acc[item.periodo].total_membresias += parseInt(item.total_membresias);
        return acc;
      }, {});

      const periodos = Object.values(totalesPorPeriodo);

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{periodos.length} períodos</p>
            <Button onClick={handleDescargarPDF} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-1" /> PDF
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Período</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-600">Total</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Tipo Membresía</th>
                  <th className="px-3 py-2 text-center font-medium text-gray-600">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {list.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-center font-medium">{item.periodo}</td>
                    <td className="px-3 py-2 text-right font-medium text-green-600">${parseFloat(item.total).toFixed(2)}</td>
                    <td className="px-3 py-2 text-center">{item.tipo_membrecia || 'Sin tipo'}</td>
                    <td className="px-3 py-2 text-center">{item.total_membresias}</td>
                  </tr>
                ))}
              </tbody>
              {periodos.length > 0 && (
                <tfoot className="bg-gray-50 font-semibold">
                  <tr>
                    <td className="px-3 py-2 text-center">Totales</td>
                    <td className="px-3 py-2 text-right text-green-700">
                      ${periodos.reduce((s, p) => s + p.total, 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center"></td>
                    <td className="px-3 py-2 text-center">{periodos.reduce((s, p) => s + p.total_membresias, 0)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Reporte de Membresías</h2>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setData(null); }}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
                  tab === t.key
                    ? 'border-primary-main text-primary-main'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {tab === 'listado' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
                >
                  <option value="">Todos</option>
                  <option value="activa">Activa</option>
                  <option value="vencida">Vencida</option>
                  <option value="suspendida">Suspendida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Membresía</label>
                <select
                  value={idTipoMembrecia}
                  onChange={e => setIdTipoMembrecia(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
                >
                  <option value="">Todos</option>
                  {tiposMembresia.map(tm => <option key={tm.id_tipo_membrecia} value={tm.id_tipo_membrecia}>{tm.tipo_membrecia}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                <select
                  value={idGrupo}
                  onChange={e => setIdGrupo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
                >
                  <option value="">Todos</option>
                  {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
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
            </>
          )}

          {tab === 'proximas-a-vencer' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mostrar membresías que vencen en los próximos</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={dias}
                  onChange={e => setDias(parseInt(e.target.value) || 30)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
                />
                <span className="text-sm text-gray-500">días</span>
              </div>
            </div>
          )}

          {tab === 'ingresos' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
                <select
                  value={agrupar}
                  onChange={e => setAgrupar(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main"
                >
                  <option value="mensual">Mensual</option>
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
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
            </>
          )}
        </div>

        <Button onClick={handleGenerar} disabled={loading}>
          {loading ? <Spinner className="w-4 h-4 mr-1" /> : <Search className="w-4 h-4 mr-1" />}
          Generar reporte
        </Button>
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

export default MembresiasReporte;
