import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { useTipoMembresias } from '../../hooks/useTipoMembresias';
import { formatCurrency } from '../../utils/helpers';

function TipoMembreciaSelector({ value, onChange, error, required = true }) {
  const { tipos, loading, fetchTipos, getPrecioVigente } = useTipoMembresias();
  const [precioVigente, setPrecioVigente] = React.useState(null);
  const [loadingPrecio, setLoadingPrecio] = React.useState(false);

  React.useEffect(() => {
    fetchTipos();
  }, [fetchTipos]);

  React.useEffect(() => {
    if (value) {
      loadPrecioVigente(value);
    } else {
      setPrecioVigente(null);
    }
  }, [value]);

  const loadPrecioVigente = async (idTipoMembrecia) => {
    setLoadingPrecio(true);
    try {
      const precio = await getPrecioVigente(idTipoMembrecia);
      setPrecioVigente(precio);
    } catch (err) {
      console.error('Error al cargar precio vigente:', err);
      setPrecioVigente(null);
    } finally {
      setLoadingPrecio(false);
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <Box>
      <FormControl fullWidth required={required} error={!!error}>
        <InputLabel>Tipo de Membresía</InputLabel>
        <Select value={value || ''} label="Tipo de Membresía" onChange={handleChange}>
          <MenuItem value="">Seleccione un tipo</MenuItem>
          {loading ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            tipos.map((tipo) => (
              <MenuItem key={tipo.id_tipo_membrecia} value={tipo.id_tipo_membrecia}>
                {tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}
              </MenuItem>
            ))
          )}
        </Select>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {error}
          </Alert>
        )}
      </FormControl>

      {value && (
        <Box sx={{ mt: 2 }}>
          {loadingPrecio ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Cargando precio...
              </Typography>
            </Box>
          ) : precioVigente ? (
            <Alert severity="info" icon={false}>
              <Typography variant="body2">
                <strong>Precio vigente:</strong> {formatCurrency(precioVigente.precio || precioVigente.monto || 0)}
                {(precioVigente.fecha_inicio_vigencia || precioVigente.fecha_inicio) && (
                  <span> (Vigente desde {new Date(precioVigente.fecha_inicio_vigencia || precioVigente.fecha_inicio).toLocaleDateString()})</span>
                )}
              </Typography>
            </Alert>
          ) : (
            <Alert severity="warning" icon={false}>
              <Typography variant="body2">No hay precio vigente para este tipo de membresía</Typography>
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}

export default TipoMembreciaSelector;

