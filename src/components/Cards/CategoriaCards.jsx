import React from 'react';
import {
  Stack,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

/**
 * Componente de tarjetas para mostrar categorías en móvil
 * @param {Array} categorias - Lista de categorías
 * @param {function} onEdit - Función para editar una categoría
 * @param {function} onDelete - Función para eliminar una categoría
 */
function CategoriaCards({ categorias, onEdit, onDelete }) {
  if (categorias.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
        No hay categorías registradas
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {categorias.map((categoria) => (
        <Card key={categoria.id_categoria} variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {categoria.categoria}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(categoria)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(categoria)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

export default CategoriaCards;

