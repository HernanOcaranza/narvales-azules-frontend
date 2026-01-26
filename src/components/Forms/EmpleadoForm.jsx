import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Button,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import * as empleadoService from '../../services/empleadoService';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';

function EmpleadoForm({ onSuccess, onCancel, initialData = null }) {

  // Estados del formulario
  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_alta: formatDateForInput(initialData.fecha_alta),
        contrasenia: '', // No mostrar la contraseña al editar
      };
    }
    return {
      tipo: '',
      usuario: '',
      contrasenia: '',
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      fecha_alta: getTodayLocalDate(), // Fecha actual por defecto
      estado: 1,
    };
  });

  // Estados de carga y errores
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estado' ? Number(value) : value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'El tipo es requerido';
    }

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El usuario es requerido';
    } else if (formData.usuario.length > 50) {
      newErrors.usuario = 'El usuario no puede tener más de 50 caracteres';
    }

    // La contraseña solo es requerida al crear, no al editar
    const isEditing = initialData && initialData.id_empleado;
    if (!isEditing && !formData.contrasenia.trim()) {
      newErrors.contrasenia = 'La contraseña es requerida';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length > 50) {
      newErrors.apellido = 'El apellido no puede tener más de 50 caracteres';
    }

    if (formData.dni && formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 caracteres';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (formData.telefono.length !== 10) {
      newErrors.telefono = 'El teléfono debe tener 10 caracteres';
    }

    if (!formData.fecha_alta) {
      newErrors.fecha_alta = 'La fecha de alta es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const isEditing = initialData && initialData.id_empleado;
      let dataToSend = { ...formData };
      
      // Si estamos editando y no hay contraseña, no enviarla
      if (isEditing && !formData.contrasenia.trim()) {
        delete dataToSend.contrasenia;
      }
      
      if (isEditing) {
        await empleadoService.update(initialData.id_empleado, dataToSend);
      } else {
        await empleadoService.create(dataToSend);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar empleado:', error);
      setError(
        error.response?.data?.message ||
          'Error al guardar el empleado. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Tipo */}
        <FormControl fullWidth required error={!!errors.tipo}>
          <InputLabel>Tipo</InputLabel>
          <Select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            label="Tipo"
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="profesor">Profesor</MenuItem>
            <MenuItem value="recepcionista">Recepcionista</MenuItem>
          </Select>
          {errors.tipo && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.tipo}
            </Typography>
          )}
        </FormControl>

        {/* Usuario */}
        <TextField
          label="Usuario"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.usuario}
          helperText={errors.usuario}
          inputProps={{ maxLength: 50 }}
        />

        {/* Contraseña */}
        <TextField
          label="Contraseña"
          name="contrasenia"
          type="password"
          value={formData.contrasenia}
          onChange={handleChange}
          required={!initialData || !initialData.id_empleado}
          fullWidth
          error={!!errors.contrasenia}
          helperText={errors.contrasenia || (initialData && initialData.id_empleado ? 'Dejar vacío para mantener la contraseña actual' : '')}
        />

        {/* Nombre */}
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.nombre}
          helperText={errors.nombre}
          inputProps={{ maxLength: 50 }}
        />

        {/* Apellido */}
        <TextField
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.apellido}
          helperText={errors.apellido}
          inputProps={{ maxLength: 50 }}
        />

        {/* DNI */}
        <TextField
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
          fullWidth
          error={!!errors.dni}
          helperText={errors.dni || 'Opcional - 8 caracteres'}
          inputProps={{ maxLength: 8 }}
        />

        {/* Teléfono */}
        <TextField
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.telefono}
          helperText={errors.telefono || '10 caracteres'}
          inputProps={{ maxLength: 10 }}
        />

        {/* Fecha de Alta */}
        <TextField
          label="Fecha de Alta"
          name="fecha_alta"
          type="date"
          value={formData.fecha_alta}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.fecha_alta}
          helperText={errors.fecha_alta}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Estado */}
        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={1}>Activo</MenuItem>
            <MenuItem value={0}>Inactivo</MenuItem>
          </Select>
        </FormControl>

        {/* Botones */}
        <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default EmpleadoForm;

