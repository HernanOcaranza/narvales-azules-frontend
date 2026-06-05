import React from 'react';
import { Plus, Edit, Trash2, ChevronDown, Filter } from 'lucide-react';
import * as grupoService from '../../services/grupoService';
import GrupoForm from '../../components/Forms/GrupoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import GruposFilters from '../../components/grupos/GruposFilters';
import Pagination from '../../components/Pagination/Pagination';
import { obtenerNombreDia, DIAS_SEMANA } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { Button, Modal, Spinner, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell, Chip, Card } from '../../components/ui';

function Grupos() {
  const { userRole } = useAuth();
  const isProfesor = userRole === 'profesor';
  const isRecepcionista = userRole === 'recepcionista';
  const canEdit = !isProfesor && !isRecepcionista;
  const [grupos, setGrupos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [filters, setFilters] = React.useState({
    idDisciplina: '',
    idCategoria: '',
    estado: '',
    nombre: '',
  });
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [isMobile, setIsMobile] = React.useState(false);
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    loadGrupos(pagination.page, pagination.limit);
  }, [filters, pagination.page, pagination.limit]);

  const loadGrupos = async (page, limit) => {
    setLoading(true);
    try {
      const filtrosBackend = {};
      if (filters.idDisciplina) filtrosBackend.idDisciplina = parseInt(filters.idDisciplina);
      if (filters.idCategoria) filtrosBackend.idCategoria = parseInt(filters.idCategoria);
      if (filters.estado !== '') filtrosBackend.estado = filters.estado === 'activo' ? 1 : 0;
      if (filters.nombre) filtrosBackend.nombre = filters.nombre;

      const result = await grupoService.getAll({ page, limit, filters: filtrosBackend });
      const response = result?.data?.data || result?.data || result;
      const pagInfo = result?.data?.pagination || result?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
      setGrupos(Array.isArray(response) ? response : []);
      setPagination(pagInfo);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    const limitNum = parseInt(newLimit, 10);
    setPagination(prev => ({ ...prev, limit: limitNum, page: 1 }));
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
    loadGrupos();
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
        await grupoService.deleteById(deleteDialog.item.id_grupo);
        setDeleteDialog({ open: false, item: null });
        loadGrupos();
      } catch (error) {
        console.error('Error al eliminar grupo:', error);
        alert('Error al eliminar el grupo. Verifique que no tenga clases asociadas.');
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ idDisciplina: '', idCategoria: '', estado: '', nombre: '' });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      activo: { variant: 'success', label: 'Activo' },
      inactivo: { variant: 'default', label: 'Inactivo' },
      1: { variant: 'success', label: 'Activo' },
      0: { variant: 'default', label: 'Inactivo' },
    };
    return estados[estado] || { variant: 'default', label: estado };
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        {canEdit && (
          <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
            Nuevo Grupo
          </Button>
        )}
      </div>

      {/* Filters */}
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
            <GruposFilters
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
      ) : isMobile ? (
        <div className="space-y-3">
          {grupos.length === 0 ? (
            <p className="text-center text-text-secondary p-8">No hay grupos registrados</p>
          ) : (
            grupos.map((grupo) => {
              const badge = getEstadoBadge(grupo.estado);
              return (
                <Card key={grupo.id_grupo} hover>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-text-primary">{grupo.nombre}</h3>
                      <Chip label={badge.label} variant={badge.variant} size="sm" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      Disciplina: {grupo.disciplina?.disciplina || 'N/A'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Categoría: {grupo.categoria?.categoria || 'N/A'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Horario: {grupo.horarios?.map(h => `${obtenerNombreDia(h.dia_semana ?? h.dia)} ${h.hora_inicio?.slice(0,5)}-${h.hora_fin?.slice(0,5)}`).join(', ') || 'Sin horario'}
                    </p>
                    {canEdit && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" icon={Edit} onClick={() => handleOpenModal(grupo)}>Editar</Button>
                        <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteClick(grupo)}>Eliminar</Button>
                      </div>
                    )}
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
              <TableHeadCell>Disciplina</TableHeadCell>
              <TableHeadCell>Categoría</TableHeadCell>
              <TableHeadCell>Horario</TableHeadCell>
              <TableHeadCell>Estado</TableHeadCell>
              {canEdit && <TableHeadCell className="text-right">Acciones</TableHeadCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {grupos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 6 : 5} className="text-center">
                  No hay grupos registrados
                </TableCell>
              </TableRow>
            ) : (
              grupos.map((grupo) => {
                const badge = getEstadoBadge(grupo.estado);
                return (
                  <TableRow key={grupo.id_grupo} hover>
                    <TableCell className="font-medium">{grupo.nombre}</TableCell>
                    <TableCell>{grupo.disciplina?.disciplina || 'N/A'}</TableCell>
                    <TableCell>{grupo.categoria?.categoria || 'N/A'}</TableCell>
                    <TableCell>
                      {grupo.horarios?.map(h => `${obtenerNombreDia(h.dia_semana ?? h.dia)} ${h.hora_inicio?.slice(0,5)}`).join(', ') || 'Sin horario'}
                    </TableCell>
                    <TableCell>
                      <Chip label={badge.label} variant={badge.variant} size="sm" />
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleOpenModal(grupo)} className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(grupo)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Grupo' : 'Nuevo Grupo'}
        size="lg"
      >
        <GrupoForm
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
        title="el grupo"
        itemName={deleteDialog.item?.nombre || ''}
      />
    </div>
  );
}

export default Grupos;