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

function PagosFilters({ filters, onFilterChange, onClearFilters }) {
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
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.tipo || ''}
                label="Tipo"
                onChange={(e) => handleChange('tipo', e.target.value || null)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="ingreso">Ingreso</MenuItem>
                <MenuItem value="egreso">Egreso</MenuItem>
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
                <MenuItem value="pagado">Pagado</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="vencido">Vencido</MenuItem>
                <MenuItem value="cancelado">Cancelado</MenuItem>
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

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Buscar en observaciones"
              value={filters.observaciones || ''}
              onChange={(e) => handleChange('observaciones', e.target.value || null)}
              placeholder="Buscar..."
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

export default PagosFilters;

