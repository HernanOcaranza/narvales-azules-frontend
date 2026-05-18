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
import { Clear as ClearIcon } from '@mui/icons-material';
import * as alumnoService from '../../services/alumnoService';
import * as grupoService from '../../services/grupoService';
import * as disciplinaService from '../../services/disciplinaService';
import * as tutorService from '../../services/tutorService';

function MembresiasFilters({ filters, onFilterChange, onClearFilters, tiposMembrecia = [] }) {
  const [alumnos, setAlumnos] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [tutores, setTutores] = React.useState([]);
  const [alumnoSearch, setAlumnoSearch] = React.useState('');
  const [tutorSearch, setTutorSearch] = React.useState('');
  const [loadingAlumnos, setLoadingAlumnos] = React.useState(false);
  const [loadingTutores, setLoadingTutores] = React.useState(false);

  React.useEffect(() => {
    loadGrupos();
    loadDisciplinas();
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

  React.useEffect(() => {
    if (tutorSearch && tutorSearch.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchTutores();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setTutores([]);
    }
  }, [tutorSearch]);

  const loadGrupos = async () => {
    try {
      const data = await grupoService.getAll();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar grupos:', err);
    }
  };

  const loadDisciplinas = async () => {
    try {
      const data = await disciplinaService.getAll();
      setDisciplinas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar disciplinas:', err);
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

  const searchTutores = async () => {
    setLoadingTutores(true);
    try {
      const data = await tutorService.searchByNombre(tutorSearch);
      setTutores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al buscar tutores:', err);
      setTutores([]);
    } finally {
      setLoadingTutores(false);
    }
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleDisciplinaChange = (value) => {
    handleChange('idDisciplina', value);
    handleChange('idGrupo', '');
  };

  const handleLimpiarFiltros = () => {
    onClearFilters();
    setAlumnoSearch('');
    setTutorSearch('');
  };

  const tieneFiltrosActivos = React.useMemo(() => {
    return filters.idAlumno || 
      filters.estado || 
      filters.idTipoMembrecia || 
      filters.idGrupo ||
      filters.idDisciplina ||
      filters.idTutor ||
      filters.fechaDesde || 
      filters.fechaHasta;
  }, [filters]);

  const gruposFiltrados = React.useMemo(() => {
    if (!filters.idDisciplina) return grupos;
    return grupos.filter(g => g.id_disciplina === parseInt(filters.idDisciplina, 10));
  }, [grupos, filters.idDisciplina]);

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              options={tutores}
              getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
              loading={loadingTutores}
              onInputChange={(e, newValue) => setTutorSearch(newValue)}
              onChange={(e, newValue) => handleChange('idTutor', newValue?.id_tutor || null)}
              value={tutores.find(t => t.id_tutor === filters.idTutor) || null}
              renderInput={(params) => (
                <TextField {...params} label="Buscar Tutor" placeholder="Escriba el nombre del tutor..." />
              )}
            />
          </Grid>

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
              <InputLabel>Disciplina</InputLabel>
              <Select
                value={filters.idDisciplina || ''}
                label="Disciplina"
                onChange={(e) => handleDisciplinaChange(e.target.value || null)}
              >
                <MenuItem value="">Todas</MenuItem>
                {disciplinas.map((disc) => (
                  <MenuItem key={disc.id_disciplina} value={disc.id_disciplina}>
                    {disc.disciplina}
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
                {gruposFiltrados.map((grupo) => (
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
            onClick={handleLimpiarFiltros}
            disabled={!tieneFiltrosActivos}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

export default MembresiasFilters;