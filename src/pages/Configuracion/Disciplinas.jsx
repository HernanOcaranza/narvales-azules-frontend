import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as disciplinaService from '../../services/disciplinaService';
import DisciplinaForm from '../../components/Forms/DisciplinaForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { Button, Modal, Spinner, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip, Card } from '../../components/ui';

function Disciplinas() {
  const [disciplinas, setDisciplinas] = React.useState([]);
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

  React.useEffect(() => { loadDisciplinas(); }, []);

  const loadDisciplinas = async () => {
    setLoading(true);
    try {
      const data = await disciplinaService.getAll({ limit: 100 });
      const disciplinasData = data?.data?.data || data?.data || data || [];
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
    } catch (error) {
      console.error('Error al cargar disciplinas:', error);
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => { setEditingItem(item); setOpenModal(true); };
  const handleCloseModal = () => { setOpenModal(false); setEditingItem(null); };
  const handleSuccess = () => { handleCloseModal(); loadDisciplinas(); };
  const handleDeleteClick = (item) => setDeleteDialog({ open: true, item });
  const handleDeleteCancel = () => setDeleteDialog({ open: false, item: null });
  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await disciplinaService.deleteById(deleteDialog.item.id_disciplina);
        setDeleteDialog({ open: false, item: null });
        loadDisciplinas();
      } catch (error) {
        alert('Error al eliminar la disciplina.');
      }
    }
  };

  const getEstadoBadge = (estado) => estado === 1 ? { variant: 'success', label: 'Activo' } : { variant: 'default', label: 'Inactivo' };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>Nueva Disciplina</Button>
      </div>
      {loading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : isMobile ? (
        <div className="space-y-3">
          {disciplinas.map((item) => (
            <Card key={item.id_disciplina} hover>
              <div className="space-y-2">
                <h3 className="font-semibold text-text-primary">{item.disciplina}</h3>
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
            <TableHeadCell className="text-right">Acciones</TableHeadCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {disciplinas.map((item) => {
              const badge = getEstadoBadge(item.estado);
              return (
                <TableRow key={item.id_disciplina} hover>
                  <TableCell className="font-medium">{item.disciplina}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenModal(item)} className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteClick(item)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <Modal open={openModal} onClose={handleCloseModal} title={editingItem ? 'Editar Disciplina' : 'Nueva Disciplina'} size="sm">
        <DisciplinaForm onSuccess={handleSuccess} onCancel={handleCloseModal} initialData={editingItem} />
      </Modal>
      <ConfirmDeleteDialog open={deleteDialog.open} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} title="la disciplina" itemName={deleteDialog.item?.disciplina || ''} />
    </div>
  );
}

export default Disciplinas;