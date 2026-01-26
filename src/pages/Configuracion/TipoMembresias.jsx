import React from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import TipoMembresiaForm from '../../components/Forms/TipoMembresiaForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';

function TipoMembresias() {
  const [tipos, setTipos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadTipos();
  }, []);

  const loadTipos = async () => {
    setLoading(true);
    try {
      const data = await tipoMembresiasService.getAll();
      setTipos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar tipos de membresía:', error);
      setTipos([]);
      setSnackbar({
        open: true,
        message: 'Error al cargar los tipos de membresía. Por favor, intente nuevamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    loadTipos();
    setSnackbar({
      open: true,
      message: editingItem ? 'Tipo de membresía actualizado correctamente' : 'Tipo de membresía creado correctamente',
      severity: 'success',
    });
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await tipoMembresiasService.deleteById(deleteDialog.item.id_tipo_membrecia);
        setDeleteDialog({ open: false, item: null });
        loadTipos();
        setSnackbar({
          open: true,
          message: 'Tipo de membresía eliminado correctamente',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error al eliminar tipo de membresía:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Error al eliminar el tipo de membresía. Por favor, intente nuevamente.',
          severity: 'error',
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Nuevo Tipo de Membresía
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {tipos.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay tipos de membresía registrados
            </Typography>
          ) : (
            tipos.map((tipo) => (
              <Card key={tipo.id_tipo_membrecia}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}
                  </Typography>
                  {tipo.frecuencia_semanal !== null && tipo.frecuencia_semanal !== undefined && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Frecuencia semanal: {tipo.frecuencia_semanal} veces
                    </Typography>
                  )}
                  {tipo.duracion_dias !== null && tipo.duracion_dias !== undefined && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Duración: {tipo.duracion_dias} días
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenModal(tipo)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(tipo)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tipo de Membresía</TableCell>
                <TableCell>Frecuencia Semanal</TableCell>
                <TableCell>Duración (días)</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tipos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay tipos de membresía registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tipos.map((tipo) => (
                  <TableRow key={tipo.id_tipo_membrecia} hover>
                    <TableCell>{tipo.id_tipo_membrecia}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}
                      </Typography>
                    </TableCell>
                    <TableCell>{tipo.frecuencia_semanal !== null && tipo.frecuencia_semanal !== undefined ? tipo.frecuencia_semanal : '-'}</TableCell>
                    <TableCell>{tipo.duracion_dias !== null && tipo.duracion_dias !== undefined ? tipo.duracion_dias : '-'}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenModal(tipo)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(tipo)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para crear/editar tipo de membresía */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Tipo de Membresía' : 'Nuevo Tipo de Membresía'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TipoMembresiaForm
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
              initialData={editingItem}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="el tipo de membresía"
        itemName={deleteDialog.item?.tipo_membrecia || `#${deleteDialog.item?.id_tipo_membrecia || ''}`}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TipoMembresias;

