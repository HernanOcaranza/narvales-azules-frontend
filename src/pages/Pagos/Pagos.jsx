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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Add as AddIcon, ExpandMore as ExpandMoreIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { usePagos } from '../../hooks/usePagos';
import PagosTable from '../../components/pagos/PagosTable';
import PagoForm from '../../components/pagos/PagoForm';
import PagoDetailsModal from '../../components/pagos/PagoDetailsModal';
import PagosFilters from '../../components/pagos/PagosFilters';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import Pagination from '../../components/Pagination/Pagination';

function Pagos() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { pagos, loading, pagination, fetchPagos, createPago, updatePago, deletePago, fetchPagoById } = usePagos();

  const [filters, setFilters] = React.useState({
    tipo: null,
    estado: null,
    fechaDesde: null,
    fechaHasta: null,
    observaciones: null,
  });

  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [detailDialog, setDetailDialog] = React.useState({ open: false, pago: null });
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, pago: null });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [paginationState, setPaginationState] = React.useState({ page: 1, limit: 10 });

  React.useEffect(() => {
    loadPagos(paginationState.page, paginationState.limit);
  }, [filters, paginationState.page, paginationState.limit]);

  const loadPagos = async (page, limit) => {
    await fetchPagos({ page, limit, ...filters });
  };

  const handlePageChange = (newPage) => {
    setPaginationState(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    const limitNum = parseInt(newLimit, 10);
    setPaginationState(prev => ({ ...prev, limit: limitNum, page: 1 }));
  };

  const handleOpenModal = (pago = null) => {
    setEditingItem(pago);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleSuccess = async (formData) => {
    try {
      if (editingItem) {
        await updatePago(editingItem.id_pago, formData);
        setSnackbar({ open: true, message: 'Pago actualizado correctamente', severity: 'success' });
      } else {
        await createPago(formData);
        setSnackbar({ open: true, message: 'Pago creado correctamente', severity: 'success' });
      }
      handleCloseModal();
      await loadPagos();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al guardar el pago', severity: 'error' });
    }
  };

  const handleViewDetails = async (pago) => {
    try {
      const pagoCompleto = await fetchPagoById(pago.id_pago);
      setDetailDialog({ open: true, pago: pagoCompleto || pago });
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      setDetailDialog({ open: true, pago });
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, pago: null });
  };

  const handleDeleteClick = (pago) => {
    setDeleteDialog({ open: true, pago });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, pago: null });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePago(deleteDialog.pago.id_pago);
      setSnackbar({ open: true, message: 'Pago eliminado correctamente', severity: 'success' });
      setDeleteDialog({ open: false, pago: null });
      await loadPagos();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al eliminar el pago', severity: 'error' });
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      tipo: null,
      estado: null,
      fechaDesde: null,
      fechaHasta: null,
      observaciones: null,
    });
  };

  const handleRefresh = () => {
    loadPagos();
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
          Registrar Pago
        </Button>
      </Box>

      <Accordion 
        defaultExpanded={false}
        disableGutters 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '8px !important',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          mb: 1,
          '& .MuiAccordionSummary-root': {
            minHeight: 40,
            p: '0 8px',
          },
          '& .MuiAccordionSummary-content': {
            my: 1,
          },
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            minHeight: 40, 
            p: '0 8px',
          }}
        >
          <FilterListIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
          <Typography sx={{ fontWeight: 500 }}>Filtros</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: '8px !important' }}>
          <PagosFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </AccordionDetails>
      </Accordion>

      <PagosTable
        pagos={pagos}
        loading={loading}
        onViewDetails={handleViewDetails}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        isMobile={isMobile}
      />

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Modal para crear/editar pago */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Pago' : 'Crear Nuevo Pago'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <PagoForm
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
              initialData={editingItem}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Modal de detalles del pago */}
      <PagoDetailsModal
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        pago={detailDialog.pago}
        onRefresh={handleRefresh}
      />

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="el pago"
        itemName={`#${deleteDialog.pago?.id_pago || ''}`}
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

export default Pagos;
