import React from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  User,
  Tag,
  ClipboardList,
  CreditCard,
  Banknote,
  Info,
  ChevronDown,
  Filter,
} from 'lucide-react';
import * as alumnoService from '../../services/alumnoService';
import * as tutorService from '../../services/tutorService';
import AlumnoForm from '../../components/Forms/AlumnoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import EstadoMembresiaBadge from '../../components/EstadoMembresiaBadge/EstadoMembresiaBadge';
import FiltrosAlumnos from '../../components/FiltrosAlumnos/FiltrosAlumnos';
import Pagination from '../../components/Pagination/Pagination';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { filtrarAlumnosPorEstado } from '../../utils/membresiaHelpers';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Card, Chip, Spinner, Modal, Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '../../components/ui';

function Alumnos() {
  const { userRole } = useAuth();
  const isProfesor = userRole === 'profesor';
  const canEdit = !isProfesor;
  const canViewMembershipStatus = !isProfesor;
  const [alumnos, setAlumnos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [detailDialog, setDetailDialog] = React.useState({ open: false, alumno: null });
  const [tutorDetails, setTutorDetails] = React.useState(null);
  const [loadingTutor, setLoadingTutor] = React.useState(false);
  const [loadingAlumnoCompleto, setLoadingAlumnoCompleto] = React.useState(false);
  const [alumnoCompleto, setAlumnoCompleto] = React.useState(null);
  const [errorAlumnoCompleto, setErrorAlumnoCompleto] = React.useState(null);
  const [estadosFiltro, setEstadosFiltro] = React.useState([]);
  const [filtrosAdicionales, setFiltrosAdicionales] = React.useState({
    tutor: null,
    idCategoria: null,
    idCondicion: null,
    idGrupo: null,
    estado: '1',
    certificado: '',
  });
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    loadAlumnos(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, filtrosAdicionales]);

  const loadAlumnos = async (page, limit) => {
    setLoading(true);
    try {
      const filtrosBackend = {};
      if (filtrosAdicionales.tutor?.id_tutor) filtrosBackend.idTutor = filtrosAdicionales.tutor.id_tutor;
      if (filtrosAdicionales.idCategoria) filtrosBackend.idCategoria = parseInt(filtrosAdicionales.idCategoria);
      if (filtrosAdicionales.idCondicion) filtrosBackend.idCondicion = parseInt(filtrosAdicionales.idCondicion);
      if (filtrosAdicionales.idGrupo) filtrosBackend.idGrupo = parseInt(filtrosAdicionales.idGrupo);
      if (filtrosAdicionales.estado) filtrosBackend.estado = filtrosAdicionales.estado;
      if (filtrosAdicionales.certificado) filtrosBackend.certificado = filtrosAdicionales.certificado;

      const result = await alumnoService.getAll({ page, limit, filters: filtrosBackend });
      const response = result?.data?.data || result?.data || result;
      const pagInfo = result?.data?.pagination || result?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
      setAlumnos(Array.isArray(response) ? response : []);
      setPagination(pagInfo);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      setAlumnos([]);
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
    loadAlumnos();
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await alumnoService.deleteById(deleteDialog.item.id_alumno);
        setDeleteDialog({ open: false, item: null });
        loadAlumnos();
      } catch (error) {
        console.error('Error al eliminar alumno:', error);
        alert('Error al eliminar el alumno. Por favor, intente nuevamente.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const handleOpenDetailDialog = async (alumno) => {
    setDetailDialog({ open: true, alumno });
    setAlumnoCompleto(null);
    setTutorDetails(null);
    setErrorAlumnoCompleto(null);
    setLoadingAlumnoCompleto(true);
    
    try {
      const alumnoCompletoData = await alumnoService.getCompletoById(alumno.id_alumno);
      setAlumnoCompleto(alumnoCompletoData);
      setErrorAlumnoCompleto(null);
      
      if (alumnoCompletoData?.tutor) {
        setTutorDetails(alumnoCompletoData.tutor);
      } else if (alumno.id_tutor && (!alumno.tutor || !alumno.tutor.telefono)) {
        setLoadingTutor(true);
        try {
          const response = await tutorService.getById(alumno.id_tutor);
          const tutor = response?.data || response;
          setTutorDetails(tutor);
        } catch (error) {
          console.error('Error al cargar detalles del tutor:', error);
        } finally {
          setLoadingTutor(false);
        }
      } else if (alumno.tutor) {
        setTutorDetails(alumno.tutor);
      }
    } catch (error) {
      console.error('Error al cargar información completa del alumno:', error);
      setAlumnoCompleto(null);
      setErrorAlumnoCompleto(error.message || 'No se pudo cargar la información completa del alumno.');
      if (alumno.tutor) {
        setTutorDetails(alumno.tutor);
      }
    } finally {
      setLoadingAlumnoCompleto(false);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, alumno: null });
    setAlumnoCompleto(null);
    setTutorDetails(null);
    setErrorAlumnoCompleto(null);
  };

  const getEstadoColor = (estado) => estado === 1 ? 'success' : 'default';
  const getEstadoLabel = (estado) => estado === 1 ? 'Activo' : 'Inactivo';
  const getCertificadoLabel = (certificado) => certificado === 1 ? 'Sí' : 'No';

  const filteredAlumnos = React.useMemo(() => {
    let result = [...alumnos];
    if (searchText) {
      result = result.filter((alumno) =>
        Object.values(alumno).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
    if (estadosFiltro.length > 0) {
      result = filtrarAlumnosPorEstado(result, estadosFiltro);
    }
    return result;
  }, [alumnos, searchText, estadosFiltro]);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <Input
          placeholder="Buscar alumno..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          icon={Search}
          className="w-full sm:w-72"
        />
        {canEdit && (
          <Button variant="primary" icon={Plus} onClick={() => handleOpenModal()}>
            Nuevo Alumno
          </Button>
        )}
      </div>

      {/* Filters Accordion */}
      {canViewMembershipStatus && (
        <div className="bg-white/95 rounded-lg mb-3 overflow-hidden border border-gray-200">
          <button 
            className="w-full px-4 py-2 flex items-center gap-2 text-text-primary font-medium hover:bg-gray-50 transition-colors"
            onClick={() => setFiltrosAdicionales(prev => ({ ...prev, _expanded: !prev._expanded }))}
          >
            <Filter className="w-4 h-4 text-primary-main" />
            Filtros
            <ChevronDown className={`ml-auto w-4 h-4 transition-transform ${filtrosAdicionales._expanded ? 'rotate-180' : ''}`} />
          </button>
          {filtrosAdicionales._expanded && (
            <div className="p-3 border-t border-gray-200">
              <FiltrosAlumnos
                alumnos={alumnos}
                estadosSeleccionados={estadosFiltro}
                onEstadosChange={setEstadosFiltro}
                filtrosAdicionales={filtrosAdicionales}
                onFiltrosChange={setFiltrosAdicionales}
              />
            </div>
          )}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : isMobile ? (
        /* Mobile View */
        <div className="space-y-3">
          {filteredAlumnos.length === 0 ? (
            <p className="text-center text-text-secondary p-8">No hay alumnos registrados</p>
          ) : (
            filteredAlumnos.map((alumno) => (
              <Card 
                key={alumno.id_alumno}
                hover
                onClick={() => handleOpenDetailDialog(alumno)}
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {alumno.nombre} {alumno.apellido}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Fecha Nacimiento: {formatDate(alumno.fecha_nacimiento)}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Tutor: {alumno.tutor ? `${alumno.tutor.nombre} ${alumno.tutor.apellido}` : 'N/A'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Categoría: {alumno.categoria?.categoria || 'N/A'}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Condición: {alumno.condicion?.condicion || 'N/A'}
                  </p>
                  <p className="text-sm text-text-secondary flex items-center gap-1">
                    Certificado Médico: {getCertificadoLabel(alumno.certificado ?? 0)}
                    {alumno.certificado === 1 ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Chip
                      label={getEstadoLabel(alumno.estado)}
                      variant={getEstadoLabel(alumno.estado) === 'Activo' ? 'success' : 'default'}
                      size="sm"
                    />
                    {!isProfesor && <EstadoMembresiaBadge alumno={alumno} size="sm" />}
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" icon={Edit} onClick={() => handleOpenModal(alumno)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteClick(alumno)}>
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      ) : (
        /* Desktop View */
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeadCell>Nombre</TableHeadCell>
                <TableHeadCell>Apellido</TableHeadCell>
                <TableHeadCell>Fecha Nacimiento</TableHeadCell>
                <TableHeadCell>Tutor</TableHeadCell>
                <TableHeadCell>Categoría</TableHeadCell>
                <TableHeadCell>Condición</TableHeadCell>
                <TableHeadCell>Certificado</TableHeadCell>
                <TableHeadCell>Estado</TableHeadCell>
                {!isProfesor && <TableHeadCell>Estado Membresía</TableHeadCell>}
                {!isProfesor && <TableHeadCell className="text-right">Acciones</TableHeadCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlumnos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isProfesor ? 8 : 10} className="text-center">
                    <p className="text-text-secondary py-4">No hay alumnos registrados</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlumnos.map((alumno) => (
                  <TableRow 
                    key={alumno.id_alumno} 
                    hover
                    onClick={() => handleOpenDetailDialog(alumno)}
                  >
                    <TableCell>{alumno.nombre}</TableCell>
                    <TableCell>{alumno.apellido}</TableCell>
                    <TableCell>{formatDate(alumno.fecha_nacimiento)}</TableCell>
                    <TableCell>
                      {alumno.tutor ? `${alumno.tutor.nombre} ${alumno.tutor.apellido}` : 'N/A'}
                    </TableCell>
                    <TableCell>{alumno.categoria?.categoria || 'N/A'}</TableCell>
                    <TableCell>{alumno.condicion?.condicion || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {alumno.certificado === 1 ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">Sí</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm">No</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEstadoLabel(alumno.estado)}
                        variant={getEstadoLabel(alumno.estado) === 'Activo' ? 'success' : 'default'}
                        size="sm"
                      />
                    </TableCell>
                    {!isProfesor && (
                      <TableCell>
                        <EstadoMembresiaBadge alumno={alumno} size="sm" />
                      </TableCell>
                    )}
                    {!isProfesor && (
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => handleOpenModal(alumno)}
                            className="p-1.5 rounded-lg hover:bg-primary-main/10 text-primary-main transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(alumno)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={editingItem ? 'Editar Alumno' : 'Crear Nuevo Alumno'}
        size="lg"
      >
        <AlumnoForm
          onSuccess={handleSuccess}
          onCancel={handleCloseModal}
          initialData={editingItem}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="el alumno"
        itemName={deleteDialog.item ? `${deleteDialog.item.nombre} ${deleteDialog.item.apellido}` : ''}
      />

      {/* Detail Dialog */}
      <Modal
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        title="Detalles del Alumno"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCloseDetailDialog}>Cerrar</Button>
            {!isProfesor && (alumnoCompleto || detailDialog.alumno) && (
              <Button 
                variant="primary" 
                icon={Edit}
                onClick={() => {
                  handleCloseDetailDialog();
                  handleOpenModal(alumnoCompleto || detailDialog.alumno);
                }}
              >
                Editar Alumno
              </Button>
            )}
          </div>
        }
      >
        {loadingAlumnoCompleto ? (
          <div className="flex justify-center p-8">
            <Spinner size="lg" />
          </div>
        ) : (alumnoCompleto || detailDialog.alumno) ? (
          <div className="space-y-6">
            {errorAlumnoCompleto && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                {errorAlumnoCompleto}
              </div>
            )}
            {(() => {
              const alumno = alumnoCompleto || detailDialog.alumno;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Información Personal */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-5 h-5 text-primary-main" />
                      <h3 className="text-lg font-semibold text-text-primary">Información Personal</h3>
                    </div>
                    <div className="border-t border-gray-200" />
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">Nombre Completo</p>
                    <p className="font-medium">{`${alumno.nombre} ${alumno.apellido}`}</p>
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">Estado</p>
                    <Chip
                      label={getEstadoLabel(alumno.estado)}
                      variant={getEstadoLabel(alumno.estado) === 'Activo' ? 'success' : 'default'}
                      size="sm"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">DNI</p>
                    <p className="font-medium">{alumno.dni || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">Fecha de Nacimiento</p>
                    <p className="font-medium">{formatDate(alumno.fecha_nacimiento)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">Fecha de Registro</p>
                    <p className="font-medium">{formatDate(alumno.fecha_registro)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">Certificado Médico</p>
                    <div className="flex items-center gap-1">
                      {alumno.certificado === 1 ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Sí</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" />
                          <span>No</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-text-secondary">Dirección</p>
                    <p className="font-medium">{alumno.direccion || 'N/A'}</p>
                  </div>

                  {/* Tutor */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3 mt-4">
                      <User className="w-5 h-5 text-primary-main" />
                      <h3 className="text-lg font-semibold text-text-primary">Tutor</h3>
                    </div>
                    <div className="border-t border-gray-200" />
                  </div>

                  {loadingTutor ? (
                    <div className="md:col-span-2 flex justify-center p-4">
                      <Spinner size="md" />
                    </div>
                  ) : (tutorDetails || alumno.tutor) ? (
                    <>
                      <div>
                        <p className="text-sm text-text-secondary">Nombre Completo</p>
                        <p className="font-medium">{`${(tutorDetails || alumno.tutor)?.nombre || ''} ${(tutorDetails || alumno.tutor)?.apellido || ''}`.trim() || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text-secondary">Teléfono</p>
                        <p className="font-medium">{(tutorDetails || alumno.tutor)?.telefono || 'N/A'}</p>
                      </div>
                      {(tutorDetails || alumno.tutor)?.dni && (
                        <div>
                          <p className="text-sm text-text-secondary">DNI</p>
                          <p className="font-medium">{(tutorDetails || alumno.tutor).dni}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <p className="text-text-secondary italic">No hay tutor asignado</p>
                    </div>
                  )}

                  {/* Categoría y Condición */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 mb-3 mt-4">
                      <Tag className="w-5 h-5 text-primary-main" />
                      <h3 className="text-lg font-semibold text-text-primary">Categoría y Condición</h3>
                    </div>
                    <div className="border-t border-gray-200" />
                  </div>

                  <div>
                    <p className="text-sm text-text-secondary">Categoría</p>
                    <p className="font-medium">{alumno.categoria?.categoria || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Condición</p>
                    <p className="font-medium">{alumno.condicion?.condicion || 'N/A'}</p>
                  </div>

                  {/* Membresías */}
                  {canViewMembershipStatus && (
                    <>
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-3 mt-4">
                          <CreditCard className="w-5 h-5 text-primary-main" />
                          <h3 className="text-lg font-semibold text-text-primary">Membresías</h3>
                        </div>
                        <div className="border-t border-gray-200" />
                      </div>

                      {alumnoCompleto?.membresias && alumnoCompleto.membresias.length > 0 ? (
                        <div className="md:col-span-2 space-y-4">
                          {alumnoCompleto.membresias.map((membresia, index) => {
                            const totalPago = membresia.pago?.detalles?.reduce(
                              (sum, detalle) => sum + (parseFloat(detalle.monto_parcial) || 0),
                              0
                            ) || 0;

                            return (
                              <div key={membresia.id_membrecia || index} className="border border-gray-200 rounded-lg p-4">
                                <div className="mb-3">
                                  <h4 className="font-semibold text-text-primary">
                                    Membresía #{index + 1} - {membresia.tipo_membrecia?.tipo_membrecia || 'N/A'}
                                  </h4>
                                  <div className="flex gap-2 mt-2">
                                    <Chip
                                      label={membresia.estado || 'N/A'}
                                      variant={membresia.estado === 'activa' ? 'success' : 'default'}
                                      size="sm"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                  <div>
                                    <p className="text-xs text-text-secondary">Fecha Inicio</p>
                                    <p className="text-sm">{formatDate(membresia.fecha_inicio)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-text-secondary">Fecha Fin</p>
                                    <p className="text-sm">{formatDate(membresia.fecha_fin)}</p>
                                  </div>
                                  {membresia.grupo && (
                                    <>
                                      <div>
                                        <p className="text-xs text-text-secondary">Grupo</p>
                                        <p className="text-sm">{membresia.grupo?.nombre || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-text-secondary">Disciplina</p>
                                        <p className="text-sm">{membresia.grupo.disciplina?.disciplina || 'N/A'}</p>
                                      </div>
                                    </>
                                  )}
                                  {membresia.tipo_membrecia?.frecuencia_semanal && (
                                    <div>
                                      <p className="text-xs text-text-secondary">Frecuencia Semanal</p>
                                      <p className="text-sm">{membresia.tipo_membrecia.frecuencia_semanal} veces por semana</p>
                                    </div>
                                  )}
                                </div>

                                {/* Pago */}
                                {membresia.pago && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Banknote className="w-4 h-4 text-primary-main" />
                                      <h5 className="font-semibold text-sm">Pago</h5>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                      <div>
                                        <p className="text-xs text-text-secondary">Fecha de Pago</p>
                                        <p className="text-sm">{formatDate(membresia.pago.fecha_pago)}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-text-secondary">Estado</p>
                                        <Chip
                                          label={membresia.pago.estado || 'N/A'}
                                          variant={membresia.pago.estado === 'completado' ? 'success' : 'default'}
                                          size="sm"
                                        />
                                      </div>
                                      {membresia.pago.observaciones && (
                                        <div className="col-span-2">
                                          <p className="text-xs text-text-secondary">Observaciones</p>
                                          <p className="text-sm">{membresia.pago.observaciones}</p>
                                        </div>
                                      )}
                                      {totalPago > 0 && (
                                        <div className="col-span-2">
                                          <p className="text-xs text-text-secondary">Total Pagado</p>
                                          <p className="text-lg font-bold text-primary-main">{formatCurrency(totalPago)}</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Detalles de Pago */}
                                    {membresia.pago.detalles && membresia.pago.detalles.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        <p className="text-sm font-medium">Detalles de Pago:</p>
                                        {membresia.pago.detalles.map((detalle, detalleIndex) => (
                                          <div
                                            key={detalle.id_detalle_pago || detalleIndex}
                                            className="p-2 bg-gray-50 rounded-lg border border-gray-200"
                                          >
                                            <div className="flex justify-between items-center">
                                              <span className="text-sm font-medium">
                                                {detalle.metodo_pago === 'efectivo' ? '💵 Efectivo' :
                                                 detalle.metodo_pago === 'transferencia' ? '🏦 Transferencia' :
                                                 detalle.metodo_pago === 'tarjeta' ? '💳 Tarjeta' :
                                                 detalle.metodo_pago || 'N/A'}
                                              </span>
                                              <span className="text-sm font-bold">{formatCurrency(detalle.monto_parcial)}</span>
                                            </div>
                                            <p className="text-xs text-text-secondary">
                                              Fecha: {formatDate(detalle.fecha_detalle)}
                                            </p>
                                            {detalle.referencia_transferencia && (
                                              <p className="text-xs text-text-secondary">
                                                Referencia: {detalle.referencia_transferencia}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="md:col-span-2">
                          <p className="text-text-secondary italic">Este alumno no tiene membresías registradas</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        ) : (
          <p className="text-red-600">Error al cargar la información del alumno</p>
        )}
      </Modal>
    </div>
  );
}

export default Alumnos;