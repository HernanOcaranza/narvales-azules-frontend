import React, { useState } from 'react';
import reporteService from '../../services/reporteService';
import Button from '../../components/UI/Button';
import Spinner from '../../components/UI/Spinner';
import { FileText, Download, Search } from 'lucide-react';
import { getTodayLocalDate, getOneMonthAgoLocalDate } from '../../utils/helpers';

function ReporteFinanciero() {
  const [fechaDesde, setFechaDesde] = useState(getOneMonthAgoLocalDate());
  const [fechaHasta, setFechaHasta] = useState(getTodayLocalDate());
  const [agrupar, setAgrupar] = useState('mensual');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerar = async () => {
    setError('');
    setData(null);
    setLoading(true);
    try {
      const params = { agrupar };
      if (fechaDesde) { params.fechaDesde = fechaDesde; params.fechaHasta = fechaHasta; }
      const result = await reporteService.getReporteFinanciero(params);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDF = () => {
    const params = { agrupar };
    if (fechaDesde) { params.fechaDesde = fechaDesde; params.fechaHasta = fechaHasta; }
    reporteService.descargarPDFReporteFinanciero(params);
  };

  const renderPreview = () => {
    if (!data) return null;
    const list = Array.isArray(data) ? data : [];
    const totalIngresos = list.reduce((s, r) => s + r.ingresos, 0);
    const totalEgresos = list.reduce((s, r) => s + r.egresos, 0);
    const saldo = totalIngresos - totalEgresos;

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">{list.length} períodos</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-700">${totalIngresos.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Total Egresos</p>
            <p className="text-2xl font-bold text-red-700">${totalEgresos.toFixed(2)}</p>
          </div>
          <div className={`border rounded-lg p-4 ${saldo >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
            <p className={`text-sm font-medium ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Saldo</p>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>${saldo.toFixed(2)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Períodos</p>
            <p className="text-2xl font-bold text-gray-700">{list.length}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Período</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">Ingresos</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">Egresos</th>
                <th className="px-3 py-2 text-right font-medium text-gray-600">Saldo</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Cant. Ingresos</th>
                <th className="px-3 py-2 text-center font-medium text-gray-600">Cant. Egresos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-center font-medium">{r.periodo}</td>
                  <td className="px-3 py-2 text-right text-green-600">${r.ingresos.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right text-red-600">${r.egresos.toFixed(2)}</td>
                  <td className={`px-3 py-2 text-right font-bold ${r.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${r.saldo.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-center">{r.cantidad_ingresos}</td>
                  <td className="px-3 py-2 text-center">{r.cantidad_egresos}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-3 py-2 text-center">Totales</td>
                <td className="px-3 py-2 text-right text-green-700">${totalIngresos.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-red-700">${totalEgresos.toFixed(2)}</td>
                <td className={`px-3 py-2 text-right ${saldo >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ${saldo.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-center">{list.reduce((s, r) => s + r.cantidad_ingresos, 0)}</td>
                <td className="px-3 py-2 text-center">{list.reduce((s, r) => s + r.cantidad_egresos, 0)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Reporte Financiero</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agrupar por</label>
            <select value={agrupar} onChange={e => setAgrupar(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main">
              <option value="mensual">Mensual</option>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerar} disabled={loading}>
            {loading ? <Spinner className="w-4 h-4 mr-1" /> : <Search className="w-4 h-4 mr-1" />}
            Generar reporte
          </Button>
          <Button onClick={handleDescargarPDF} variant="secondary" disabled={!data}>
            <Download className="w-4 h-4 mr-1" /> PDF
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
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

export default ReporteFinanciero;