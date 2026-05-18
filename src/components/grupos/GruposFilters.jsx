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
import { Clear as ClearIcon } from '@mui/icons-material';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';

function GruposFilters({ filters, onFilterChange, onClearFilters }) {
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);

  React.useEffect(() => {
    loadDisciplinas();
    loadCategorias();
  }, []);

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
    handleChange('idCategoria', '');
  };

  const handleLimpiarFiltros = () => {
    onClearFilters();
  };

  const tieneFiltrosActivos = React.useMemo(() => {
    return filters.idDisciplina || 
      filters.idCategoria ||
      filters.estado !== '' ||
      filters.nombre;
  }, [filters]);

  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Buscar por nombre"
              placeholder="Nombre del grupo..."
              value={filters.nombre || ''}
              onChange={(e) => handleChange('nombre', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
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
            <FormControl fullWidth size="small">
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
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.estado !== undefined ? filters.estado : ''}
                label="Estado"
                onChange={(e) => handleChange('estado', e.target.value || '')}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">Activo</MenuItem>
                <MenuItem value="0">Inactivo</MenuItem>
              </Select>
            </FormControl>
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

export default GruposFilters;