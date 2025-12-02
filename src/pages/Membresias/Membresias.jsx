import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMembresias } from '../../hooks/useMembresias';
import { useTipoMembresias } from '../../hooks/useTipoMembresias';
import MembresiasTable from '../../components/membresias/MembresiasTable';
import MembreciaForm from '../../components/membresias/MembreciaForm';
import MembreciaDetailsModal from '../../components/membresias/MembreciaDetailsModal';
import MembresiasFilters from '../../components/membresias/MembresiasFilters';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';

function Membresias() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { membresias, loading, fetchMembresias, createMembrecia, updateMembrecia, deleteMembrecia, fetchMembreciaById } = useMembresias();
  const { tipos, fetchTipos } = useTipoMembresias();

  const [filters, setFilters] = React.useState({
    idAlumno: null,
    estado: null,
    idTipoMembrecia: null,
    idGrupo: null,
    fechaDesde: null,
    fechaHasta: null,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [detailDialog, setDetailDialog] = React.useState({ open: false, membresia: null });
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, membresia: null });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  React.useEffect(() => {
    fetchTipos();
  }, [fetchTipos]);

  React.useEffect(() => {
    loadMembresias();
  }, [filters]);

  const loadMembresias = async () => {
    await fetchMembresias(filters);
  };

  const handleOpenModal = (membresia = null) => {
    setEditingItem(membresia);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleSuccess = async (formData) => {
    try {
      if (editingItem) {
        // Al editar, solo actualizar la membresía (no modificar pagos desde aquí)
        // Limpiar datos de pago si vienen en formData (no se modifican en edición)
        const membresiaData = { ...formData };
        delete membresiaData.pago;
        await updateMembrecia(editingItem.id_membrecia, membresiaData);
        setSnackbar({ open: true, message: 'Membresía actualizada correctamente', severity: 'success' });
      } else {
        // Al crear, usar el nuevo formato de API que incluye el pago en el body
        // El backend creará la membresía y el pago en una transacción
        await createMembrecia(formData);
        setSnackbar({ 
          open: true, 
          message: formData.pago && formData.pago.detalles && formData.pago.detalles.length > 0
            ? 'Membresía creada correctamente con pago' 
            : 'Membresía creada correctamente', 
          severity: 'success' 
        });
      }
      handleCloseModal();
      await loadMembresias();
    } catch (error) {
      console.error('Error completo:', error);
      setSnackbar({ open: true, message: error.message || 'Error al guardar la membresía', severity: 'error' });
    }
  };

  const handleViewDetails = async (membresia) => {
    try {
      const membresiaCompleta = await fetchMembreciaById(membresia.id_membrecia);
      setDetailDialog({ open: true, membresia: membresiaCompleta || membresia });
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setDetailDialog({ open: true, membresia });
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, membresia: null });
  };

  const handleDeleteClick = (membresia) => {
    setDeleteDialog({ open: true, membresia });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, membresia: null });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteMembrecia(deleteDialog.membresia.id_membrecia);
      setSnackbar({ open: true, message: 'Membresía eliminada correctamente', severity: 'success' });
      setDeleteDialog({ open: false, membresia: null });
      await loadMembresias();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al eliminar la membresía', severity: 'error' });
    }
  };

  const handleRenew = async (membresia) => {
    try {
      // Renovar creando una nueva membresía basada en la anterior
      const nuevaMembresia = {
        id_alumno: membresia.id_alumno,
        id_tipo_membrecia: membresia.id_tipo_membrecia,
        id_grupo: membresia.id_grupo,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        estado: 'activa',
      };
      await createMembrecia(nuevaMembresia);
      setSnackbar({ open: true, message: 'Membresía renovada correctamente', severity: 'success' });
      await loadMembresias();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al renovar la membresía', severity: 'error' });
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      idAlumno: null,
      estado: null,
      idTipoMembrecia: null,
      idGrupo: null,
      fechaDesde: null,
      fechaHasta: null,
    });
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
          Nueva Membresía
        </Button>
      </Box>

      <MembresiasFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        tiposMembrecia={tipos}
      />

      <MembresiasTable
        membresias={membresias}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        onRenew={handleRenew}
        isMobile={isMobile}
      />

      {/* Modal para crear/editar membresía */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Membresía' : 'Crear Nueva Membresía'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <MembreciaForm
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
              initialData={editingItem}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles de la membresía */}
      <MembreciaDetailsModal
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        membresia={detailDialog.membresia}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="la membresía"
        itemName={`#${deleteDialog.membresia?.id_membrecia || ''}`}
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

export default Membresias;
