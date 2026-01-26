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
import * as disciplinaService from '../../services/disciplinaService';

function DisciplinaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(
    initialData || {
      disciplina: '',
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

    if (!formData.disciplina.trim()) {
      newErrors.disciplina = 'La disciplina es requerida';
    } else if (formData.disciplina.length > 50) {
      newErrors.disciplina = 'La disciplina no puede tener más de 50 caracteres';
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
      if (initialData && initialData.id_disciplina) {
        await disciplinaService.update(initialData.id_disciplina, formData);
      } else {
        await disciplinaService.create(formData);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar disciplina:', error);
      setError(
        error.message || 'Error al guardar la disciplina. Por favor, intente nuevamente.'
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
          label="Disciplina"
          name="disciplina"
          value={formData.disciplina}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.disciplina}
          helperText={errors.disciplina}
          inputProps={{ maxLength: 50 }}
          autoFocus
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

export default DisciplinaForm;

