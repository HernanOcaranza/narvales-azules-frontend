import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip } from '../ui';

export default function MembresiasTable({ membresias = [], onViewDetails, onEdit, onDelete, isMobile }) {
  const getEstadoBadge = (estado) => {
    const map = { activa: { v: 'success', l: 'Activa' }, vencida: { v: 'error', l: 'Vencida' }, pendiente: { v: 'warning', l: 'Pendiente' } };
    return map[estado] || { v: 'default', l: estado };
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        {membresias.length === 0 ? (
          <p className="text-center text-text-secondary p-8">No hay membresías</p>
        ) : (
          membresias.map((m) => {
            const badge = getEstadoBadge(m.estado);
            return (
              <div key={m.id_membrecia} className="bg-white/90 rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{m.alumno?.nombre} {m.alumno?.apellido}</h3>
                    <p className="text-sm text-text-secondary">{m.tipo_membrecia?.tipo_membrecia}</p>
                  </div>
                  <Chip label={badge.l} variant={badge.v} size="sm" />
                </div>
                <p className="text-sm text-text-secondary">
                  {formatDate(m.fecha_inicio)} - {formatDate(m.fecha_fin)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onViewDetails(m)} className="p-2 rounded hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEdit(m)} className="p-2 rounded hover:bg-gray-100 text-primary-main"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(m)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Alumno</TableHeadCell>
          <TableHeadCell>Tipo</TableHeadCell>
          <TableHeadCell>Grupo</TableHeadCell>
          <TableHeadCell>Fecha Inicio</TableHeadCell>
          <TableHeadCell>Fecha Fin</TableHeadCell>
          <TableHeadCell>Estado</TableHeadCell>
          <TableHeadCell className="text-right">Acciones</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {membresias.map((m) => {
          const badge = getEstadoBadge(m.estado);
          return (
            <TableRow key={m.id_membrecia} hover>
              <TableCell>{m.alumno?.nombre} {m.alumno?.apellido}</TableCell>
              <TableCell>{m.tipo_membrecia?.tipo_membrecia || 'N/A'}</TableCell>
              <TableCell>{m.grupo?.nombre || 'N/A'}</TableCell>
              <TableCell>{formatDate(m.fecha_inicio)}</TableCell>
              <TableCell>{formatDate(m.fecha_fin)}</TableCell>
              <TableCell><Chip label={badge.l} variant={badge.v} size="sm" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onViewDetails(m)} className="p-1.5 rounded hover:bg-gray-100 text-text-secondary"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEdit(m)} className="p-1.5 rounded hover:bg-primary-main/10 text-primary-main"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(m)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}