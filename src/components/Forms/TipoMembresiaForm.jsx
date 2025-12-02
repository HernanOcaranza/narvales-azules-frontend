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
import * as tipoMembresiasService from '../../services/tipoMembresiasService';

function TipoMembresiaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(
    initialData || {
      tipo_membrecia: '',
      frecuencia_semanal: '',
    }
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'frecuencia_semanal' ? (value === '' ? '' : Number(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipo_membrecia.trim()) {
      newErrors.tipo_membrecia = 'El tipo de membresía es requerido';
    } else if (formData.tipo_membrecia.length > 20) {
      newErrors.tipo_membrecia = 'El tipo de membresía no puede tener más de 20 caracteres';
    }

    if (formData.frecuencia_semanal !== '' && formData.frecuencia_semanal !== null) {
      if (formData.frecuencia_semanal < 0) {
        newErrors.frecuencia_semanal = 'La frecuencia semanal debe ser mayor o igual a 0';
      }
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
      if (initialData && initialData.id_tipo_membrecia) {
        await tipoMembresiasService.update(initialData.id_tipo_membrecia, formData);
      } else {
        await tipoMembresiasService.create(formData);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar tipo de membresía:', error);
      setError(
        error.message || 'Error al guardar el tipo de membresía. Por favor, intente nuevamente.'
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

        <TextField
          label="Tipo de Membresía"
          name="tipo_membrecia"
          value={formData.tipo_membrecia}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.tipo_membrecia}
          helperText={errors.tipo_membrecia}
          inputProps={{ maxLength: 20 }}
          autoFocus
          placeholder="Ej: Mensual, Trimestral, Anual"
        />

        <TextField
          label="Frecuencia Semanal"
          name="frecuencia_semanal"
          type="number"
          value={formData.frecuencia_semanal}
          onChange={handleChange}
          fullWidth
          error={!!errors.frecuencia_semanal}
          helperText={errors.frecuencia_semanal || 'Número de veces por semana (opcional)'}
          inputProps={{ min: 0 }}
          placeholder="Ej: 2, 3, 4"
        />

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

export default TipoMembresiaForm;

