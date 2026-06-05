import React from 'react';
import { X } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Modal } from '../ui';

export default function MembreciaDetailsModal({ open, onClose, membresia }) {
  if (!open || !membresia) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Membresía #${membresia.id_membrecia}`} size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-text-secondary">Alumno</p><p className="font-medium">{membresia.alumno?.nombre} {membresia.alumno?.apellido}</p></div>
          <div><p className="text-sm text-text-secondary">Tipo</p><p className="font-medium">{membresia.tipo_membrecia?.tipo_membrecia}</p></div>
          <div><p className="text-sm text-text-secondary">Fecha Inicio</p><p className="font-medium">{formatDate(membresia.fecha_inicio)}</p></div>
          <div><p className="text-sm text-text-secondary">Fecha Fin</p><p className="font-medium">{formatDate(membresia.fecha_fin)}</p></div>
          <div><p className="text-sm text-text-secondary">Grupo</p><p className="font-medium">{membresia.grupo?.nombre || 'N/A'}</p></div>
          <div><p className="text-sm text-text-secondary">Estado</p><span className={`px-2 py-1 rounded text-xs font-medium ${membresia.estado === 'activa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{membresia.estado}</span></div>
        </div>
      </div>
    </Modal>
  );
}