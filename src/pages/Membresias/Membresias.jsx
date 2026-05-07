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
import * as membresiasService from '../../services/membresiasService';
import MembresiasTable from '../../components/membresias/MembresiasTable';
import MembreciaForm from '../../components/membresias/MembreciaForm';
import MembreciaDetailsModal from '../../components/membresias/MembreciaDetailsModal';
import MembresiasFilters from '../../components/membresias/MembresiasFilters';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import Pagination from '../../components/Pagination/Pagination';
import { getTodayLocalDate } from '../../utils/helpers';

function Membresias() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { membresias, loading, pagination, fetchMembresias, createMembrecia, updateMembrecia, deleteMembrecia, fetchMembreciaById } = useMembresias();
  const { tipos, fetchTipos } = useTipoMembresias();

  const [filters, setFilters] = React.useState({
    idAlumno: null,
    idTutor: null,
    estado: null,
    idTipoMembrecia: null,
    idDisciplina: null,
    idGrupo: null,
    fechaDesde: null,
    fechaHasta: null,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [loadingMembresiaCompleta, setLoadingMembresiaCompleta] = React.useState(false);
  const [detailDialog, setDetailDialog] = React.useState({ open: false, membresia: null, warning: null });
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, membresia: null });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [paginationState, setPaginationState] = React.useState({ page: 1, limit: 10 });

  React.useEffect(() => {
    fetchTipos();
  }, [fetchTipos]);

  React.useEffect(() => {
    loadMembresias(paginationState.page, paginationState.limit);
  }, [filters, paginationState.page, paginationState.limit]);

  const loadMembresias = async (page, limit) => {
    await fetchMembresias({ page, limit, ...filters });
  };

  const handlePageChange = (newPage) => {
    setPaginationState(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    const limitNum = parseInt(newLimit, 10);
    setPaginationState(prev => ({ ...prev, limit: limitNum, page: 1 }));
  };

  const handleOpenModal = async (membresia = null) => {
    if (membresia) {
      // Si se está editando, cargar la membresía completa para obtener los detalles de pago
      setLoadingMembresiaCompleta(true);
      try {
        const membresiaCompleta = await membresiasService.getCompletoById(membresia.id_membrecia);
        setEditingItem(membresiaCompleta || membresia);
      } catch (error) {
        console.error('Error al cargar membresía completa para edición:', error);
        // Si falla, usar la membresía básica
        setEditingItem(membresia);
      } finally {
        setLoadingMembresiaCompleta(false);
      }
    } else {
      setEditingItem(null);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleSuccess = async (formData) => {
    try {
      if (editingItem) {
        // Al editar, actualizar la membresía y los detalles de pago si se proporcionaron
        const membresiaData = {
          id_alumno: formData.id_alumno,
          id_tipo_membrecia: formData.id_tipo_membrecia,
          id_grupo: formData.id_grupo,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin || undefined,
          estado: formData.estado,
        };

        // Si hay detalles de pago en el formData, incluir el objeto pago para actualizar
        if (formData.pago && formData.pago.detalles && formData.pago.detalles.length > 0) {
          membresiaData.pago = {
            // Si existe un pago previo, incluir su ID para actualizarlo
            ...(editingItem.pago?.id_pago ? { id_pago: editingItem.pago.id_pago } : {}),
            fecha_pago: formData.pago.fecha_pago || formData.fecha_inicio,
            estado: formData.pago.estado || 'completo', // El estado debe ser: pendiente, parcial, completo, cancelado
            observaciones: formData.pago.observaciones || undefined,
            detalles: formData.pago.detalles.map(detalle => ({
              // Si el detalle tiene id_detalle_pago, incluirlo para actualizar existentes
              // Si no tiene ID, será un nuevo detalle que se creará
              ...(detalle.id_detalle_pago ? { id_detalle_pago: detalle.id_detalle_pago } : {}),
              metodo_pago: detalle.metodo_pago,
              monto_parcial: Number(detalle.monto_parcial),
              fecha_detalle: detalle.fecha_detalle,
              referencia_transferencia: detalle.referencia_transferencia || undefined,
            })),
          };
        } else if (editingItem.pago && editingItem.pago.id_pago) {
          // Si había un pago pero ahora no hay detalles, podríamos querer eliminarlo
          // Por ahora, solo actualizamos si hay detalles
          // Si quieres eliminar el pago cuando no hay detalles, descomenta esto:
          // membresiaData.pago = { id_pago: editingItem.pago.id_pago, eliminar: true };
        }

        // Log para debugging (puedes eliminarlo después)
        console.log('Datos a enviar al actualizar membresía:', JSON.stringify(membresiaData, null, 2));

        const response = await updateMembrecia(editingItem.id_membrecia, membresiaData);
        
        // Log de la respuesta del backend (puedes eliminarlo después)
        console.log('Respuesta del backend al actualizar:', JSON.stringify(response, null, 2));
        
        setSnackbar({ 
          open: true, 
          message: formData.pago && formData.pago.detalles && formData.pago.detalles.length > 0
            ? 'Membresía y detalles de pago actualizados correctamente'
            : 'Membresía actualizada correctamente', 
          severity: 'success' 
        });
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
      console.error('Detalles del error:', {
        message: error.message,
        stack: error.stack,
      });
      setSnackbar({ 
        open: true, 
        message: error.message || 'Error al guardar la membresía. Verifique la consola para más detalles.', 
        severity: 'error' 
      });
    }
  };

  const handleViewDetails = async (membresia) => {
    try {
      // Usar el endpoint completo para obtener toda la información relacionada
      const membresiaCompleta = await membresiasService.getCompletoById(membresia.id_membrecia);
      setDetailDialog({ 
        open: true, 
        membresia: membresiaCompleta || membresia,
        warning: null 
      });
    } catch (error) {
      console.error('Error al cargar detalles completos:', error);
      // Fallback: intentar cargar la membresía básica
      try {
        const membresiaBasica = await fetchMembreciaById(membresia.id_membrecia);
        setDetailDialog({ 
          open: true, 
          membresia: membresiaBasica || membresia,
          warning: 'No se pudo cargar la información completa. Se muestra información básica.'
        });
      } catch (fallbackError) {
        console.error('Error al cargar membresía básica:', fallbackError);
        // Si todo falla, mostrar al menos los datos que ya tenemos
        setDetailDialog({ 
          open: true, 
          membresia,
          warning: 'No se pudo cargar información adicional. Se muestra información disponible.'
        });
      }
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, membresia: null, warning: null });
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
        fecha_inicio: getTodayLocalDate(),
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
      idTutor: null,
      estado: null,
      idTipoMembrecia: null,
      idDisciplina: null,
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

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
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
            {loadingMembresiaCompleta ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MembreciaForm
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
                initialData={editingItem}
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles de la membresía */}
      <MembreciaDetailsModal
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        membresia={detailDialog.membresia}
        warning={detailDialog.warning}
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
