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
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DIAS_SEMANA } from '../../utils/constants';

function HorariosManager({ horarios = [], onChange, errors = {} }) {
  const limpiarHorario = React.useCallback((horario) => {
    // Asegurar que solo retornamos datos serializables
    return {
      id_grupo_horario: horario.id_grupo_horario,
      id_grupo: horario.id_grupo,
      dia_semana: horario.dia_semana,
      hora_inicio: horario.hora_inicio,
      hora_fin: horario.hora_fin,
      activo: horario.activo,
    };
  }, []);

  const limpiarHorarios = React.useCallback((horariosArray) => {
    if (!horariosArray || !Array.isArray(horariosArray)) return [];
    return horariosArray.map(limpiarHorario);
  }, [limpiarHorario]);

  const [localHorarios, setLocalHorarios] = React.useState(() => {
    if (!horarios || !Array.isArray(horarios)) return [];
    return horarios.map(h => ({
      id_grupo_horario: h.id_grupo_horario,
      id_grupo: h.id_grupo,
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      activo: h.activo,
    }));
  });

  React.useEffect(() => {
    setLocalHorarios(limpiarHorarios(horarios));
  }, [horarios, limpiarHorarios]);

  const handleAddHorario = () => {
    const nuevoHorario = {
      dia_semana: 1, // Lunes por defecto
      hora_inicio: '10:00',
      hora_fin: '11:00',
      activo: 1,
    };
    const updated = [...localHorarios, nuevoHorario];
    setLocalHorarios(updated);
    if (onChange) {
      // Limpiar los horarios antes de pasarlos
      onChange(updated.map(limpiarHorario));
    }
  };

  const handleRemoveHorario = (index) => {
    const updated = localHorarios.filter((_, i) => i !== index);
    setLocalHorarios(updated);
    if (onChange) {
      // Limpiar los horarios antes de pasarlos
      onChange(updated.map(limpiarHorario));
    }
  };

  const handleChangeHorario = (index, field, value) => {
    const updated = localHorarios.map((horario, i) => {
      if (i === index) {
        return {
          ...horario,
          [field]: field === 'activo' ? (value ? 1 : 0) : value,
        };
      }
      return horario;
    });
    setLocalHorarios(updated);
    if (onChange) {
      // Limpiar los horarios antes de pasarlos
      onChange(updated.map(limpiarHorario));
    }
  };

  const validateHorario = (horario, index) => {
    const errors = {};
    
    if (horario.hora_inicio && horario.hora_fin) {
      const inicio = new Date(`2000-01-01T${horario.hora_inicio}:00`);
      const fin = new Date(`2000-01-01T${horario.hora_fin}:00`);
      
      if (fin <= inicio) {
        errors.hora_fin = 'La hora de fin debe ser mayor que la hora de inicio';
      }
    }

    // Validar duplicados (mismo día y misma hora)
    const duplicado = localHorarios.find((h, i) => 
      i !== index &&
      h.dia_semana === horario.dia_semana &&
      h.hora_inicio === horario.hora_inicio &&
      h.hora_fin === horario.hora_fin
    );
    
    if (duplicado) {
      errors.duplicado = 'Ya existe un horario con el mismo día y hora';
    }

    return errors;
  };

  const formatTime = (time) => {
    // Asegurar formato HH:MM
    if (!time) return '';
    if (time.length === 5) return time; // Ya está en formato HH:MM
    if (time.length === 8) return time.substring(0, 5); // Convertir HH:MM:SS a HH:MM
    return time;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ScheduleIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Horarios del Grupo</Typography>
      </Box>

      {errors.general && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.general}
        </Alert>
      )}

      <Stack spacing={2}>
        {localHorarios.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              No hay horarios configurados. Haga clic en "Agregar Horario" para comenzar.
            </Typography>
          </Paper>
        ) : (
          localHorarios.map((horario, index) => {
            const horarioErrors = validateHorario(horario, index);
            const hasErrors = Object.keys(horarioErrors).length > 0;

            return (
              <Paper key={index} sx={{ p: 2, bgcolor: hasErrors ? 'error.light' : 'background.paper' }}>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Horario {index + 1}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveHorario(index)}
                      aria-label="Eliminar horario"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    {/* Día de la semana */}
                    <FormControl fullWidth required>
                      <InputLabel>Día de la Semana</InputLabel>
                      <Select
                        value={horario.dia_semana ?? ''}
                        onChange={(e) => handleChangeHorario(index, 'dia_semana', Number(e.target.value))}
                        label="Día de la Semana"
                      >
                        {DIAS_SEMANA.map((dia, diaIndex) => (
                          <MenuItem key={diaIndex} value={diaIndex}>
                            {dia}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Hora de inicio */}
                    <TextField
                      label="Hora de Inicio"
                      type="time"
                      value={formatTime(horario.hora_inicio || '')}
                      onChange={(e) => handleChangeHorario(index, 'hora_inicio', e.target.value)}
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!horarioErrors.hora_fin}
                      helperText={horarioErrors.hora_fin}
                      inputProps={{
                        step: 300, // 5 minutos
                      }}
                    />

                    {/* Hora de fin */}
                    <TextField
                      label="Hora de Fin"
                      type="time"
                      value={formatTime(horario.hora_fin || '')}
                      onChange={(e) => handleChangeHorario(index, 'hora_fin', e.target.value)}
                      required
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      error={!!horarioErrors.hora_fin}
                      helperText={horarioErrors.hora_fin}
                      inputProps={{
                        step: 300, // 5 minutos
                      }}
                    />
                  </Stack>

                  {/* Activo/Inactivo */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={horario.activo === 1}
                        onChange={(e) => handleChangeHorario(index, 'activo', e.target.checked)}
                        color="primary"
                      />
                    }
                    label={horario.activo === 1 ? 'Activo' : 'Inactivo'}
                  />

                  {horarioErrors.duplicado && (
                    <Alert severity="warning" size="small">
                      {horarioErrors.duplicado}
                    </Alert>
                  )}
                </Stack>
              </Paper>
            );
          })
        )}

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddHorario}
          fullWidth
        >
          Agregar Horario
        </Button>
      </Stack>
    </Box>
  );
}

export default HorariosManager;

