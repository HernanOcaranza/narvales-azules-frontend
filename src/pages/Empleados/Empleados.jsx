import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import * as empleadoService from '../../services/empleadoService';
import EmpleadoForm from '../../components/Forms/EmpleadoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { formatDate } from '../../utils/helpers';
import { Button, Modal, Spinner, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip, Card } from '../../components/ui';

function Empleados() {
  const [empleados, setEmpleados] = React.useState([]);
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

  React.useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    setLoading(true);
    try {
      const data = await empleadoService.getAll({ limit: 100 });
      const empleadosData = data?.data?.data || data?.data || data || [];
      setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      setEmpleados([]);
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
    loadEmpleados();
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await empleadoService.deleteById(deleteDialog.item.id_empleado);
        setDeleteDialog({ open: false, item: null });
        loadEmpleados();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Error al eliminar el empleado.');
      }
    }
  };

  const getTipoBadge = (tipo) => {
    const tipos = {
      admin: { variant: 'primary', label: 'Administrador' },
      recepcionista: { variant: 'info', label: 'Recepcionista' },
      profesor: { variant: 'success', label: 'Profesor' },
    };
    return tipos[tipo] || { variant: 'default', label: tipo };
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
          Nuevo Empleado
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : isMobile ? (
        <div className="space-y-3">
          {empleados.length === 0 ? (
            <p className="text-center text-text-secondary p-8">No hay empleados registrados</p>
          ) : (
            empleados.map((empleado) => {
              const tipoBadge = getTipoBadge(empleado.tipo);
              return (
                <Card key={empleado.id_empleado} hover>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-text-primary">
                      {empleado.nombre} {empleado.apellido}
                    </h3>
                    <p className="text-sm text-text-secondary">Usuario: {empleado.usuario || 'N/A'}</p>
                    <p className="text-sm text-text-secondary">DNI: {empleado.dni || 'N/A'}</p>
                    <p className="text-sm text-text-secondary">Email: {empleado.email || 'N/A'}</p>
                    <p className="text-sm text-text-secondary">Teléfono: {empleado.telefono || 'N/A'}</p>
                    <p className="text-sm text-text-secondary">Alta: {empleado.fecha_alta || 'N/A'}</p>
                    <div className="flex gap-2 mt-2">
                      <Chip label={tipoBadge.label} variant={tipoBadge.variant} size="sm" />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" icon={Edit} onClick={() => handleOpenModal(empleado)}>Editar</Button>
                      <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteClick(empleado)}>Eliminar</Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <Table>
          <TableHead>
<TableRow>
            <TableHeadCell>Nombre</TableHeadCell>
            <TableHeadCell>Usuario</TableHeadCell>
            <TableHeadCell>DNI</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Teléfono</TableHeadCell>
            <TableHeadCell>Tipo</TableHeadCell>
            <TableHeadCell>Fecha Alta</TableHeadCell>
            <TableHeadCell className="text-right">Acciones</TableHeadCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {empleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No hay empleados registrados
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((empleado) => {
                const tipoBadge = getTipoBadge(empleado.tipo);
                return (
                  <TableRow key={empleado.id_empleado} hover>
                    <TableCell className="font-medium">{empleado.nombre} {empleado.apellido}</TableCell>
                    <TableCell>{empleado.usuario || '-'}</TableCell>
                    <TableCell>{empleado.dni || '-'}</TableCell>
                    <TableCell>{empleado.email || '-'}</TableCell>
                    <TableCell>{empleado.telefono || '-'}</TableCell>
                    <TableCell>
                      <Chip label={tipoBadge.label} variant={tipoBadge.variant} size="sm" />
                    </TableCell>
                    <TableCell>{empleado.fecha_alta || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleOpenModal(empleado)} className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteClick(empleado)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Empleado' : 'Nuevo Empleado'}
        size="md"
      >
        <EmpleadoForm
          onSuccess={handleSuccess}
          onCancel={handleCloseModal}
          initialData={editingItem}
        />
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="el empleado"
        itemName={deleteDialog.item ? `${deleteDialog.item.nombre} ${deleteDialog.item.apellido}` : ''}
      />
    </div>
  );
}

export default Empleados;