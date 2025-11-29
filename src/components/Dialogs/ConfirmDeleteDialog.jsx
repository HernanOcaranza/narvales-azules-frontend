import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

/**
 * Componente reutilizable para confirmar eliminación
 * @param {boolean} open - Estado de apertura del diálogo
 * @param {function} onClose - Función para cerrar el diálogo
 * @param {function} onConfirm - Función para confirmar la eliminación
 * @param {string} title - Título del elemento a eliminar (ej: "categoría", "disciplina")
 * @param {string} itemName - Nombre del elemento específico a eliminar
 */
function ConfirmDeleteDialog({ open, onClose, onConfirm, title, itemName }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Eliminación</DialogTitle>
      <DialogContent>
        <Typography>
          ¿Está seguro de que desea eliminar {title} "{itemName}"?
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDeleteDialog;

