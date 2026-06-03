import React from 'react';
import { Plus, ChevronDown, Filter } from 'lucide-react';
import { useMembresias } from '../../hooks/useMembresias';
import { useTipoMembresias } from '../../hooks/useTipoMembresias';
import * as membresiasService from '../../services/membresiasService';
import MembresiasTable from '../../components/membresias/MembresiasTable';
import MembreciaForm from '../../components/membresias/MembreciaForm';
import MembreciaDetailsModal from '../../components/membresias/MembreciaDetailsModal';
import MembresiasFilters from '../../components/membresias/MembresiasFilters';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import Pagination from '../../components/Pagination/Pagination';
import { Button, Modal, Spinner } from '../../components/ui';

function Membresias() {
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
  const [isMobile, setIsMobile] = React.useState(false);
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      setLoadingMembresiaCompleta(true);
      try {
        const membresiaCompleta = await membresiasService.getCompletoById(membresia.id_membrecia);
        setEditingItem(membresiaCompleta || membresia);
      } catch (error) {
        console.error('Error al cargar membresía completa para edición:', error);
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
        await updateMembrecia(editingItem.id_membrecia, formData);
        setSnackbar({ open: true, message: 'Membresía actualizada correctamente', severity: 'success' });
      } else {
        await createMembrecia(formData);
        setSnackbar({ open: true, message: 'Membresía creada correctamente', severity: 'success' });
      }
      handleCloseModal();
      await loadMembresias();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al guardar la membresía', severity: 'error' });
    }
  };

  const handleViewDetails = async (membresia) => {
    try {
      const membresiaCompleta = await membresiasService.getCompletoById(membresia.id_membrecia);
      setDetailDialog({ open: true, membresia: membresiaCompleta || membresia, warning: null });
    } catch (error) {
      console.error('Error al cargar detalles completos:', error);
      setDetailDialog({ open: true, membresia, warning: 'No se pudo cargar la información completa' });
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
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
          Nueva Membresía
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
            <MembresiasFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <MembresiasTable
          membresias={membresias}
          onViewDetails={handleViewDetails}
          onEdit={handleOpenModal}
          onDelete={handleDeleteClick}
          isMobile={isMobile}
        />
      )}

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Modal para crear/editar membresía */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Membresía' : 'Nueva Membresía'}
        size="lg"
      >
        {loadingMembresiaCompleta ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <MembreciaForm
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
            initialData={editingItem}
          />
        )}
      </Modal>

      {/* Modal de detalles */}
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
        itemName={deleteDialog.membresia ? `#${deleteDialog.membresia.id_membrecia}` : ''}
      />

      {/* Snackbar */}
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

export default Membresias;