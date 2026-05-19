import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as tipoMembresiaService from '../../services/tipoMembresiasService';
import TipoMembresiaForm from '../../components/Forms/TipoMembresiaForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { formatCurrency } from '../../utils/helpers';
import { Button, Modal, Spinner, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip, Card } from '../../components/ui';

function TipoMembresias() {
  const [tipos, setTipos] = React.useState([]);
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

  React.useEffect(() => { loadTipos(); }, []);

  const loadTipos = async () => {
    setLoading(true);
    try {
      const data = await tipoMembresiaService.getAll({ limit: 100 });
      const tiposData = data?.data?.data || data?.data || data || [];
      setTipos(Array.isArray(tiposData) ? tiposData : []);
    } catch (error) {
      console.error('Error al cargar tipos de membresía:', error);
      setTipos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => { setEditingItem(item); setOpenModal(true); };
  const handleCloseModal = () => { setOpenModal(false); setEditingItem(null); };
  const handleSuccess = () => { handleCloseModal(); loadTipos(); };
  const handleDeleteClick = (item) => setDeleteDialog({ open: true, item });
  const handleDeleteCancel = () => setDeleteDialog({ open: false, item: null });
  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await tipoMembresiaService.deleteById(deleteDialog.item.id_tipo_membrecia);
        setDeleteDialog({ open: false, item: null });
        loadTipos();
      } catch (error) {
        alert('Error al eliminar el tipo de membresía.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>Nuevo Tipo de Membresía</Button>
      </div>
      {loading ? (
        <div className="flex justify-center p-8"><Spinner size="lg" /></div>
      ) : isMobile ? (
        <div className="space-y-3">
          {tipos.map((item) => {
            const precioActual = item.precios?.find(p => p.estado === 1);
            return (
              <Card key={item.id_tipo_membrecia} hover>
                <div className="space-y-2">
                  <h3 className="font-semibold text-text-primary">{item.tipo_membrecia}</h3>
                  <p className="text-sm text-text-secondary">Frecuencia: {item.frecuencia_semanal ? `${item.frecuencia_semanal} veces/semana` : 'N/A'}</p>
                  <p className="text-sm text-text-secondary">Duración: {item.duracion_dias ? `${item.duracion_dias} días` : 'N/A'}</p>
                  <p className="text-sm font-medium text-primary-main">Precio: {precioActual ? formatCurrency(precioActual.precio) : 'Sin precio'}</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" icon={Edit} onClick={() => handleOpenModal(item)}>Editar</Button>
                    <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteClick(item)}>Eliminar</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Table>
          <TableHead>
<TableRow>
            <TableHeadCell>Nombre</TableHeadCell>
            <TableHeadCell>Frecuencia Semanal</TableHeadCell>
            <TableHeadCell>Duración (días)</TableHeadCell>
            <TableHeadCell>Precio</TableHeadCell>
            <TableHeadCell className="text-right">Acciones</TableHeadCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {tipos.map((item) => {
              const precioActual = item.precios?.find(p => p.estado === 1);
              return (
                <TableRow key={item.id_tipo_membrecia} hover>
                  <TableCell className="font-medium">{item.tipo_membrecia}</TableCell>
                  <TableCell>{item.frecuencia_semanal ? `${item.frecuencia_semanal} veces` : '-'}</TableCell>
                  <TableCell>{item.duracion_dias || '-'}</TableCell>
                  <TableCell className="font-medium text-primary-main">{precioActual ? formatCurrency(precioActual.precio) : 'Sin precio'}</TableCell>
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
      <Modal open={openModal} onClose={handleCloseModal} title={editingItem ? 'Editar Tipo de Membresía' : 'Nuevo Tipo de Membresía'} size="md">
        <TipoMembresiaForm onSuccess={handleSuccess} onCancel={handleCloseModal} initialData={editingItem} />
      </Modal>
      <ConfirmDeleteDialog open={deleteDialog.open} onClose={handleDeleteCancel} onConfirm={handleDeleteConfirm} title="el tipo de membresía" itemName={deleteDialog.item?.tipo_membrecia || ''} />
    </div>
  );
}

export default TipoMembresias;