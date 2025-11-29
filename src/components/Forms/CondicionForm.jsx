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
import * as condicionService from '../../services/condicionService';

function CondicionForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(
    initialData || {
      condicion: '',
      atencion: '',
      descripcion: '',
    }
  );

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'atencion' ? (value === '' ? '' : Number(value)) : value,
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

    if (!formData.condicion.trim()) {
      newErrors.condicion = 'La condición es requerida';
    } else if (formData.condicion.length > 50) {
      newErrors.condicion = 'La condición no puede tener más de 50 caracteres';
    }

    if (!formData.atencion || formData.atencion === '') {
      newErrors.atencion = 'La atención es requerida';
    } else if (formData.atencion < 0) {
      newErrors.atencion = 'La atención debe ser un número positivo';
    }

    if (formData.descripcion && formData.descripcion.length > 100) {
      newErrors.descripcion = 'La descripción no puede tener más de 100 caracteres';
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
      if (initialData && initialData.id_condicion) {
        await condicionService.update(initialData.id_condicion, formData);
      } else {
        await condicionService.create(formData);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar condición:', error);
      setError(
        error.message || 'Error al guardar la condición. Por favor, intente nuevamente.'
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
          label="Condición"
          name="condicion"
          value={formData.condicion}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.condicion}
          helperText={errors.condicion}
          inputProps={{ maxLength: 50 }}
          autoFocus
        />

        <TextField
          label="Atención"
          name="atencion"
          type="number"
          value={formData.atencion}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.atencion}
          helperText={errors.atencion}
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          error={!!errors.descripcion}
          helperText={errors.descripcion || 'Opcional - Máximo 100 caracteres'}
          inputProps={{ maxLength: 100 }}
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

export default CondicionForm;

