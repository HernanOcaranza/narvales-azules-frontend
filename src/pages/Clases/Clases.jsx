import React from 'react';
import { Play, Edit, Eye, Save, X, ChevronDown, Filter, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import * as claseService from '../../services/claseService';
import { formatDate } from '../../utils/helpers';
import Pagination from '../../components/Pagination/Pagination';
import ClasesFilters from '../../components/clases/ClasesFilters';
import AsistenciaEmpleados from '../../components/clases/AsistenciaEmpleados';
import AsistenciaAlumnos from '../../components/clases/AsistenciaAlumnos';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Select, Card, Chip, Spinner, Modal, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '../../components/ui';

function Clases() {
  const { userRole } = useAuth();
  const isProfesor = userRole === 'profesor';
  const isRecepcionista = userRole === 'recepcionista';
  const canEdit = !isProfesor && !isRecepcionista;
  const [clases, setClases] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = React.useState({ open: false, clase: null });
  const [detailDialog, setDetailDialog] = React.useState({ open: false, clase: null });
  const [editFormData, setEditFormData] = React.useState({});
  const [editLoading, setEditLoading] = React.useState(false);
  const [editErrors, setEditErrors] = React.useState({});
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = React.useState({
    idGrupo: '',
    idDisciplina: '',
    idCategoria: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
  });
  const [isMobile, setIsMobile] = React.useState(false);
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    loadClasesWithParams(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, filters]);

  const loadClasesWithParams = async (page, limit) => {
    setLoading(true);
    try {
      const filtrosBackend = {};
      if (filters.idGrupo) filtrosBackend.idGrupo = parseInt(filters.idGrupo);
      if (filters.idDisciplina) filtrosBackend.idDisciplina = parseInt(filters.idDisciplina);
      if (filters.idCategoria) filtrosBackend.idCategoria = parseInt(filters.idCategoria);
      if (filters.estado) filtrosBackend.estado = filters.estado;
      if (filters.fechaDesde) filtrosBackend.fechaDesde = filters.fechaDesde;
      if (filters.fechaHasta) filtrosBackend.fechaHasta = filters.fechaHasta;
      const result = await claseService.getAll({ page, limit, filters: filtrosBackend });
      setClases(result?.data?.data || result?.data || []);
      setPagination(result?.data?.pagination || result?.pagination || { page, limit, total: 0, totalPages: 0 });
    } catch (error) {
      console.error('Error al cargar clases:', error);
      setClases([]);
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ idGrupo: '', idDisciplina: '', idCategoria: '', estado: '', fechaDesde: '', fechaHasta: '' });
  };

  const handleOpenEditDialog = (clase) => {
    setEditFormData({
      fecha_clase: clase.fecha_clase,
      hora_inicio: clase.hora_inicio?.slice(0, 5),
      hora_fin: clase.hora_fin?.slice(0, 5),
      estado: clase.estado,
    });
    setEditErrors({});
    setEditDialog({ open: true, clase });
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, clase: null });
    setEditFormData({});
    setEditErrors({});
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const errors = {};
    if (!editFormData.fecha_clase) errors.fecha_clase = 'La fecha es requerida';
    if (!editFormData.hora_inicio) errors.hora_inicio = 'La hora de inicio es requerida';
    if (!editFormData.hora_fin) errors.hora_fin = 'La hora de fin es requerida';

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setEditLoading(true);
    try {
      await claseService.update(editDialog.clase.id_clase, editFormData);
      setSnackbar({ open: true, message: 'Clase actualizada correctamente', severity: 'success' });
      handleCloseEditDialog();
      loadClasesWithParams();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al actualizar la clase', severity: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenDetailDialog = (clase) => {
    setDetailDialog({ open: true, clase });
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, clase: null });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      pendiente: { variant: 'warning', label: 'Pendiente' },
      realizada: { variant: 'success', label: 'Realizada' },
      suspendida: { variant: 'error', label: 'Suspendida' },
      cancelada: { variant: 'default', label: 'Cancelada' },
    };
    return estados[estado] || { variant: 'default', label: estado };
  };

  const getAsistenciaBadge = (clase) => {
    const totalEmpleados = parseInt(clase.total_empleados_asistencia) || 0;
    const totalAlumnos = parseInt(clase.total_alumnos_asistencia) || 0;
    if (totalEmpleados > 0 || totalAlumnos > 0) {
      return { variant: 'success', label: 'Registrada' };
    }
    return { variant: 'default', label: 'Pendiente' };
  };

  return (
    <div>
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
            <ClasesFilters
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
          {clases.length === 0 ? (
            <p className="text-center text-text-secondary p-8">No hay clases registradas</p>
          ) : (
            clases.map((clase) => {
              const badge = getEstadoBadge(clase.estado);
              const asistenciaBadge = getAsistenciaBadge(clase);
              return (
                <Card key={clase.id_clase} hover onClick={() => handleOpenDetailDialog(clase)}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-text-primary">{clase.grupo?.nombre || 'Sin grupo'}</h3>
                      <Chip label={badge.label} variant={badge.variant} size="sm" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      {formatDate(clase.fecha_clase)} - {clase.hora_inicio?.slice(0, 5)} a {clase.hora_fin?.slice(0, 5)}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Disciplina: {clase.grupo?.disciplina?.disciplina || 'N/A'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      Asistencia empleados: <Chip label={asistenciaBadge.label} variant={asistenciaBadge.variant} size="sm" />
                    </p>
                    {canEdit && (
                      <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" icon={Edit} onClick={() => handleOpenEditDialog(clase)}>Editar</Button>
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
              <TableHeadCell>Fecha</TableHeadCell>
              <TableHeadCell>Hora Inicio</TableHeadCell>
              <TableHeadCell>Hora Fin</TableHeadCell>
              <TableHeadCell>Grupo</TableHeadCell>
              <TableHeadCell>Disciplina</TableHeadCell>
              <TableHeadCell>Estado</TableHeadCell>
              <TableHeadCell>Asistencia</TableHeadCell>
              {canEdit && <TableHeadCell className="text-right">Acciones</TableHeadCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {clases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 8 : 7} className="text-center">
                  No hay clases registradas
                </TableCell>
              </TableRow>
            ) : (
              clases.map((clase) => {
                const badge = getEstadoBadge(clase.estado);
                const asistenciaBadge = getAsistenciaBadge(clase);
                return (
                  <TableRow key={clase.id_clase} hover onClick={() => handleOpenDetailDialog(clase)}>
                    <TableCell>{formatDate(clase.fecha_clase)}</TableCell>
                    <TableCell>{clase.hora_inicio?.slice(0, 5)}</TableCell>
                    <TableCell>{clase.hora_fin?.slice(0, 5)}</TableCell>
                    <TableCell>{clase.grupo?.nombre || 'N/A'}</TableCell>
                    <TableCell>{clase.grupo?.disciplina?.disciplina || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip label={badge.label} variant={badge.variant} size="sm" />
                    </TableCell>
                    <TableCell>
                      <Chip label={asistenciaBadge.label} variant={asistenciaBadge.variant} size="sm" />
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleOpenEditDialog(clase)}
                            className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main"
                          >
                            <Edit className="w-4 h-4" />
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

      {/* Edit Dialog */}
      <Modal
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        title="Editar Clase"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCloseEditDialog}>Cancelar</Button>
            <Button variant="primary" icon={Save} onClick={handleEditSubmit} loading={editLoading}>
              Guardar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Fecha"
            type="date"
            name="fecha_clase"
            value={editFormData.fecha_clase || ''}
            onChange={handleEditInputChange}
            error={editErrors.fecha_clase}
          />
          <Input
            label="Hora Inicio"
            type="time"
            name="hora_inicio"
            value={editFormData.hora_inicio || ''}
            onChange={handleEditInputChange}
            error={editErrors.hora_inicio}
          />
          <Input
            label="Hora Fin"
            type="time"
            name="hora_fin"
            value={editFormData.hora_fin || ''}
            onChange={handleEditInputChange}
            error={editErrors.hora_fin}
          />
          <Select
            label="Estado"
            name="estado"
            value={editFormData.estado || ''}
            onChange={handleEditInputChange}
          >
            <option value="pendiente">Pendiente</option>
            <option value="realizada">Realizada</option>
            <option value="suspendida">Suspendida</option>
            <option value="cancelada">Cancelada</option>
          </Select>
        </div>
      </Modal>

      {/* Detail Dialog */}
      <Modal
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        title="Detalles de la Clase"
        size="lg"
      >
        {detailDialog.clase && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-secondary">Fecha</p>
                <p className="font-medium">{formatDate(detailDialog.clase.fecha_clase)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Estado</p>
                <Chip {...getEstadoBadge(detailDialog.clase.estado)} />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Hora Inicio</p>
                <p className="font-medium">{detailDialog.clase.hora_inicio?.slice(0, 5)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Hora Fin</p>
                <p className="font-medium">{detailDialog.clase.hora_fin?.slice(0, 5)}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Grupo</p>
                <p className="font-medium">{detailDialog.clase.grupo?.nombre || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-text-secondary">Disciplina</p>
                <p className="font-medium">{detailDialog.clase.grupo?.disciplina?.disciplina || 'N/A'}</p>
              </div>
            </div>

            <hr className="border-gray-200" />
            <AsistenciaEmpleados idClase={detailDialog.clase.id_clase} onAsistenciaGuardada={() => loadClasesWithParams()} />
            <hr className="border-gray-200" />
            <AsistenciaAlumnos idClase={detailDialog.clase.id_clase} onAsistenciaGuardada={() => loadClasesWithParams()} />
          </div>
        )}
      </Modal>

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
          snackbar.severity === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <span>{snackbar.message}</span>
            <button onClick={() => setSnackbar({ ...snackbar, open: false })} className="hover:opacity-80">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clases;