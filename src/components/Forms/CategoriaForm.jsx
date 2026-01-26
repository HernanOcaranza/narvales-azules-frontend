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
import * as categoriaService from '../../services/categoriaService';

function CategoriaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(
    initialData || {
      categoria: '',
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
      [name]: value,
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

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'La categoría es requerida';
    } else if (formData.categoria.length > 50) {
      newErrors.categoria = 'La categoría no puede tener más de 50 caracteres';
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
      if (initialData && initialData.id_categoria) {
        await categoriaService.update(initialData.id_categoria, formData);
      } else {
        await categoriaService.create(formData);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setError(
        error.message || 'Error al guardar la categoría. Por favor, intente nuevamente.'
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
          label="Categoría"
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.categoria}
          helperText={errors.categoria}
          inputProps={{ maxLength: 50 }}
          autoFocus
        />

        <TextField
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          error={!!errors.descripcion}
          helperText={errors.descripcion}
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

export default CategoriaForm;

