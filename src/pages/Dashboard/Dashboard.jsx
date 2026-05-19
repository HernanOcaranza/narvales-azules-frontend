import React, { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  DollarSign,
  BookOpen,
  Group,
  User,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import { Card, LinearProgress, CircularProgress } from '../../components/ui';

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

const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2', '#ed6c02', '#0288d1'];

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getStats();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <CircularProgress size="lg" />
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

  const stats = data?.resumen || {
    totalAlumnos: 0,
    membresiasActivas: 0,
    membresiasVencidas: 0,
    pagosPendientes: 0,
    pagosParciales: 0,
    clasesHoy: 0,
    ingresosMes: 0,
    egresosMes: 0,
    gananciaNeta: 0,
    gruposActivos: 0,
    tutoresRegistrados: 0,
    empleadosActivos: 0,
    membresiasPorVencer: 0,
  };

  const statCards = [
    {
      title: 'Total Alumnos',
      value: stats.totalAlumnos,
      color: '#1976d2',
      subtitle: 'Activos',
      icon: Users,
    },
    {
      title: 'Membresías Activas',
      value: stats.membresiasActivas,
      color: '#2e7d32',
      subtitle: stats.membresiasPorVencer > 0 ? `${stats.membresiasPorVencer} por vencer` : 'Vigente',
      icon: CreditCard,
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresosMes),
      color: '#388e3c',
      subtitle: stats.pagosPendientes > 0 ? `${stats.pagosPendientes} pendientes` : 'Completado',
      icon: DollarSign,
    },
    {
      title: 'Clases Hoy',
      value: stats.clasesHoy,
      color: '#7b1fa2',
      subtitle: 'Programadas',
      icon: BookOpen,
    },
  ];

  const financieraCards = [
    {
      title: 'Ingresos',
      value: formatCurrency(stats.ingresosMes),
      color: '#2e7d32',
    },
    {
      title: 'Egresos',
      value: formatCurrency(stats.egresosMes),
      color: '#d32f2f',
    },
    {
      title: 'Ganancia Neta',
      value: formatCurrency(stats.gananciaNeta),
      color: stats.gananciaNeta >= 0 ? '#1976d2' : '#d32f2f',
    },
  ];

  return (
    <div className="p-3">
      <h2 className="text-2xl font-semibold text-text-primary mb-6">
        Estadísticas
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: stat.color }}
            >
              <div className="flex justify-between items-start mb-2">
                {stat.title === 'Membresías Activas' && stats.membresiasPorVencer > 0 && (
                  <span className="px-2 py-1 text-xs font-medium text-amber-700 bg-amber-100 rounded-md border border-amber-200">
                    {stats.membresiasPorVencer} por vencer
                  </span>
                )}
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="text-3xl font-bold text-text-primary">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary mt-1">
                {stat.title}
              </div>
              <div className="text-xs text-text-secondary">
                {stat.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {financieraCards.map((card, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2"
            style={{ borderColor: card.color }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-secondary">
                  {card.title}
                </div>
                <div className="text-xl font-bold" style={{ color: card.color }}>
                  {card.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Alumnos por Disciplina */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2" style={{ borderColor: '#1976d2' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1976d2' }}>
            Alumnos por Disciplina
          </h3>
          {data?.disciplinas?.length > 0 ? (
            <div className="space-y-3">
              {data.disciplinas.map((disc, index) => {
                const total = stats.totalAlumnos || 1;
                const porcentaje = Math.round((disc.totalAlumnos / total) * 100);
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-primary">{disc.nombre}</span>
                      <span className="text-sm font-semibold text-text-primary">{disc.totalAlumnos}</span>
                    </div>
                    <LinearProgress
                      value={porcentaje}
                      color={index % 4 === 0 ? 'primary' : index % 4 === 1 ? 'success' : index % 4 === 2 ? 'error' : 'purple'}
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">No hay datos de disciplinas</p>
          )}
        </div>

        {/* Miembros por Categoría */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2" style={{ borderColor: '#2e7d32' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#2e7d32' }}>
            Miembros por Categoría
          </h3>
          {data?.categorias?.length > 0 ? (
            <div className="space-y-3">
              {data.categorias.map((cat, index) => {
                const total = stats.totalAlumnos || 1;
                const porcentaje = Math.round((cat.totalAlumnos / total) * 100);
                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-text-primary">
                        {cat.nombre} {cat.descripcion && `(${cat.descripcion})`}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">{cat.totalAlumnos}</span>
                    </div>
                    <LinearProgress
                      value={porcentaje}
                      color={colors[index % colors.length]}
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-sm mt-2">No hay datos de categorías</p>
          )}
        </div>
      </div>

      {/* Lists Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Últimas Membresías */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2" style={{ borderColor: '#7b1fa2' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold" style={{ color: '#7b1fa2' }}>
              Últimas Membresías
            </h3>
          </div>
          <div className="border-t border-gray-200 pt-2">
            {data?.ultimasMembresias?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.ultimasMembresias.slice(0, 5).map((m, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-primary-main flex items-center justify-center text-white text-sm font-semibold">
                      {m.alumno?.nombre?.charAt(0)}{m.alumno?.apellido?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {m.alumno?.nombre} {m.alumno?.apellido}
                      </div>
                      <div className="text-xs text-text-secondary truncate">
                        {m.tipo_membrecia?.tipo_membrecia} - {m.grupo?.nombre}
                      </div>
                    </div>
                    <span className={`
                      px-2 py-1 text-xs rounded-md font-medium
                      ${m.estado === 'activa' ? 'bg-green-100 text-green-800' : 
                        m.estado === 'vencida' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {m.estado}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm">No hay membresías registradas</p>
            )}
          </div>
        </div>

        {/* Próximas Clases */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2" style={{ borderColor: '#ed6c02' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold" style={{ color: '#ed6c02' }}>
              Próximas Clases
            </h3>
          </div>
          <div className="border-t border-gray-200 pt-2">
            {data?.ultimasClases?.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {data.ultimasClases.slice(0, 5).map((clase, index) => (
                  <div key={index} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
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
                    <span className={`
                      px-2 py-1 text-xs rounded-md font-medium
                      ${clase.estado === 'realizada' ? 'bg-green-100 text-green-800' : 
                        clase.estado === 'suspendida' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}
                    `}>
                      {clase.estado}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary text-sm">No hay clases programadas</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Asistencia */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2 text-center" style={{ borderColor: '#0288d1' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#0288d1' }}>
            Asistencia (últimos 7 días)
          </h3>
          <div className="inline-flex items-center justify-center">
            <CircularProgress
              value={data?.promedioAsistencia?.porcentaje || 0}
              size={120}
              thickness={4}
              color="success"
            />
          </div>
          <p className="text-sm text-text-secondary mt-2">
            {data?.promedioAsistencia?.presentes || 0} presentes de {data?.promedioAsistencia?.total || 0}
          </p>
        </div>

        {/* Resumen General */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2" style={{ borderColor: '#9c27b0' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#9c27b0' }}>
            Resumen General
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Grupos Activos</span>
              <span className="font-medium text-text-primary">{stats.gruposActivos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Tutores Registrados</span>
              <span className="font-medium text-text-primary">{stats.tutoresRegistrados}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Empleados Activos</span>
              <span className="font-medium text-text-primary">{stats.empleadosActivos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Membresías Vencidas</span>
              <span className="font-medium text-text-primary">{stats.membresiasVencidas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Pagos Parciales</span>
              <span className="font-medium text-text-primary">{stats.pagosParciales}</span>
            </div>
          </div>
        </div>

        {/* Membresías por Tipo */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 border-2" style={{ borderColor: '#d32f2f' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#d32f2f' }}>
            Membresías por Tipo
          </h3>
          {data?.membresiaPorTipo?.length > 0 ? (
            <div className="space-y-2">
              {data.membresiaPorTipo.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{item.tipo_membrecia}</span>
                  <span className="font-medium text-text-primary">{item.total} membresías</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-sm">No hay datos</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;