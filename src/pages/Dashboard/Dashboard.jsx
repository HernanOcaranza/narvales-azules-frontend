import React, { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  DollarSign,
  BookOpen,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Calendar,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import { LinearProgress, CircularProgress } from '../../components/ui';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  });
};

const calcTrend = (current, previous) => {
  if (!previous || previous === 0) return { value: '0', direction: 'same' };
  const pct = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(pct).toFixed(1),
    direction: pct >= 0 ? 'up' : 'down',
  };
};

const progressColors = ['primary', 'success', 'error', 'purple', 'warning', 'blue'];

const roleLabels = {
  admin: 'Admin',
  recepcionista: 'Recepcionista',
  profesor: 'Profesor',
  guardavidas: 'Guardavidas',
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const hoy = new Date();
  const mesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
  const [fechaDesde, setFechaDesde] = useState(mesAnterior.toISOString().split('T')[0]);
  const [fechaHasta, setFechaHasta] = useState(hoy.toISOString().split('T')[0]);

  useEffect(() => {
    loadData(fechaDesde, fechaHasta);
  }, []);

  const loadData = async (desde, hasta) => {
    try {
      setLoading(true);
      const result = await dashboardService.getStats({ fechaDesde: desde, fechaHasta: hasta });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadData(fechaDesde || undefined, fechaHasta || undefined);
  };

  const handleClearFilter = () => {
    const hoy = new Date();
    const mesAnt = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    setFechaDesde(mesAnt.toISOString().split('T')[0]);
    setFechaHasta(hoy.toISOString().split('T')[0]);
    loadData(mesAnt.toISOString().split('T')[0], hoy.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-red-600">
        Error: {error}
      </div>
    );
  }

  const s = data?.resumen || {};
  const trendIngresos = calcTrend(s.ingresosMes, s.ingresosMesAnterior);
  const trendEgresos = calcTrend(s.egresosMes, s.egresosMesAnterior);
  const trendGanancia = calcTrend(s.gananciaNeta, s.gananciaMesAnterior);
  const totalEmpleados = s.empleadosActivos || 1;

  return (
    <div className="p-3">
      {/* Date Filter */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-3 mb-4 border border-gray-200 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-4 py-1.5 text-sm font-medium bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Filtrar
        </button>
        {(fechaDesde || fechaHasta) && (
          <button
            onClick={handleClearFilter}
            className="px-4 py-1.5 text-sm font-medium text-text-secondary bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Alumnos Activos */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-blue-600 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            {s.alumnosNuevosEsteMes > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md border border-green-200">
                +{s.alumnosNuevosEsteMes} este mes
              </span>
            )}
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{s.totalAlumnos}</div>
          <div className="text-sm text-text-secondary mt-1">Alumnos Activos</div>
          <div className="flex items-center gap-1 mt-1">
            <UserCheck className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-green-600">{s.totalAlumnos} activos</span>
            {s.alumnosInactivos > 0 && (
              <>
                <span className="text-xs text-text-secondary mx-1">·</span>
                <UserX className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs text-red-500">{s.alumnosInactivos} inactivos</span>
              </>
            )}
          </div>
        </div>

        {/* Membresías Activas */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-green-600 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            {s.membresiasPorVencer > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-md border border-amber-200">
                {s.membresiasPorVencer} por vencer
              </span>
            )}
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{s.membresiasActivas}</div>
          <div className="text-sm text-text-secondary mt-1">Membresías Activas</div>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-green-600">{s.membresiasActivas} vigentes</span>
            {s.membresiasVencidas > 0 && (
              <>
                <span className="text-xs text-text-secondary mx-1">·</span>
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs text-red-500">{s.membresiasVencidas} vencidas</span>
              </>
            )}
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-emerald-600 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-md border flex items-center gap-1 ${
              trendIngresos.direction === 'up'
                ? 'text-green-700 bg-green-100 border-green-200'
                : trendIngresos.direction === 'down'
                  ? 'text-red-700 bg-red-100 border-red-200'
                  : 'text-gray-700 bg-gray-100 border-gray-200'
            }`}>
              {trendIngresos.direction === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : trendIngresos.direction === 'down' ? (
                <TrendingDown className="w-3 h-3" />
              ) : null}
              {trendIngresos.value}% vs mes ant.
            </span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{formatCurrency(s.ingresosMes)}</div>
          <div className="text-sm text-text-secondary mt-1">Ingresos del Mes</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-text-secondary">Facturado</span>
            {s.pagosPendientes > 0 && (
              <>
                <span className="text-xs text-text-secondary mx-1">·</span>
                <span className="text-xs text-amber-600">{s.pagosPendientes} pendientes</span>
              </>
            )}
          </div>
        </div>

        {/* Clases Hoy */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-purple-600 transition-transform hover:-translate-y-1 hover:shadow-lg">
          <div className="flex justify-between items-start mb-2">
            {s.clasesRealizadasHoy > 0 && (
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md border border-green-200">
                {s.clasesRealizadasHoy} realizadas
              </span>
            )}
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-text-primary">{s.clasesHoy}</div>
          <div className="text-sm text-text-secondary mt-1">Clases Hoy</div>
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs text-text-secondary">Programadas</span>
            {s.clasesHoy > 0 && (
              <>
                <span className="text-xs text-text-secondary mx-1">·</span>
                <span className="text-xs text-purple-600">
                  {Math.round((s.clasesRealizadasHoy / s.clasesHoy) * 100)}% completado
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Financial Cards with Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Ingresos</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${
                  trendIngresos.direction === 'up' ? 'text-green-600' : trendIngresos.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {trendIngresos.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : trendIngresos.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {trendIngresos.value}%
                </span>
              </div>
              <div className="text-xl font-bold text-emerald-700">{formatCurrency(s.ingresosMes)}</div>
            </div>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Egresos</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${
                  trendEgresos.direction === 'up' ? 'text-red-600' : trendEgresos.direction === 'down' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {trendEgresos.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : trendEgresos.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {trendEgresos.value}%
                </span>
              </div>
              <div className="text-xl font-bold text-red-600">{formatCurrency(s.egresosMes)}</div>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Ganancia Neta</span>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${
                  trendGanancia.direction === 'up' ? 'text-green-600' : trendGanancia.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {trendGanancia.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : trendGanancia.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                  {trendGanancia.value}%
                </span>
              </div>
              <div className={`text-xl font-bold ${s.gananciaNeta >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
                {formatCurrency(s.gananciaNeta)}
              </div>
            </div>
            <div className={`p-2 rounded-lg ${s.gananciaNeta >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
              <Target className={`w-5 h-5 ${s.gananciaNeta >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Alumnos por Disciplina */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-blue-600">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">
            Alumnos por Disciplina
          </h3>
          {data?.disciplinas?.length > 0 ? (
            <div className="space-y-3">
              {data.disciplinas.map((disc, index) => {
                const total = s.totalAlumnos || 1;
                const pct = Math.round((disc.totalAlumnos / total) * 100);
                return (
                  <div key={disc.id_disciplina}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-primary">{disc.nombre}</span>
                      <span className="text-sm font-semibold text-text-primary">{disc.totalAlumnos}</span>
                    </div>
                    <LinearProgress
                      value={pct}
                      color={progressColors[index % progressColors.length]}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">Sin datos de disciplinas</p>
          )}
        </div>

        {/* Alumnos por Categoría */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-green-600">
          <h3 className="text-lg font-semibold mb-4 text-green-700">
            Alumnos por Categoría
          </h3>
          {data?.categorias?.length > 0 ? (
            <div className="space-y-3">
              {data.categorias.map((cat, index) => {
                const total = s.totalAlumnos || 1;
                const pct = Math.round((cat.totalAlumnos / total) * 100);
                return (
                  <div key={cat.id_categoria}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-primary">
                        {cat.nombre} {cat.descripcion ? `(${cat.descripcion})` : ''}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">{cat.totalAlumnos}</span>
                    </div>
                    <LinearProgress
                      value={pct}
                      color={progressColors[(index + 2) % progressColors.length]}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">Sin datos de categorías</p>
          )}
        </div>
      </div>

      {/* Row 4: Distributions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Empleados por Rol */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-amber-600">
          <h3 className="text-lg font-semibold mb-4 text-amber-700">
            Empleados por Rol
          </h3>
          {data?.empleadosPorRol?.length > 0 ? (
            <div className="space-y-3">
              {data.empleadosPorRol.map((item, index) => {
                const pct = Math.round((item.total / totalEmpleados) * 100);
                return (
                  <div key={item.tipo}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-primary">{roleLabels[item.tipo] || item.tipo}</span>
                      <span className="text-sm font-semibold text-text-primary">{item.total}</span>
                    </div>
                    <LinearProgress
                      value={pct}
                      color={progressColors[(index + 4) % progressColors.length]}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">Sin datos de empleados</p>
          )}
          {data?.condiciones?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Alumnos por Condición</h4>
              <div className="space-y-1.5">
                {data.condiciones.map((c) => (
                  <div key={c.id_condicion} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{c.nombre}</span>
                    <span className="font-medium text-text-primary">{c.totalAlumnos}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Membresías por Tipo */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-red-500">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Membresías por Tipo
          </h3>
          {data?.membresiaPorTipo?.length > 0 ? (
            <div className="space-y-3">
              {(() => {
                const totalMembresias = data.membresiaPorTipo.reduce((acc, item) => acc + item.total, 0) || 1;
                return data.membresiaPorTipo.map((item, index) => {
                  const pct = Math.round((item.total / totalMembresias) * 100);
                  return (
                    <div key={item.tipo_membrecia}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-text-primary">{item.tipo_membrecia}</span>
                        <span className="text-sm font-semibold text-text-primary">{item.total}</span>
                      </div>
                      <LinearProgress
                        value={pct}
                        color={progressColors[(index + 1) % progressColors.length]}
                      />
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">Sin datos de membresías</p>
          )}
          {/* Últimas Membresías */}
          {data?.ultimasMembresias?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-text-primary mb-2">Últimas Membresías</h4>
              <div className="divide-y divide-gray-100">
                {data.ultimasMembresias.slice(0, 3).map((m) => (
                  <div key={m.id_membrecia} className="flex items-center gap-2 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-primary-main flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {m.alumno?.nombre?.charAt(0)}{m.alumno?.apellido?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-text-primary truncate">
                        {m.alumno?.nombre} {m.alumno?.apellido}
                      </div>
                      <div className="text-xs text-text-secondary truncate">
                        {m.tipo_membrecia?.tipo_membrecia}
                      </div>
                    </div>
                    <span className={`px-1.5 py-0.5 text-xs rounded-md font-medium ${
                      m.estado === 'activa' ? 'bg-green-100 text-green-800' :
                      m.estado === 'vencida' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {m.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 5: Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Asistencia */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-cyan-600 text-center">
          <h3 className="text-lg font-semibold mb-3 text-cyan-700">
            Asistencia (últimos 7 días)
          </h3>
          <div className="inline-flex items-center justify-center">
            <CircularProgress
              value={data?.promedioAsistencia?.porcentaje || 0}
              size={120}
              thickness={4}
              color="primary"
            />
          </div>
          <p className="text-sm text-text-secondary mt-2">
            {data?.promedioAsistencia?.presentes || 0} presentes de {data?.promedioAsistencia?.total || 0}
          </p>
        </div>

        {/* Próximas Clases */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-orange-600">
          <h3 className="text-lg font-semibold mb-3 text-orange-700">
            Próximas Clases
          </h3>
          {data?.ultimasClases?.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {data.ultimasClases.slice(0, 5).map((clase) => (
                <div key={clase.id_clase} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {clase.grupo?.nombre?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {clase.grupo?.nombre}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {formatDate(clase.fecha_clase)} - {clase.hora_inicio?.slice(0, 5)} a {clase.hora_fin?.slice(0, 5)}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-md font-medium ${
                    clase.estado === 'realizada' ? 'bg-green-100 text-green-800' :
                    clase.estado === 'suspendida' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {clase.estado}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No hay clases programadas</p>
          )}
        </div>

        {/* Resumen General */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 border-pink-600">
          <h3 className="text-lg font-semibold mb-3 text-pink-700">
            Resumen General
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Grupos Activos</span>
              <span className="font-medium text-text-primary">{s.gruposActivos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Ocupación Grupos</span>
              <span className="font-medium text-text-primary">
                {s.ocupacionPorcentaje}% ({s.miembrosActivos}/{s.cupoTotal} cupos)
              </span>
            </div>
            {s.ocupacionPorcentaje > 0 && (
              <LinearProgress
                value={s.ocupacionPorcentaje}
                color={s.ocupacionPorcentaje >= 90 ? 'error' : s.ocupacionPorcentaje >= 70 ? 'warning' : 'success'}
              />
            )}
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Tutores Registrados</span>
              <span className="font-medium text-text-primary">{s.tutoresRegistrados}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Empleados Activos</span>
              <span className="font-medium text-text-primary">{s.empleadosActivos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Membresías Vencidas</span>
              <span className="font-medium text-text-primary">{s.membresiasVencidas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Pagos Pendientes</span>
              <span className="font-medium text-amber-600">{s.pagosPendientes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Pagos Parciales</span>
              <span className="font-medium text-orange-600">{s.pagosParciales}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden data for future charts */}
      <div className="hidden">
        <pre id="trend-data">{JSON.stringify(data?.tendencias || {})}</pre>
      </div>
    </div>
  );
}

export default Dashboard;
