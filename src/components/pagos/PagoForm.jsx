import React from 'react';
import {
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import * as empleadoService from '../../services/empleadoService';
import { validatePago } from '../../utils/validators';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';

function PagoForm({ onSuccess, onCancel, initialData = null }) {

  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_pago: formatDateForInput(initialData.fecha_pago),
        id_empleado: initialData.id_empleado || null,
      };
    }
    return {
      tipo: '',
      fecha_pago: getTodayLocalDate(),
      estado: 'pendiente',
      observaciones: '',
      id_empleado: null,
    };
  });

  const [empleados, setEmpleados] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  // Cargar empleados cuando el tipo es egreso
  React.useEffect(() => {
    if (formData.tipo === 'egreso') {
      loadEmpleados();
    }
  }, [formData.tipo]);

  const loadEmpleados = async () => {
    try {
      const data = await empleadoService.getAll();
      setEmpleados(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      // Si cambia el tipo a ingreso, limpiar empleado
      if (name === 'tipo' && value === 'ingreso') {
        newData.id_empleado = null;
      }
      
      return newData;
    });
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationErrors = validatePago(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (onSuccess) {
        await onSuccess(formData);
      }
    } catch (err) {
      console.error('Error al guardar pago:', err);
      setError(err.message || 'Error al guardar el pago. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const estados = ['pendiente', 'pagado', 'vencido', 'cancelado'];

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth required error={!!errors.tipo}>
          <InputLabel>Tipo de Pago</InputLabel>
          <Select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            label="Tipo de Pago"
          >
            <MenuItem value="ingreso">Ingreso</MenuItem>
            <MenuItem value="egreso">Egreso</MenuItem>
          </Select>
          {errors.tipo && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.tipo}
            </Alert>
          )}
        </FormControl>

        {formData.tipo === 'egreso' && (
          <FormControl fullWidth required error={!!errors.id_empleado}>
            <InputLabel>Empleado</InputLabel>
            <Select
              name="id_empleado"
              value={formData.id_empleado || ''}
              onChange={handleChange}
              label="Empleado"
            >
              {empleados.map((empleado) => (
                <MenuItem key={empleado.id_empleado} value={empleado.id_empleado}>
                  {empleado.nombre} {empleado.apellido}
                </MenuItem>
              ))}
            </Select>
            {errors.id_empleado && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {errors.id_empleado}
              </Alert>
            )}
          </FormControl>
        )}

        <TextField
          label="Fecha de Pago"
          name="fecha_pago"
          type="date"
          value={formData.fecha_pago}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.fecha_pago}
          helperText={errors.fecha_pago}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth required error={!!errors.estado}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            label="Estado"
          >
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {errors.estado && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.estado}
            </Alert>
          )}
        </FormControl>

        <TextField
          label="Observaciones"
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          placeholder="Observaciones adicionales..."
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

export default PagoForm;

