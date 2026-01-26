import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import * as categoriaService from '../../services/categoriaService';
import CategoriaForm from '../../components/Forms/CategoriaForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import CategoriaTable from '../../components/Tables/CategoriaTable';
import CategoriaCards from '../../components/Cards/CategoriaCards';

function Categorias() {
  const [categorias, setCategorias] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
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
    loadCategorias();
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await categoriaService.deleteById(deleteDialog.item.id_categoria);
        setDeleteDialog({ open: false, item: null });
        loadCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('Error al eliminar la categoría. Por favor, intente nuevamente.');
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
          Nueva Categoría
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <CategoriaCards
          categorias={categorias}
          onEdit={handleOpenModal}
          onDelete={handleDeleteClick}
        />
      ) : (
        <CategoriaTable
          categorias={categorias}
          onEdit={handleOpenModal}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modal para crear/editar categoría */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <CategoriaForm
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
        title="la categoría"
        itemName={deleteDialog.item?.categoria || ''}
      />
    </Box>
  );
}

export default Categorias;

