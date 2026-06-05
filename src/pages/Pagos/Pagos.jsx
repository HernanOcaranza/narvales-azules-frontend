import React from 'react';
import { Plus, ChevronDown, Filter } from 'lucide-react';
import { usePagos } from '../../hooks/usePagos';
import PagosTable from '../../components/pagos/PagosTable';
import PagoForm from '../../components/pagos/PagoForm';
import PagoDetailsModal from '../../components/pagos/PagoDetailsModal';
import PagosFilters from '../../components/pagos/PagosFilters';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import Pagination from '../../components/Pagination/Pagination';
import { Button, Modal } from '../../components/ui';

function Pagos() {
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
  const [isMobile, setIsMobile] = React.useState(false);
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
          Registrar Pago
        </Button>
      </div>

      {/* Filters Accordion */}
      <div className="bg-white/95 rounded-lg mb-3 overflow-hidden border border-gray-200">
        <button 
          className="w-full px-4 py-2 flex items-center gap-2 text-text-primary font-medium hover:bg-gray-50 transition-colors"
          onClick={() => setFiltersExpanded(!filtersExpanded)}
        >
          <Filter className="w-4 h-4 text-primary-main" />
          Filtros
          <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`} />
        </button>
        {filtersExpanded && (
          <div className="p-3 border-t border-gray-200">
            <PagosFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}
      </div>

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
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Pago' : 'Crear Nuevo Pago'}
        size="sm"
      >
        <PagoForm
          onSuccess={handleSuccess}
          onCancel={handleCloseModal}
          initialData={editingItem}
        />
      </Modal>

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
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
          snackbar.severity === 'success' ? 'bg-green-600 text-white' : 
          snackbar.severity === 'error' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <span>{snackbar.message}</span>
            <button 
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              className="hover:opacity-80"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pagos;