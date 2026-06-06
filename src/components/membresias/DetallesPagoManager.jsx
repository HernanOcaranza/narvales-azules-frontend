import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { getTodayLocalDate } from '../../utils/helpers';
import { Button, Input } from '../ui';

export default function DetallesPagoManager({ detalles = [], onChange }) {
  const addDetalle = () => onChange([...detalles, { metodo_pago: 'efectivo', monto_parcial: 0, fecha_detalle: getTodayLocalDate() }]);
  const removeDetalle = (index) => onChange(detalles.filter((_, i) => i !== index));
  const updateDetalle = (index, field, value) => {
    const updated = [...detalles];
    updated[index][field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {detalles.map((detalle, index) => (
        <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
          <select className="px-2 py-1 rounded border" value={detalle.metodo_pago} onChange={(e) => updateDetalle(index, 'metodo_pago', e.target.value)}>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
          <input type="number" placeholder="Monto" className="px-2 py-1 rounded border w-24" value={detalle.monto_parcial} onChange={(e) => updateDetalle(index, 'monto_parcial', parseFloat(e.target.value))} />
          <input type="date" className="px-2 py-1 rounded border" value={detalle.fecha_detalle} onChange={(e) => updateDetalle(index, 'fecha_detalle', e.target.value)} />
          <button onClick={() => removeDetalle(index)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addDetalle}>Agregar</Button>
    </div>
  );
}