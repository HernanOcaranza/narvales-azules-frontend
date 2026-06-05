import React from 'react';
import { Save } from 'lucide-react';
import * as tutorService from '../../services/tutorService';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';
import { Button, Input } from '../../components/ui';

function TutorForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return { ...initialData, fecha_registro: formatDateForInput(initialData.fecha_registro) };
    }
    return { nombre: '', apellido: '', telefono: '', dni: '', fecha_registro: getTodayLocalDate() };
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (formData.dni && formData.dni.length !== 8) newErrors.dni = 'El DNI debe tener 8 caracteres';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.fecha_registro) newErrors.fecha_registro = 'La fecha de registro es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const isEditing = initialData?.id_tutor;
      const result = isEditing ? await tutorService.update(initialData.id_tutor, formData) : await tutorService.create(formData);
      onSuccess(result?.data || result);
    } catch (err) {
      setError(err.message || 'Error al guardar el tutor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required error={errors.nombre} autoFocus />
      <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required error={errors.apellido} />
      <Input label="DNI" name="dni" value={formData.dni} onChange={handleChange} error={errors.dni} helperText="Opcional - 8 caracteres" />
      <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} required error={errors.telefono} helperText="10 caracteres" />
      <Input label="Fecha de Registro" type="date" name="fecha_registro" value={formData.fecha_registro} onChange={handleChange} required error={errors.fecha_registro} />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  );
}

export default TutorForm;