import React from 'react';
import { Save } from 'lucide-react';
import { Button, Input, Select } from '../ui';

export default function MembreciaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || { id_alumno: '', id_tipo_membrecia: '', id_grupo: '', fecha_inicio: '', fecha_fin: '', estado: 'activa' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_alumno || !formData.id_tipo_membrecia) { setError('Alumno y tipo de membresía son requeridos'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); if (onSuccess) onSuccess(); }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="ID Alumno" type="number" name="id_alumno" value={formData.id_alumno} onChange={handleChange} required />
      <Input label="ID Tipo Membresía" type="number" name="id_tipo_membrecia" value={formData.id_tipo_membrecia} onChange={handleChange} required />
      <Input label="ID Grupo" type="number" name="id_grupo" value={formData.id_grupo} onChange={handleChange} />
      <Input label="Fecha Inicio" type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} />
      <Input label="Fecha Fin" type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} />
      <Select label="Estado" name="estado" value={formData.estado || 'activa'} onChange={handleChange}>
        <option value="activa">Activa</option>
        <option value="vencida">Vencida</option>
        <option value="pendiente">Pendiente</option>
      </Select>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}