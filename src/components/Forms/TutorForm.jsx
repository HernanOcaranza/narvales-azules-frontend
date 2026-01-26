import React from 'react';
import {
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Button,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import * as tutorService from '../../services/tutorService';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';

function TutorForm({ onSuccess, onCancel, initialData = null }) {

  // Estados del formulario
  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_registro: formatDateForInput(initialData.fecha_registro),
      };
    }
    return {
      nombre: '',
      apellido: '',
      telefono: '',
      dni: '',
      fecha_registro: getTodayLocalDate(), // Fecha actual por defecto
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
      [name]: value,
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

    if (!formData.fecha_registro) {
      newErrors.fecha_registro = 'La fecha de registro es requerida';
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
      const isEditing = initialData && initialData.id_tutor;
      let result;
      if (isEditing) {
        result = await tutorService.update(initialData.id_tutor, formData);
      } else {
        result = await tutorService.create(formData);
      }
      // Extraer el tutor creado/actualizado de la respuesta
      const tutor = result?.data || result;
      if (onSuccess) {
        onSuccess(tutor);
      }
    } catch (error) {
      console.error('Error al guardar tutor:', error);
      setError(
        error.response?.data?.message ||
          'Error al guardar el tutor. Por favor, intente nuevamente.'
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
          autoFocus
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

        {/* Fecha de Registro */}
        <TextField
          label="Fecha de Registro"
          name="fecha_registro"
          type="date"
          value={formData.fecha_registro}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.fecha_registro}
          helperText={errors.fecha_registro}
          InputLabelProps={{
            shrink: true,
          }}
        />

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

export default TutorForm;

