import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
  Grid,
  Autocomplete,
} from '@mui/material';
import { FilterList as FilterListIcon, Clear as ClearIcon } from '@mui/icons-material';
import * as alumnoService from '../../services/alumnoService';
import * as grupoService from '../../services/grupoService';

function MembresiasFilters({ filters, onFilterChange, onClearFilters, tiposMembrecia = [] }) {
  const [alumnos, setAlumnos] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [alumnoSearch, setAlumnoSearch] = React.useState('');
  const [loadingAlumnos, setLoadingAlumnos] = React.useState(false);

  React.useEffect(() => {
    loadGrupos();
  }, []);

  React.useEffect(() => {
    if (alumnoSearch && alumnoSearch.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchAlumnos();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setAlumnos([]);
    }
  }, [alumnoSearch]);

  const loadGrupos = async () => {
    try {
      const data = await grupoService.getAll();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar grupos:', err);
    }
  };

  const searchAlumnos = async () => {
    setLoadingAlumnos(true);
    try {
      const data = await alumnoService.searchByNombre(alumnoSearch);
      setAlumnos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al buscar alumnos:', err);
      setAlumnos([]);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          <strong>Filtros</strong>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              options={alumnos}
              getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
              loading={loadingAlumnos}
              onInputChange={(e, newValue) => setAlumnoSearch(newValue)}
              onChange={(e, newValue) => handleChange('idAlumno', newValue?.id_alumno || null)}
              value={alumnos.find(a => a.id_alumno === filters.idAlumno) || null}
              renderInput={(params) => (
                <TextField {...params} label="Buscar Alumno" placeholder="Escriba para buscar..." />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.estado || ''}
                label="Estado"
                onChange={(e) => handleChange('estado', e.target.value || null)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="activa">Activa</MenuItem>
                <MenuItem value="vencida">Vencida</MenuItem>
                <MenuItem value="suspendida">Suspendida</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Membresía</InputLabel>
              <Select
                value={filters.idTipoMembrecia || ''}
                label="Tipo de Membresía"
                onChange={(e) => handleChange('idTipoMembrecia', e.target.value || null)}
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposMembrecia.map((tipo) => (
                  <MenuItem key={tipo.id_tipo_membrecia} value={tipo.id_tipo_membrecia}>
                    {tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Grupo</InputLabel>
              <Select
                value={filters.idGrupo || ''}
                label="Grupo"
                onChange={(e) => handleChange('idGrupo', e.target.value || null)}
              >
                <MenuItem value="">Todos</MenuItem>
                {grupos.map((grupo) => (
                  <MenuItem key={grupo.id_grupo} value={grupo.id_grupo}>
                    {grupo.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Fecha Desde"
              type="date"
              value={filters.fechaDesde || ''}
              onChange={(e) => handleChange('fechaDesde', e.target.value || null)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Fecha Hasta"
              type="date"
              value={filters.fechaHasta || ''}
              onChange={(e) => handleChange('fechaHasta', e.target.value || null)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MembresiasFilters;

