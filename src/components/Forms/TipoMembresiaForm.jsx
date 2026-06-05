import React from 'react';
import { Save } from 'lucide-react';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import { getTodayLocalDate } from '../../utils/helpers';
import { Button, Input } from '../../components/ui';

function TipoMembresiaForm({ onSuccess, onCancel, initialData = null }) {
  const precioActual = initialData?.precios?.find(p => p.estado === 1);
  const [formData, setFormData] = React.useState(initialData || { 
    tipo_membrecia: '', 
    frecuencia_semanal: '', 
    duracion_dias: '',
    precio: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'frecuencia_semanal' || name === 'duracion_dias' || name === 'precio' 
        ? (value === '' ? '' : Number(value)) 
        : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tipo_membrecia.trim()) { setError('El tipo de membresía es requerido'); return; }
    if (!formData.precio || formData.precio <= 0) { setError('El precio es requerido y debe ser mayor a 0'); return; }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        fecha_inicio_vigencia: getTodayLocalDate()
      };
      initialData?.id_tipo_membrecia ? await tipoMembresiasService.update(initialData.id_tipo_membrecia, payload) : await tipoMembresiasService.create(payload);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="Tipo de Membresía" name="tipo_membrecia" value={formData.tipo_membrecia} onChange={handleChange} required autoFocus />
      <Input label="Frecuencia Semanal" type="number" name="frecuencia_semanal" value={formData.frecuencia_semanal} onChange={handleChange} helperText="Veces por semana" />
      <Input label="Duración (días)" type="number" name="duracion_dias" value={formData.duracion_dias} onChange={handleChange} />
      <Input label="Precio" type="number" name="precio" value={formData.precio || precioActual?.precio || ''} onChange={handleChange} required helperText={precioActual ? 'El precio anterior se guardará en el histórico' : ''} />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default TipoMembresiaForm;