import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import * as pagosService from '../../services/pagosService';
import * as detallePagosService from '../../services/detallePagosService';
import { formatDate, formatCurrency, getTodayLocalDate } from '../../utils/helpers';
import { Button, Input, Modal } from '../ui';

export default function PagoDetailsModal({ open, onClose, pago, onRefresh }) {
  const [loading, setLoading] = React.useState(false);
  const [showAddDetalle, setShowAddDetalle] = React.useState(false);
  const [detalles, setDetalles] = React.useState(pago?.detalles || []);
  const [formDetalle, setFormDetalle] = React.useState({ metodo_pago: 'efectivo', monto_parcial: '', fecha_detalle: getTodayLocalDate(), referencia_transferencia: '' });

  const handleAddDetalle = async () => {
    if (!formDetalle.monto_parcial) return;
    setLoading(true);
    try {
      const nuevo = await detallePagosService.create({ ...formDetalle, id_pago: pago.id_pago, monto_parcial: parseFloat(formDetalle.monto_parcial) });
      setDetalles([...detalles, nuevo]);
      setShowAddDetalle(false);
      setFormDetalle({ metodo_pago: 'efectivo', monto_parcial: '', fecha_detalle: getTodayLocalDate(), referencia_transferencia: '' });
      if (onRefresh) onRefresh();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (!open || !pago) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Gasto #${pago.id_pago}`} size="lg">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><p className="text-sm text-text-secondary">Empleado</p><p className="font-medium">{pago.empleado?.nombre ? `${pago.empleado.nombre} ${pago.empleado.apellido}` : '-'}</p></div>
          <div><p className="text-sm text-text-secondary">Descripción</p><p className="font-medium">{pago.observaciones || '-'}</p></div>
          <div><p className="text-sm text-text-secondary">Monto Total</p><p className="font-bold text-primary-main text-lg">{formatCurrency(pago.detalles?.[0]?.monto_parcial)}</p></div>
          <div><p className="text-sm text-text-secondary">Fecha</p><p className="font-medium">{formatDate(pago.fecha_pago)}</p></div>
          <div><p className="text-sm text-text-secondary">Estado</p><span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">{pago.estado}</span></div>
        </div>
        
        <div><h4 className="font-medium mb-2">Detalles de Pago</h4>
          <div className="space-y-2">
            {detalles.map((d, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div><span className="font-medium">{d.metodo_pago}</span> - {formatCurrency(d.monto_parcial)}</div>
                <span className="text-sm text-text-secondary">{formatDate(d.fecha_detalle)}</span>
              </div>
            ))}
          </div>
          {!showAddDetalle && <Button size="sm" variant="outline" icon={Plus} onClick={() => setShowAddDetalle(true)} className="mt-2">Agregar Detalle</Button>}
          {showAddDetalle && (
            <div className="p-3 bg-gray-50 rounded mt-2 space-y-2">
              <Input label="Monto" type="number" value={formDetalle.monto_parcial} onChange={(e) => setFormDetalle(prev => ({ ...prev, monto_parcial: e.target.value }))} />
              <select className="w-full px-3 py-2 rounded border" value={formDetalle.metodo_pago} onChange={(e) => setFormDetalle(prev => ({ ...prev, metodo_pago: e.target.value }))}>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
              <div className="flex gap-2"><Button size="sm" onClick={handleAddDetalle} loading={loading}>Agregar</Button><Button size="sm" variant="ghost" onClick={() => setShowAddDetalle(false)}>Cancelar</Button></div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}