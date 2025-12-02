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
import { validateDetallePago } from '../../utils/validators';

function DetallePagoForm({ onSuccess, onCancel, initialData = null, pagoId }) {
  const formatDateForInput = (date) => {
    if (!date) return new Date().toISOString().split('T')[0];
    const d = new Date(date);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_detalle: formatDateForInput(initialData.fecha_detalle),
        monto_parcial: initialData.monto_parcial || '',
      };
    }
    return {
      metodo_pago: '',
      monto_parcial: '',
      fecha_detalle: new Date().toISOString().split('T')[0],
      referencia_transferencia: '',
      id_pago: pagoId,
    };
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'monto_parcial' ? (value === '' ? '' : Number(value)) : value,
    }));
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

    const validationErrors = validateDetallePago(formData);
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
      console.error('Error al guardar detalle:', err);
      setError(err.message || 'Error al guardar el detalle. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const metodosPago = [
    'Efectivo',
    'Transferencia',
    'Tarjeta de Débito',
    'Tarjeta de Crédito',
    'Cheque',
    'Otro',
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth required error={!!errors.metodo_pago}>
          <InputLabel>Método de Pago</InputLabel>
          <Select
            name="metodo_pago"
            value={formData.metodo_pago}
            onChange={handleChange}
            label="Método de Pago"
          >
            {metodosPago.map((metodo) => (
              <MenuItem key={metodo} value={metodo}>
                {metodo}
              </MenuItem>
            ))}
          </Select>
          {errors.metodo_pago && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.metodo_pago}
            </Alert>
          )}
        </FormControl>

        <TextField
          label="Monto Parcial"
          name="monto_parcial"
          type="number"
          value={formData.monto_parcial}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.monto_parcial}
          helperText={errors.monto_parcial}
          inputProps={{ min: 0, step: 0.01 }}
        />

        <TextField
          label="Fecha del Detalle"
          name="fecha_detalle"
          type="date"
          value={formData.fecha_detalle}
          onChange={handleChange}
          required
          fullWidth
          error={!!errors.fecha_detalle}
          helperText={errors.fecha_detalle}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Referencia de Transferencia"
          name="referencia_transferencia"
          value={formData.referencia_transferencia}
          onChange={handleChange}
          fullWidth
          placeholder="Opcional"
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

export default DetallePagoForm;

