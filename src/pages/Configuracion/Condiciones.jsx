import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as condicionService from '../../services/condicionService';
import CondicionForm from '../../components/Forms/CondicionForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { Button, Modal, Spinner, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip, Card } from '../../components/ui';

function Condiciones() {
  const [condiciones, setCondiciones] = React.useState([]);
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

  React.useEffect(() => { loadCondiciones(); }, []);

  const loadCondiciones = async () => {
    setLoading(true);
    try {
      const data = await condicionService.getAll({ limit: 100 });
      const condicionesData = data?.data?.data || data?.data || data || [];
      setCondiciones(Array.isArray(condicionesData) ? condicionesData : []);
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
      setCondiciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => { setEditingItem(item); setOpenModal(true); };
  const handleCloseModal = () => { setOpenModal(false); setEditingItem(null); };
  const handleSuccess = () => { handleCloseModal(); loadCondiciones(); };
  const handleDeleteClick = (item) => setDeleteDialog({ open: true, item });
  const handleDeleteCancel = () => setDeleteDialog({ open: false, item: null });
  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await condicionService.deleteById(deleteDialog.item.id_condicion);
        setDeleteDialog({ open: false, item: null });
        loadCondiciones();
      } catch (error) {
        alert('Error al eliminar la condición.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>Nueva Condición</Button>
      </div>
      {loading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : isMobile ? (
        <div className="space-y-3">
          {condiciones.map((item) => (
            <Card key={item.id_condicion} hover>
              <div className="space-y-2">
                <h3 className="font-semibold text-text-primary">{item.condicion}</h3>
                <p className="text-sm text-text-secondary">{item.descripcion || 'Sin descripción'}</p>
                <p className="text-sm text-text-secondary">Atención: {item.atencion || '-'}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" icon={Edit} onClick={() => handleOpenModal(item)}>Editar</Button>
                  <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteClick(item)}>Eliminar</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Table>
          <TableHead>
<TableRow>
            <TableHeadCell>Nombre</TableHeadCell>
            <TableHeadCell>Descripción</TableHeadCell>
            <TableHeadCell>Atención</TableHeadCell>
            <TableHeadCell className="text-right">Acciones</TableHeadCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {condiciones.map((item) => (
              <TableRow key={item.id_condicion} hover>
                <TableCell className="font-medium">{item.condicion}</TableCell>
                <TableCell>{item.descripcion || '-'}</TableCell>
                <TableCell>{item.atencion || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteClick(item)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Modal open={openModal} onClose={handleCloseModal} title={editingItem ? 'Editar Condición' : 'Nueva Condición'} size="sm">
        <CondicionForm onSuccess={handleSuccess} onCancel={handleCloseModal} initialData={editingItem} />
      </Modal>
      <ConfirmDeleteDialog open={deleteDialog.open} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} title="la condición" itemName={deleteDialog.item?.condicion || ''} />
    </div>
  );
}

export default Condiciones;