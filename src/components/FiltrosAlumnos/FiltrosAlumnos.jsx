import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Chip, Stack } from '@mui/material';
import { getEstadoMembresia } from '../../utils/membresiaHelpers';

/**
 * Componente de filtros para la lista de alumnos
 * @param {object} props
 * @param {array} props.alumnos - Lista completa de alumnos
 * @param {array} props.estadosSeleccionados - Estados de membresía seleccionados para filtrar
 * @param {function} props.onEstadosChange - Callback cuando cambian los estados seleccionados
 * @param {string} props.orden - Orden actual ('asc' | 'desc')
 * @param {function} props.onOrdenChange - Callback cuando cambia el orden
 */
export const FiltrosAlumnos = ({
  alumnos = [],
  estadosSeleccionados = [],
  onEstadosChange,
  orden = 'asc',
  onOrdenChange,
}) => {
  // Obtener todos los estados únicos de los alumnos
  const estadosDisponibles = React.useMemo(() => {
    const estadosSet = new Set();
    alumnos.forEach(alumno => {
      const estado = getEstadoMembresia(alumno);
      estadosSet.add(estado.tipo);
    });
    return Array.from(estadosSet);
  }, [alumnos]);

  // Mapeo de estados a labels
  const estadoLabels = {
    'sin_membresia': 'Sin Membresía',
    'activa_completa': 'Activa - Pagada',
    'activa_parcial': 'Activa - Pago Incompleto',
    'activa_pendiente': 'Activa - Sin Pagar',
    'vencida': 'Membresía Vencida',
    'suspendida': 'Membresía Suspendida',
    'cancelada': 'Membresía Cancelada',
  };

  const handleEstadoToggle = (estado) => {
    if (estadosSeleccionados.includes(estado)) {
      onEstadosChange(estadosSeleccionados.filter(e => e !== estado));
    } else {
      onEstadosChange([...estadosSeleccionados, estado]);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        {/* Filtro por estados */}
        <FormControl size="small" sx={{ minWidth: 200, flexGrow: 1 }}>
          <InputLabel>Filtrar por Estado</InputLabel>
          <Select
            multiple
            value={estadosSeleccionados}
            onChange={(e) => onEstadosChange(e.target.value)}
            label="Filtrar por Estado"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.length === 0 ? (
                  <Chip label="Todos" size="small" />
                ) : (
                  selected.map((estado) => (
                    <Chip
                      key={estado}
                      label={estadoLabels[estado] || estado}
                      size="small"
                    />
                  ))
                )}
              </Box>
            )}
          >
            {estadosDisponibles.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estadoLabels[estado] || estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Ordenamiento */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Ordenar por Estado</InputLabel>
          <Select
            value={orden}
            onChange={(e) => onOrdenChange(e.target.value)}
            label="Ordenar por Estado"
          >
            <MenuItem value="asc">Prioridad (Mayor primero)</MenuItem>
            <MenuItem value="desc">Prioridad (Menor primero)</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Chips de estados seleccionados */}
      {estadosSeleccionados.length > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {estadosSeleccionados.map((estado) => (
            <Chip
              key={estado}
              label={estadoLabels[estado] || estado}
              onDelete={() => handleEstadoToggle(estado)}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FiltrosAlumnos;
