import React from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Paper,
  Typography,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';
import { validateDetallePago } from '../../utils/validators';

function DetallesPagoManager({ detalles = [], onChange, errors = {} }) {
  const formatDateForInput = (date) => {
    if (!date) return new Date().toISOString().split('T')[0];
    const d = new Date(date);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  };

  const [localDetalles, setLocalDetalles] = React.useState(() => {
    if (!detalles || !Array.isArray(detalles)) return [];
    return detalles.map(d => ({
      metodo_pago: d.metodo_pago || '',
      monto_parcial: d.monto_parcial || '',
      fecha_detalle: formatDateForInput(d.fecha_detalle),
      referencia_transferencia: d.referencia_transferencia || '',
    }));
  });

  React.useEffect(() => {
    if (detalles && Array.isArray(detalles)) {
      setLocalDetalles(detalles.map(d => ({
        metodo_pago: d.metodo_pago || '',
        monto_parcial: d.monto_parcial || '',
        fecha_detalle: formatDateForInput(d.fecha_detalle),
        referencia_transferencia: d.referencia_transferencia || '',
      })));
    }
  }, [detalles]);

  const metodosPago = [
    'Efectivo',
    'Transferencia',
    'Tarjeta de Débito',
    'Tarjeta de Crédito',
    'Cheque',
    'Otro',
  ];

  const handleAddDetalle = () => {
    const nuevoDetalle = {
      metodo_pago: '',
      monto_parcial: '',
      fecha_detalle: new Date().toISOString().split('T')[0],
      referencia_transferencia: '',
    };
    const updated = [...localDetalles, nuevoDetalle];
    setLocalDetalles(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleRemoveDetalle = (index) => {
    const updated = localDetalles.filter((_, i) => i !== index);
    setLocalDetalles(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleChangeDetalle = (index, field, value) => {
    const updated = localDetalles.map((detalle, i) => {
      if (i === index) {
        return {
          ...detalle,
          [field]: field === 'monto_parcial' ? (value === '' ? '' : Number(value)) : value,
        };
      }
      return detalle;
    });
    setLocalDetalles(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const validateDetalle = (detalle, index) => {
    return validateDetallePago(detalle);
  };

  const calcularTotal = () => {
    return localDetalles.reduce((sum, detalle) => {
      return sum + (Number(detalle.monto_parcial) || 0);
    }, 0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Detalles de Pago</Typography>
        </Box>
        {localDetalles.length > 0 && (
          <Typography variant="body1" fontWeight="bold" color="primary">
            Total: {formatCurrency(calcularTotal())}
          </Typography>
        )}
      </Box>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <Stack spacing={2}>
        {localDetalles.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No hay detalles de pago agregados.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Puede crear la membresía sin pago y agregarlo después, o hacer clic en "Agregar Detalle de Pago" para comenzar.
            </Typography>
          </Paper>
        ) : (
          localDetalles.map((detalle, index) => {
            const detalleErrors = validateDetalle(detalle, index);
            const hasErrors = Object.keys(detalleErrors).length > 0;

            return (
              <Paper key={index} sx={{ p: 2, bgcolor: hasErrors ? 'error.light' : 'background.paper' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Detalle {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveDetalle(index)}
                      aria-label="Eliminar detalle"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth required error={!!detalleErrors.metodo_pago}>
                      <InputLabel>Método de Pago</InputLabel>
                      <Select
                        value={detalle.metodo_pago}
                        onChange={(e) => handleChangeDetalle(index, 'metodo_pago', e.target.value)}
                        label="Método de Pago"
                      >
                        {metodosPago.map((metodo) => (
                          <MenuItem key={metodo} value={metodo}>
                            {metodo}
                          </MenuItem>
                        ))}
                      </Select>
                      {detalleErrors.metodo_pago && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                          {detalleErrors.metodo_pago}
                        </Typography>
                      )}
                    </FormControl>

                    <TextField
                      label="Monto Parcial"
                      type="number"
                      value={detalle.monto_parcial}
                      onChange={(e) => handleChangeDetalle(index, 'monto_parcial', e.target.value)}
                      required
                      fullWidth
                      error={!!detalleErrors.monto_parcial}
                      helperText={detalleErrors.monto_parcial}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Fecha del Detalle"
                      type="date"
                      value={detalle.fecha_detalle}
                      onChange={(e) => handleChangeDetalle(index, 'fecha_detalle', e.target.value)}
                      required
                      fullWidth
                      error={!!detalleErrors.fecha_detalle}
                      helperText={detalleErrors.fecha_detalle}
                      InputLabelProps={{ shrink: true }}
                    />

                    {detalle.metodo_pago === 'Transferencia' && (
                      <TextField
                        label="Referencia de Transferencia"
                        value={detalle.referencia_transferencia}
                        onChange={(e) => handleChangeDetalle(index, 'referencia_transferencia', e.target.value)}
                        fullWidth
                        placeholder="Número de referencia"
                      />
                    )}
                  </Stack>
                </Stack>
              </Paper>
            );
          })
        )}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddDetalle}
          fullWidth
        >
          Agregar Detalle de Pago
        </Button>
      </Stack>
    </Box>
  );
}

export default DetallesPagoManager;

