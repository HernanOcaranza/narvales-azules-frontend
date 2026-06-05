import React from 'react';
import { Plus } from 'lucide-react';
import * as categoriaService from '../../services/categoriaService';
import CategoriaForm from '../../components/Forms/CategoriaForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import CategoriaTable from '../../components/Tables/CategoriaTable';
import CategoriaCards from '../../components/Cards/CategoriaCards';
import { Button, Modal, Spinner } from '../../components/ui';

function Categorias() {
  const [categorias, setCategorias] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => { loadCategorias(); }, []);

  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.getAll({ limit: 100 });
      const categoriasData = data?.data?.data || data?.data || data || [];
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => { setEditingItem(item); setOpenModal(true); };
  const handleCloseModal = () => { setOpenModal(false); setEditingItem(null); };
  const handleSuccess = () => { handleCloseModal(); loadCategorias(); };
  const handleDeleteClick = (item) => setDeleteDialog({ open: true, item });
  const handleDeleteCancel = () => setDeleteDialog({ open: false, item: null });
  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await categoriaService.deleteById(deleteDialog.item.id_categoria);
        setDeleteDialog({ open: false, item: null });
        loadCategorias();
      } catch (error) {
        alert('Error al eliminar la categoría.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>Nueva Categoría</Button>
      </div>
      {loading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : isMobile ? (
        <CategoriaCards categorias={categorias} onEdit={handleOpenModal} onDelete={handleDeleteClick} />
      ) : (
        <CategoriaTable categorias={categorias} onEdit={handleOpenModal} onDelete={handleDeleteClick} />
      )}
      <Modal open={openModal} onClose={handleCloseModal} title={editingItem ? 'Editar Categoría' : 'Nueva Categoría'} size="sm">
        <CategoriaForm onSuccess={handleSuccess} onCancel={handleCloseModal} initialData={editingItem} />
      </Modal>
      <ConfirmDeleteDialog open={deleteDialog.open} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} title="la categoría" itemName={deleteDialog.item?.categoria || ''} />
    </div>
  );
}

export default Categorias;