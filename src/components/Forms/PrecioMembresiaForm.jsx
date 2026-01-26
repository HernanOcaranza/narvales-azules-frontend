import React from 'react';
import {
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import * as precioMembresiasService from '../../services/precioMembresiasService';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';

function PrecioMembresiaForm({ onSuccess, onCancel, initialData = null }) {

  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_inicio_vigencia: formatDateForInput(initialData.fecha_inicio_vigencia || initialData.fecha_inicio),
        fecha_fin_vigencia: formatDateForInput(initialData.fecha_fin_vigencia || initialData.fecha_fin),
        precio: initialData.precio || initialData.monto || '',
      };
    }
    return {
      id_tipo_membrecia: '',
      precio: '',
      fecha_inicio_vigencia: getTodayLocalDate(),
      fecha_fin_vigencia: '',
    };
  });

  const [tiposMembrecia, setTiposMembrecia] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    loadTiposMembrecia();
  }, []);

  const loadTiposMembrecia = async () => {
    try {
      const data = await tipoMembresiasService.getAll();
      setTiposMembrecia(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar tipos de membresía:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'precio' ? (value === '' ? '' : Number(value)) : value,
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

    if (!formData.id_tipo_membrecia) {
      newErrors.id_tipo_membrecia = 'El tipo de membresía es requerido';
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.fecha_inicio_vigencia) {
      newErrors.fecha_inicio_vigencia = 'La fecha de inicio de vigencia es requerida';
    } else {
      const fechaInicio = new Date(formData.fecha_inicio_vigencia);
      if (isNaN(fechaInicio.getTime())) {
        newErrors.fecha_inicio_vigencia = 'La fecha de inicio de vigencia no es válida';
      }
    }

    if (formData.fecha_fin_vigencia) {
      const fechaInicio = new Date(formData.fecha_inicio_vigencia);
      const fechaFin = new Date(formData.fecha_fin_vigencia);
      
      if (isNaN(fechaFin.getTime())) {
        newErrors.fecha_fin_vigencia = 'La fecha de fin de vigencia no es válida';
      } else if (fechaFin < fechaInicio) {
        newErrors.fecha_fin_vigencia = 'La fecha de fin de vigencia debe ser mayor o igual a la fecha de inicio';
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
      // Preparar datos para enviar al backend
      const dataToSend = {
        id_tipo_membrecia: formData.id_tipo_membrecia,
        precio: formData.precio,
        fecha_inicio_vigencia: formData.fecha_inicio_vigencia,
        fecha_fin_vigencia: formData.fecha_fin_vigencia || null,
      };

      if (initialData && initialData.id_precio_membrecia) {
        await precioMembresiasService.update(initialData.id_precio_membrecia, dataToSend);
      } else {
        await precioMembresiasService.create(dataToSend);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar precio de membresía:', error);
      setError(
        error.message || 'Error al guardar el precio de membresía. Por favor, intente nuevamente.'
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

        <FormControl fullWidth required error={!!errors.id_tipo_membrecia}>
          <InputLabel>Tipo de Membresía</InputLabel>
          <Select
            name="id_tipo_membrecia"
            value={formData.id_tipo_membrecia}
            onChange={handleChange}
            label="Tipo de Membresía"
            disabled={!!initialData} // No permitir cambiar el tipo al editar
          >
            {tiposMembrecia.map((tipo) => (
              <MenuItem key={tipo.id_tipo_membrecia} value={tipo.id_tipo_membrecia}>
                {tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}
              </MenuItem>
            ))}
          </Select>
          {errors.id_tipo_membrecia && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.id_tipo_membrecia}
            </Alert>
          )}
        </FormControl>

        <TextField
          label="Precio"
          name="precio"
          type="number"
          value={formData.precio}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.precio}
          helperText={errors.precio}
          inputProps={{ min: 0, step: 0.01 }}
          placeholder="0.00"
        />

        <TextField
          label="Fecha de Inicio de Vigencia"
          name="fecha_inicio_vigencia"
          type="date"
          value={formData.fecha_inicio_vigencia}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.fecha_inicio_vigencia}
          helperText={errors.fecha_inicio_vigencia}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Fecha de Fin de Vigencia (Opcional)"
          name="fecha_fin_vigencia"
          type="date"
          value={formData.fecha_fin_vigencia}
          onChange={handleChange}
          fullWidth
          error={!!errors.fecha_fin_vigencia}
          helperText={errors.fecha_fin_vigencia || 'Dejar vacío para precio vigente indefinido'}
          InputLabelProps={{ shrink: true }}
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

export default PrecioMembresiaForm;

