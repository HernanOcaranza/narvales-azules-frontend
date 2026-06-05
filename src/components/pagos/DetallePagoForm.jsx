import React from 'react';
import { Save } from 'lucide-react';
import { Button, Input, Select } from '../ui';

export default function DetallePagoForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || { metodo_pago: 'efectivo', monto_parcial: '', fecha_detalle: new Date().toISOString().split('T')[0], referencia_transferencia: '' });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => { e.preventDefault(); if (onSuccess) onSuccess(formData); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Monto" type="number" name="monto_parcial" value={formData.monto_parcial} onChange={handleChange} required />
      <Select label="Método" name="metodo_pago" value={formData.metodo_pago} onChange={handleChange}>
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
        <option value="tarjeta">Tarjeta</option>
      </Select>
      <Input label="Fecha" type="date" name="fecha_detalle" value={formData.fecha_detalle} onChange={handleChange} />
      <Input label="Referencia (opcional)" name="referencia_transferencia" value={formData.referencia_transferencia} onChange={handleChange} />
      <div className="flex justify-end gap-3">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}