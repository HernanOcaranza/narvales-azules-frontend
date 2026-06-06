import React from 'react';
import { Save } from 'lucide-react';
import * as pagosService from '../../services/pagosService';
import * as empleadoService from '../../services/empleadoService';
import { Button, Input, Select } from '../ui';

export default function PagoForm({ onSuccess, onCancel, initialData = null }) {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = React.useState(initialData || { id_empleado: '', monto: '', fecha_pago: today, metodo_pago: 'efectivo', estado: 'completo', observaciones: '' });
  const [empleados, setEmpleados] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    empleadoService.getAll().then(d => {
      const data = d?.data || d || [];
      setEmpleados(Array.isArray(data) ? data : []);
    });
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.monto) { setError('El monto es requerido'); return; }
    if (!formData.id_empleado && !formData.observaciones?.trim()) { setError('Debe seleccionar un empleado o ingresar una descripción'); return; }
    setLoading(true);
    try {
      if (initialData?.id_pago) {
        const payload = {
          id_empleado: formData.id_empleado ? parseInt(formData.id_empleado) : null,
          observaciones: formData.observaciones,
          fecha_pago: formData.fecha_pago,
          estado: 'completo',
        };
        await pagosService.update(initialData.id_pago, payload);
      } else {
        await pagosService.createEgreso({
          id_empleado: formData.id_empleado ? parseInt(formData.id_empleado) : null,
          observaciones: formData.observaciones,
          fecha_pago: formData.fecha_pago,
          estado: 'completo',
          monto: parseFloat(formData.monto),
          metodo_pago: formData.metodo_pago,
        });
      }
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Select label="Empleado (opcional)" name="id_empleado" value={formData.id_empleado || ''} onChange={handleChange}>
        <option value="">Seleccionar empleado o describa el gasto abajo...</option>
        {empleados.map(e => <option key={e.id_empleado} value={e.id_empleado}>{e.nombre} {e.apellido}</option>)}
      </Select>
      <Input label="Descripción (requerido si no hay empleado)" name="observaciones" value={formData.observaciones || ''} onChange={handleChange} />
      <Input label="Monto" type="number" name="monto" value={formData.monto} onChange={handleChange} required />
      <Input label="Fecha de Pago" type="date" name="fecha_pago" value={formData.fecha_pago} onChange={handleChange} />
      <Select label="Método de Pago" name="metodo_pago" value={formData.metodo_pago || 'efectivo'} onChange={handleChange}>
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
        <option value="tarjeta">Tarjeta</option>
      </Select>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}