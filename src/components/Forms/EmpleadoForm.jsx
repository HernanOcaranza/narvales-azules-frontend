import React from 'react';
import { Save } from 'lucide-react';
import * as empleadoService from '../../services/empleadoService';
import { getTodayLocalDate } from '../../utils/helpers';
import { Button, Input, Select } from '../../components/ui';

function EmpleadoForm({ onSuccess, onCancel, initialData = null }) {
  const getInitialData = () => {
    const defaults = { 
      tipo: 'recepcionista', 
      usuario: '', 
      nombre: '', 
      apellido: '', 
      dni: '', 
      email: '',
      telefono: '', 
      fecha_alta: getTodayLocalDate() 
    };
    if (!initialData) return defaults;
    const { contrasenia, ...rest } = initialData;
    return { ...defaults, ...rest };
  };

  const [formData, setFormData] = React.useState(getInitialData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellido || !formData.tipo || !formData.usuario) { 
      setError('Nombre, apellido, tipo y usuario son requeridos'); 
      return; 
    }
    if (!initialData?.id_empleado && !formData.contrasenia) {
      setError('La contraseña es requerida para nuevos empleados');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.contrasenia === '') {
        delete payload.contrasenia;
      }
      initialData?.id_empleado ? await empleadoService.update(initialData.id_empleado, payload) : await empleadoService.create(payload);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Usuario" name="usuario" value={formData.usuario} onChange={handleChange} required autoFocus helperText="Nombre de usuario para iniciar sesión" />
        <Input label="Contraseña" name="contrasenia" type="password" value={formData.contrasenia || ''} onChange={handleChange} helperText={initialData ? 'Dejar en blanco para mantener actual' : 'Requerida'} />
        <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
        <Input label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
        <Input label="DNI" name="dni" value={formData.dni} onChange={handleChange} />
        <Input label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
        <Input label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} required />
      </div>
      <Select label="Tipo" name="tipo" value={formData.tipo || 'recepcionista'} onChange={handleChange}>
        <option value="admin">Administrador</option>
        <option value="recepcionista">Recepcionista</option>
        <option value="profesor">Profesor</option>
      </Select>
      <Input label="Fecha de Alta" type="date" name="fecha_alta" value={formData.fecha_alta} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default EmpleadoForm;