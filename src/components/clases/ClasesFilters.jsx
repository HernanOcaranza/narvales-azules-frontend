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
} from '@mui/material';
import { FilterList as FilterListIcon, Clear as ClearIcon } from '@mui/icons-material';
import * as grupoService from '../../services/grupoService';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';

function ClasesFilters({ filters, onFilterChange, onClearFilters }) {
  const [grupos, setGrupos] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);

  React.useEffect(() => {
    loadGrupos();
    loadDisciplinas();
    loadCategorias();
  }, []);

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

  const loadCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleDisciplinaChange = (value) => {
    handleChange('idDisciplina', value);
    handleChange('idGrupo', '');
    handleChange('idCategoria', '');
  };

  const handleLimpiarFiltros = () => {
    onClearFilters();
  };

  const tieneFiltrosActivos = React.useMemo(() => {
    return filters.idGrupo || 
      filters.idDisciplina ||
      filters.idCategoria ||
      filters.fechaDesde || 
      filters.fechaHasta ||
      filters.estado;
  }, [filters]);

  const gruposFiltrados = React.useMemo(() => {
    let result = grupos;
    if (filters.idDisciplina) {
      result = result.filter(g => g.id_disciplina === parseInt(filters.idDisciplina, 10));
    }
    if (filters.idCategoria) {
      result = result.filter(g => g.id_categoria === parseInt(filters.idCategoria, 10));
    }
    return result;
  }, [grupos, filters.idDisciplina, filters.idCategoria]);

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          <strong>Filtros</strong>
        </Box>
        
        <Grid container spacing={2}>
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
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.idCategoria || ''}
                label="Categoría"
                onChange={(e) => handleChange('idCategoria', e.target.value || null)}
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

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.estado || ''}
                label="Estado"
                onChange={(e) => handleChange('estado', e.target.value || null)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="realizada">Realizada</MenuItem>
                <MenuItem value="suspendida">Suspendida</MenuItem>
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

export default ClasesFilters;