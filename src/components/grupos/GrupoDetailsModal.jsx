import React from 'react';
import { Users, Calendar, User, Tag, Filter } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Modal, Chip, Spinner, LinearProgress, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '../ui';
import * as grupoService from '../../services/grupoService';

function getEstadoBadge(estado) {
  const map = {
    activa: { variant: 'success', label: 'Activa' },
    vencida: { variant: 'default', label: 'Vencida' },
    suspendida: { variant: 'warning', label: 'Suspendida' },
    cancelada: { variant: 'error', label: 'Cancelada' },
  };
  return map[estado] || { variant: 'default', label: estado };
}

function InfoRow({ label, children }) {
  return (
    <div>
      <p className="text-xs text-text-secondary mb-0.5">{label}</p>
      <p className="font-medium text-sm">{children}</p>
    </div>
  );
}

export default function GrupoDetailsModal({ open, onClose, grupoId }) {
  const [grupo, setGrupo] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    if (open && grupoId) {
      loadGrupo(grupoId);
    }
  }, [open, grupoId]);

  const loadGrupo = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await grupoService.getCompletoById(id);
      setGrupo(result?.data || result);
    } catch (err) {
      console.error('Error al cargar grupo completo:', err);
      setError('No se pudo cargar la información del grupo');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title={grupo?.nombre || 'Cargando...'} size="lg">
      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 p-8">{error}</p>
      ) : !grupo ? (
        <p className="text-center text-text-secondary p-8">Grupo no encontrado</p>
      ) : (
        <div className="space-y-5">
          {/* Header */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">{grupo.categoria?.categoria || 'N/A'}</span>
              <span className="text-xs font-medium text-primary-main">{grupo.disciplina?.disciplina || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow label="Disciplina">{grupo.disciplina?.disciplina || 'N/A'}</InfoRow>
              <InfoRow label="Categoría">{grupo.categoria?.categoria || 'N/A'}</InfoRow>
              <InfoRow label="Horario">
                {grupo.horarios?.map(h => `${['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][h.dia_semana]} ${h.hora_inicio?.slice(0,5)}-${h.hora_fin?.slice(0,5)}`).join(', ') || 'Sin horario'}
              </InfoRow>
              <InfoRow label="Estado">
                <Chip label={grupo.estado === 1 ? 'Activo' : 'Inactivo'} variant={grupo.estado === 1 ? 'success' : 'default'} size="sm" />
              </InfoRow>
            </div>
          </div>

          {/* Cupo */}
          <CupoSection membresias={grupo.membresias || []} cupoMaximo={grupo.cupo_maximo} showAll={showAll} />

          {/* Alumnos */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-primary-main">
                <Users className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wide">Alumnos</span>
              </div>
              <button
                onClick={() => setShowAll(!showAll)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  showAll ? 'bg-primary-main/10 text-primary-main' : 'bg-gray-100 text-text-secondary'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                {showAll ? 'Todas las membresías' : 'Solo activas'}
              </button>
            </div>

            <AlumnosTable membresias={grupo.membresias || []} showAll={showAll} />
          </div>
        </div>
      )}
    </Modal>
  );
}

function CupoSection({ membresias, cupoMaximo, showAll }) {
  const membresiasFiltradas = showAll
    ? membresias
    : membresias.filter(m => m.estado === 'activa');

  const cupoActual = membresiasFiltradas.reduce((sum, m) => {
    return sum + (m.alumno?.condicion?.atencion || 1);
  }, 0);

  const porcentaje = cupoMaximo > 0 ? (cupoActual / cupoMaximo) * 100 : 0;
  const color = porcentaje >= 90 ? 'error' : porcentaje >= 70 ? 'warning' : 'success';

  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-2 text-primary-main">
        <User className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-wide">Cupo</span>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary">
          <span className="font-bold text-text-primary">{cupoActual}</span>
          {' / '}
          <span className="font-bold text-text-primary">{cupoMaximo}</span>
          {' alumnos'}
          {!showAll && membresias.length > membresiasFiltradas.length && (
            <span className="text-xs ml-2 text-text-secondary">
              ({membresias.length - membresiasFiltradas.length} inactivos)
            </span>
          )}
        </span>
        <span className={`text-sm font-bold ${
          porcentaje >= 90 ? 'text-red-600' : porcentaje >= 70 ? 'text-amber-600' : 'text-green-600'
        }`}>
          {Math.round(porcentaje)}%
        </span>
      </div>
      <LinearProgress value={porcentaje} color={color} />
    </div>
  );
}

function AlumnosTable({ membresias, showAll }) {
  const membresiasFiltradas = showAll
    ? membresias
    : membresias.filter(m => m.estado === 'activa');

  if (membresiasFiltradas.length === 0) {
    return (
      <p className="text-center text-text-secondary py-4 text-sm">
        {showAll ? 'No hay alumnos registrados en este grupo' : 'No hay alumnos con membresía activa en este grupo'}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-2 font-semibold text-text-secondary text-xs uppercase tracking-wide">Alumno</th>
            <th className="text-left py-2 px-2 font-semibold text-text-secondary text-xs uppercase tracking-wide">Condición</th>
            <th className="text-center py-2 px-2 font-semibold text-text-secondary text-xs uppercase tracking-wide">Atención</th>
            <th className="text-left py-2 px-2 font-semibold text-text-secondary text-xs uppercase tracking-wide">Membresía</th>
            <th className="text-left py-2 px-2 font-semibold text-text-secondary text-xs uppercase tracking-wide">Vigencia</th>
            <th className="text-center py-2 px-2 font-semibold text-text-secondary text-xs uppercase tracking-wide">Estado</th>
          </tr>
        </thead>
        <tbody>
          {membresiasFiltradas.map((m) => {
            const badge = getEstadoBadge(m.estado);
            return (
              <tr key={m.id_membrecia} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-2 px-2 font-medium">
                  {m.alumno?.nombre} {m.alumno?.apellido}
                </td>
                <td className="py-2 px-2 text-text-secondary">
                  {m.alumno?.condicion?.condicion || 'N/A'}
                </td>
                <td className="py-2 px-2 text-center">
                  <Chip label={String(m.alumno?.condicion?.atencion || 1)} variant="info" size="sm" />
                </td>
                <td className="py-2 px-2 text-text-secondary">
                  {m.tipo_membrecia?.tipo_membrecia || 'N/A'}
                </td>
                <td className="py-2 px-2 text-text-secondary text-xs">
                  {formatDate(m.fecha_inicio)} - {formatDate(m.fecha_fin)}
                </td>
                <td className="py-2 px-2 text-center">
                  <Chip label={badge.label} variant={badge.variant} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
