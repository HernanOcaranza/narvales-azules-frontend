import React from 'react';
import { Calendar, CreditCard, User, Tag, Clock } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Modal, Chip } from '../ui';

function getEstadoBadge(estado) {
  const map = {
    activa: { variant: 'success', label: 'Activa' },
    vencida: { variant: 'default', label: 'Vencida' },
    suspendida: { variant: 'warning', label: 'Suspendida' },
    cancelada: { variant: 'error', label: 'Cancelada' },
  };
  return map[estado] || { variant: 'default', label: estado };
}

function getPagoBadge(estado) {
  const map = {
    completo: { variant: 'success', label: 'Completo' },
    parcial: { variant: 'warning', label: 'Parcial' },
    pendiente: { variant: 'error', label: 'Pendiente' },
  };
  return map[estado] || { variant: 'default', label: estado };
}

function getMetodoPagoLabel(metodo) {
  const map = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    tarjeta: 'Tarjeta',
  };
  return map[metodo] || metodo;
}

function calcularDiasRestantes(fechaFin) {
  if (!fechaFin) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fin = new Date(fechaFin + 'T00:00:00');
  const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
  return diff;
}

function InfoRow({ label, children }) {
  return (
    <div>
      <p className="text-xs text-text-secondary mb-0.5">{label}</p>
      <p className="font-medium text-sm">{children}</p>
    </div>
  );
}

export default function MembreciaDetailsModal({ open, onClose, membresia }) {
  if (!open || !membresia) return null;

  const diasRestantes = calcularDiasRestantes(membresia.fecha_fin);
  const badge = getEstadoBadge(membresia.estado);
  const pago = membresia.pago;
  const detalles = pago?.detalles || [];
  const totalPagado = detalles.reduce((sum, d) => sum + (parseFloat(d.monto_parcial) || 0), 0);

  return (
    <Modal open={open} onClose={onClose} title={`Membresía #${membresia.id_membrecia}`} size="lg">
      <div className="space-y-5">
        {/* Estado y días restantes */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Chip label={badge.label} variant={badge.variant} size="sm" />
            {membresia.estado === 'activa' && diasRestantes !== null && (
              <span className={`text-sm font-medium ${diasRestantes <= 7 ? 'text-red-600' : diasRestantes <= 15 ? 'text-amber-600' : 'text-green-600'}`}>
                {diasRestantes > 0 ? `${diasRestantes} días restantes` : diasRestantes === 0 ? 'Vence hoy' : `Vencida hace ${Math.abs(diasRestantes)} días`}
              </span>
            )}
          </div>
          {membresia.grupo?.disciplina && (
            <span className="text-xs text-text-secondary">{membresia.grupo.disciplina.disciplina}</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Alumno */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2 text-primary-main">
              <User className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Alumno</span>
            </div>
            <InfoRow label="Nombre">{membresia.alumno?.nombre} {membresia.alumno?.apellido}</InfoRow>
          </div>

          {/* Membresía */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2 text-primary-main">
              <Tag className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Membresía</span>
            </div>
            <InfoRow label="Tipo">{membresia.tipo_membrecia?.tipo_membrecia || 'N/A'}</InfoRow>
            {membresia.tipo_membrecia?.frecuencia_semanal && (
              <InfoRow label="Frecuencia">{membresia.tipo_membrecia.frecuencia_semanal} vez/veces por semana</InfoRow>
            )}
          </div>

          {/* Grupo */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2 text-primary-main">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Grupo</span>
            </div>
            <InfoRow label="Grupo">{membresia.grupo?.nombre || 'N/A'}</InfoRow>
            <InfoRow label="Disciplina">{membresia.grupo?.disciplina?.disciplina || 'N/A'}</InfoRow>
            <InfoRow label="Categoría">{membresia.grupo?.categoria?.categoria || 'N/A'}</InfoRow>
          </div>

          {/* Fechas */}
          <div className="border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2 text-primary-main">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Fechas</span>
            </div>
            <InfoRow label="Fecha Inicio">{formatDate(membresia.fecha_inicio)}</InfoRow>
            <InfoRow label="Fecha Fin">{formatDate(membresia.fecha_fin)}</InfoRow>
          </div>
        </div>

        {/* Pago */}
        <div className="border rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-3 text-primary-main">
            <CreditCard className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Pago</span>
          </div>

          {pago ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <InfoRow label="Estado">
                  <Chip {...getPagoBadge(pago.estado)} size="sm" />
                </InfoRow>
                <InfoRow label="Fecha de Pago">{formatDate(pago.fecha_pago)}</InfoRow>
                <InfoRow label="Total Pagado">
                  <span className="text-base font-bold text-primary-main">{formatCurrency(totalPagado)}</span>
                </InfoRow>
              </div>
              {pago.observaciones && (
                <div className="mb-3">
                  <InfoRow label="Observaciones">{pago.observaciones}</InfoRow>
                </div>
              )}

              {/* Detalles de Pago */}
              {detalles.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Detalles del Pago</p>
                  <div className="space-y-2">
                    {detalles.map((detalle, i) => (
                      <div key={detalle.id_detalle_pago || i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium min-w-[100px]">{getMetodoPagoLabel(detalle.metodo_pago)}</span>
                          <span className="text-xs text-text-secondary">{formatDate(detalle.fecha_detalle)}</span>
                          {detalle.referencia_transferencia && (
                            <span className="text-xs text-text-secondary">Ref: {detalle.referencia_transferencia}</span>
                          )}
                        </div>
                        <span className="text-sm font-bold">{formatCurrency(detalle.monto_parcial)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-text-secondary italic">Sin información de pago</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
