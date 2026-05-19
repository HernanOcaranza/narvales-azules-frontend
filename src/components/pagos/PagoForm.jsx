import React from 'react';
import { Save } from 'lucide-react';
import * as pagosService from '../../services/pagosService';
import * as alumnoService from '../../services/alumnoService';
import { Button, Input, Select } from '../ui';
import DetallePagoForm from './DetallePagoForm';

export default function PagoForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || { id_alumno: '', monto_total: '', fecha_pago: new Date().toISOString().split('T')[0], metodo_pago: 'efectivo', estado: 'completado', observaciones: '', detalles: [] });
  const [alumnos, setAlumnos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    alumnoService.getAll({ limit: 100 }).then(d => {
      const data = d?.data?.data || d?.data || d || [];
      setAlumnos(Array.isArray(data) ? data : []);
    });
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_alumno || !formData.monto_total) { setError('Alumno y monto son requeridos'); return; }
    setLoading(true);
    try {
      const payload = { ...formData, id_alumno: parseInt(formData.id_alumno), monto_total: parseFloat(formData.monto_total) };
      initialData?.id_pago ? await pagosService.update(initialData.id_pago, payload) : await pagosService.create(payload);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Select label="Alumno" name="id_alumno" value={formData.id_alumno || ''} onChange={handleChange} required>
        <option value="">Seleccionar...</option>
        {alumnos.map(a => <option key={a.id_alumno} value={a.id_alumno}>{a.nombre} {a.apellido}</option>)}
      </Select>
      <Input label="Monto Total" type="number" name="monto_total" value={formData.monto_total} onChange={handleChange} required />
      <Input label="Fecha de Pago" type="date" name="fecha_pago" value={formData.fecha_pago} onChange={handleChange} />
      <Select label="Método de Pago" name="metodo_pago" value={formData.metodo_pago || 'efectivo'} onChange={handleChange}>
        <option value="efectivo">Efectivo</option>
        <option value="transferencia">Transferencia</option>
        <option value="tarjeta">Tarjeta</option>
      </Select>
      <Select label="Estado" name="estado" value={formData.estado || 'completado'} onChange={handleChange}>
        <option value="completado">Completado</option>
        <option value="pendiente">Pendiente</option>
        <option value="parcial">Parcial</option>
      </Select>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}