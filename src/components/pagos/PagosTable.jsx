import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip } from '../ui';

export default function PagosTable({ pagos = [], loading, onViewDetails, onEdit, onDelete, isMobile }) {
  const getEstadoBadge = (estado) => {
    const map = { completado: { v: 'success', l: 'Completado' }, pendiente: { v: 'warning', l: 'Pendiente' }, parcial: { v: 'info', l: 'Parcial' }, cancelado: { v: 'default', l: 'Cancelado' } };
    return map[estado] || { v: 'default', l: estado };
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        {pagos.length === 0 ? <p className="text-center text-text-secondary p-8">No hay pagos</p> : pagos.map((p) => {
          const badge = getEstadoBadge(p.estado);
          return (
            <div key={p.id_pago} className="bg-white/90 rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <div><p className="text-sm text-text-secondary">{p.id_empleado ? `${p.empleado?.nombre || ''} ${p.empleado?.apellido || ''}` : (p.observaciones || '-')}</p></div>
                <Chip label={badge.l} variant={badge.v} size="sm" />
              </div>
              <p className="text-lg font-bold text-primary-main">{formatCurrency(p.detalles?.[0]?.monto_parcial)}</p>
              <p className="text-sm text-text-secondary">{formatDate(p.fecha_pago)}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => onViewDetails(p)} className="p-2 rounded hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                <button onClick={() => onEdit(p)} className="p-2 rounded hover:bg-gray-100 text-primary-main"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(p)} className="p-2 rounded hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeadCell>Empleado/Descripción</TableHeadCell>
          <TableHeadCell>Monto</TableHeadCell>
          <TableHeadCell>Fecha</TableHeadCell>
          <TableHeadCell>Método</TableHeadCell>
          <TableHeadCell>Estado</TableHeadCell>
          <TableHeadCell className="text-right">Acciones</TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pagos.map((p) => {
          const badge = getEstadoBadge(p.estado);
          return (
            <TableRow key={p.id_pago} hover>
              <TableCell>{p.id_empleado ? `${p.empleado?.nombre || ''} ${p.empleado?.apellido || ''}` : (p.observaciones || '-')}</TableCell>
              <TableCell className="font-bold text-primary-main">{formatCurrency(p.detalles?.[0]?.monto_parcial)}</TableCell>
              <TableCell>{formatDate(p.fecha_pago)}</TableCell>
              <TableCell>{p.detalles?.[0]?.metodo_pago || '-'}</TableCell>
              <TableCell><Chip label={badge.l} variant={badge.v} size="sm" /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <button onClick={() => onViewDetails(p)} className="p-1.5 rounded hover:bg-gray-100 text-text-secondary"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEdit(p)} className="p-1.5 rounded hover:bg-primary-main/10 text-primary-main"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(p)} className="p-1.5 rounded hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}