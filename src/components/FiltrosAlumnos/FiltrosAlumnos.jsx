import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  TextField,
  Button,
  Grid,
  Autocomplete,
} from '@mui/material';
import { FilterList as FilterListIcon, Clear as ClearIcon } from '@mui/icons-material';
import { getEstadoMembresia } from '../../utils/membresiaHelpers';
import * as categoriaService from '../../services/categoriaService';
import * as condicionService from '../../services/condicionService';
import * as tutorService from '../../services/tutorService';

export const FiltrosAlumnos = ({
  alumnos = [],
  estadosSeleccionados = [],
  onEstadosChange,
  orden = 'asc',
  onOrdenChange,
  filtrosAdicionales = {},
  onFiltrosChange = () => {},
}) => {
  const [categorias, setCategorias] = React.useState([]);
  const [condiciones, setCondiciones] = React.useState([]);
  const [tutores, setTutores] = React.useState([]);
  const [tutorSearch, setTutorSearch] = React.useState('');
  const [loadingTutores, setLoadingTutores] = React.useState(false);

  React.useEffect(() => {
    loadCategorias();
    loadCondiciones();
  }, []);

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

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const loadCondiciones = async () => {
    try {
      const data = await condicionService.getAll();
      setCondiciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar condiciones:', err);
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

  const estadosDisponibles = React.useMemo(() => {
    const estadosSet = new Set();
    alumnos.forEach(alumno => {
      const estado = getEstadoMembresia(alumno);
      estadosSet.add(estado.tipo);
    });
    return Array.from(estadosSet);
  }, [alumnos]);

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

  const handleFiltroChange = (field, value) => {
    onFiltrosChange({ ...filtrosAdicionales, [field]: value });
  };

  const handleLimpiarFiltros = () => {
    onEstadosChange([]);
    onOrdenChange('asc');
    onFiltrosChange({
      tutor: null,
      idCategoria: null,
      idCondicion: null,
      estado: '',
      certificado: '',
    });
    setTutorSearch('');
  };

  const tieneFiltrosActivos = React.useMemo(() => {
    return estadosSeleccionados.length > 0 ||
      filtrosAdicionales.tutor ||
      filtrosAdicionales.idCategoria ||
      filtrosAdicionales.idCondicion ||
      filtrosAdicionales.estado ||
      filtrosAdicionales.certificado ||
      orden !== 'asc';
  }, [estadosSeleccionados, filtrosAdicionales, orden]);

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
              options={tutores}
              getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
              loading={loadingTutores}
              onInputChange={(e, newValue) => setTutorSearch(newValue)}
              onChange={(e, newValue) => handleFiltroChange('tutor', newValue || null)}
              value={tutores.find(t => t.id_tutor === filtrosAdicionales.tutor?.id_tutor) || null}
              renderInput={(params) => (
                <TextField {...params} label="Buscar Tutor" placeholder="Escriba el nombre del tutor..." />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filtrosAdicionales.idCategoria || ''}
                onChange={(e) => handleFiltroChange('idCategoria', e.target.value || null)}
                label="Categoría"
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map((cat) => (
                  <MenuItem key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Condición</InputLabel>
              <Select
                value={filtrosAdicionales.idCondicion || ''}
                onChange={(e) => handleFiltroChange('idCondicion', e.target.value || null)}
                label="Condición"
              >
                <MenuItem value="">Todas</MenuItem>
                {condiciones.map((cond) => (
                  <MenuItem key={cond.id_condicion} value={cond.id_condicion}>
                    {cond.condicion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado Alumno</InputLabel>
              <Select
                value={filtrosAdicionales.estado || ''}
                onChange={(e) => handleFiltroChange('estado', e.target.value || '')}
                label="Estado Alumno"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="0">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Certificado Médico</InputLabel>
              <Select
                value={filtrosAdicionales.certificado || ''}
                onChange={(e) => handleFiltroChange('certificado', e.target.value || '')}
                label="Certificado Médico"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">Con Certificado</MenuItem>
                <MenuItem value="0">Sin Certificado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filtrar por Estado Membresía</InputLabel>
              <Select
                multiple
                value={estadosSeleccionados}
                onChange={(e) => onEstadosChange(e.target.value)}
                label="Filtrar por Estado Membresía"
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
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
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
          </Grid>
        </Grid>

        {estadosSeleccionados.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
};

export default FiltrosAlumnos;