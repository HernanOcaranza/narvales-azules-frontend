import React from 'react';
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  CreditCard as CreditCardIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import * as alumnoService from '../../services/alumnoService';
import * as tutorService from '../../services/tutorService';
import AlumnoForm from '../../components/Forms/AlumnoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import EstadoMembresiaBadge from '../../components/EstadoMembresiaBadge/EstadoMembresiaBadge';
import FiltrosAlumnos from '../../components/FiltrosAlumnos/FiltrosAlumnos';
import Pagination from '../../components/Pagination/Pagination';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { filtrarAlumnosPorEstado, ordenarAlumnosPorEstado } from '../../utils/membresiaHelpers';
import { useAuth } from '../../hooks/useAuth';

function Alumnos() {
  const { userRole } = useAuth();
  const isProfesor = userRole === 'profesor';
  const isRecepcionista = userRole === 'recepcionista';
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
  const [ordenEstado, setOrdenEstado] = React.useState('asc');
  const [filtrosAdicionales, setFiltrosAdicionales] = React.useState({
    tutor: null,
    idCategoria: null,
    idCondicion: null,
    estado: '',
    certificado: '',
  });
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    loadAlumnos(); // Recargar la lista después de crear/editar
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
      // Cargar información completa del alumno usando el nuevo endpoint
      const alumnoCompletoData = await alumnoService.getCompletoById(alumno.id_alumno);
      setAlumnoCompleto(alumnoCompletoData);
      setErrorAlumnoCompleto(null);
      
      // Si el alumno completo tiene tutor, usarlo
      if (alumnoCompletoData?.tutor) {
        setTutorDetails(alumnoCompletoData.tutor);
      } else if (alumno.id_tutor && (!alumno.tutor || !alumno.tutor.telefono)) {
        // Fallback: cargar tutor si no viene en la respuesta completa
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
      // Si falla el endpoint completo, usar los datos básicos del alumno
      // Esto permite mostrar al menos la información básica aunque el endpoint falle
      setAlumnoCompleto(null);
      setErrorAlumnoCompleto(error.message || 'No se pudo cargar la información completa del alumno. Se muestra información básica.');
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

  const getEstadoColor = (estado) => {
    return estado === 1 ? 'success' : 'default';
  };

  const getEstadoLabel = (estado) => {
    return estado === 1 ? 'Activo' : 'Inactivo';
  };

  const getCertificadoLabel = (certificado) => {
    return certificado === 1 ? 'Sí' : 'No';
  };

  // Filtrar localmente solo búsqueda de texto y estado de membresía
  const filteredAlumnos = React.useMemo(() => {
    let result = [...alumnos];

    // Filtrar por búsqueda de texto
    if (searchText) {
      result = result.filter((alumno) =>
        Object.values(alumno).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Filtrar por estado de membresía
    if (estadosFiltro.length > 0) {
      result = filtrarAlumnosPorEstado(result, estadosFiltro);
    }

    // Ordenar por estado de membresía
    if (ordenEstado) {
      result = ordenarAlumnosPorEstado(result, ordenEstado);
    }

    return result;
  }, [alumnos, searchText, estadosFiltro, ordenEstado]);

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <TextField
          placeholder="Buscar alumno..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ flexGrow: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ whiteSpace: 'nowrap' }}
            onClick={() => handleOpenModal()}
          >
            Nuevo Alumno
          </Button>
        )}
      </Box>

      {/* Filtros de membresía - para admin y recepcionista */}
      {canViewMembershipStatus && (
        <Accordion defaultCollapsed disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FiltrosAlumnos
              alumnos={alumnos}
              estadosSeleccionados={estadosFiltro}
              onEstadosChange={setEstadosFiltro}
              orden={ordenEstado}
              onOrdenChange={setOrdenEstado}
              filtrosAdicionales={filtrosAdicionales}
              onFiltrosChange={setFiltrosAdicionales}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <>
          <Stack spacing={2}>
            {filteredAlumnos.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
                No hay alumnos registrados
              </Typography>
            ) : (
              filteredAlumnos.map((alumno) => (
                <Card 
                  variant="outlined"
                  key={alumno.id_alumno}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleOpenDetailDialog(alumno)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {alumno.nombre} {alumno.apellido}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha Nacimiento: {formatDate(alumno.fecha_nacimiento)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tutor: {alumno.tutor ? `${alumno.tutor.nombre} ${alumno.tutor.apellido}` : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Categoría: {alumno.categoria?.categoria || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Condición: {alumno.condicion?.condicion || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Certificado Médico: {getCertificadoLabel(alumno.certificado ?? 0)}
                      {alumno.certificado === 1 ? (
                        <CheckCircleIcon sx={{ ml: 0.5, fontSize: 16, color: 'success.main', verticalAlign: 'middle' }} />
                      ) : (
                        <CancelIcon sx={{ ml: 0.5, fontSize: 16, color: 'error.main', verticalAlign: 'middle' }} />
                      )}
                    </Typography>
                    <Box sx={{ mt: 1, mb: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={getEstadoLabel(alumno.estado)}
                        color={getEstadoColor(alumno.estado)}
                        size="small"
                      />
                      {!isProfesor && <EstadoMembresiaBadge aluno={alumno} size="small" />}
                    </Box>
                    {canEdit && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" color="primary" onClick={() => handleOpenModal(alumno)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(alumno)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Fecha Nacimiento</TableCell>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell>Condición</TableCell>
                  <TableCell>Certificado</TableCell>
                  <TableCell>Estado</TableCell>
                  {!isProfesor && <TableCell>Estado Membresía</TableCell>}
                  {!isProfesor && <TableCell align="right">Acciones</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlumnos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isProfesor ? 8 : 10} align="center">
                      <Typography variant="body1" color="text.secondary" p={2}>
                        No hay alumnos registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlumnos.map((alumno) => (
                    <TableRow 
                      key={alumno.id_alumno} 
                      hover
                      sx={{ cursor: 'pointer' }}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {alumno.certificado === 1 ? (
                            <>
                              <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                              <Typography variant="body2" component="span">
                                Sí
                              </Typography>
                            </>
                          ) : (
                            <>
                              <CancelIcon sx={{ fontSize: 18, color: 'error.main' }} />
                              <Typography variant="body2" component="span">
                                No
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getEstadoLabel(alumno.estado)}
                          color={getEstadoColor(alumno.estado)}
                          size="small"
                        />
                      </TableCell>
                      {!isProfesor && (
                        <TableCell>
                          <EstadoMembresiaBadge alumno={alumno} size="small" />
                        </TableCell>
                      )}
                      {!isProfesor && (
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" color="primary" onClick={() => handleOpenModal(alumno)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDeleteClick(alumno)}>
                              <DeleteIcon />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      )}

      {/* Modal para crear/editar alumno */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Alumno' : 'Crear Nuevo Alumno'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <AlumnoForm
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
        title="el alumno"
        itemName={deleteDialog.item ? `${deleteDialog.item.nombre} ${deleteDialog.item.apellido}` : ''}
      />

      {/* Modal de detalles del alumno */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        maxWidth="lg"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Detalles del Alumno
            </Typography>
            <IconButton onClick={handleCloseDetailDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loadingAlumnoCompleto ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : (alumnoCompleto || detailDialog.alumno) ? (
            <Box sx={{ pt: 2 }}>
              {errorAlumnoCompleto && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {errorAlumnoCompleto}
                </Alert>
              )}
              {(() => {
                const alumno = alumnoCompleto || detailDialog.alumno;
                return (
                  <Grid container spacing={3}>
                    {/* Información Personal */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <InfoIcon color="primary" />
                        <Typography variant="h6" gutterBottom>
                          Información Personal
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {`${alumno.nombre} ${alumno.apellido}`}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Estado
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={getEstadoLabel(alumno.estado)}
                          color={getEstadoColor(alumno.estado)}
                          size="small"
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        DNI
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {alumno.dni || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Nacimiento
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {formatDate(alumno.fecha_nacimiento)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Registro
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {formatDate(alumno.fecha_registro)}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Certificado Médico
                      </Typography>
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {alumno.certificado === 1 ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: 20, color: 'success.main' }} />
                            <Typography variant="body1" component="span">
                              Sí
                            </Typography>
                          </>
                        ) : (
                          <>
                            <CancelIcon sx={{ fontSize: 20, color: 'error.main' }} />
                            <Typography variant="body1" component="span">
                              No
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Dirección
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {alumno.direccion || 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Tutor */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6" gutterBottom>
                          Tutor
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    {loadingTutor ? (
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" p={2}>
                          <CircularProgress size={24} />
                        </Box>
                      </Grid>
                    ) : (tutorDetails || alumno.tutor) ? (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Nombre Completo
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {`${(tutorDetails || alumno.tutor)?.nombre || ''} ${(tutorDetails || alumno.tutor)?.apellido || ''}`.trim() || 'N/A'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Teléfono
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {(tutorDetails || alumno.tutor)?.telefono || 'N/A'}
                          </Typography>
                        </Grid>

                        {(tutorDetails || alumno.tutor)?.dni && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">
                              DNI
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                              {(tutorDetails || alumno.tutor).dni}
                            </Typography>
                          </Grid>
                        )}
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          No hay tutor asignado
                        </Typography>
                      </Grid>
                    )}

                    {/* Categoría y Condición */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
                        <CategoryIcon color="primary" />
                        <Typography variant="h6" gutterBottom>
                          Categoría y Condición
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Categoría
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {alumno.categoria?.categoria || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Condición
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {alumno.condicion?.condicion || 'N/A'}
                      </Typography>
                    </Grid>

                    {/* Membresías */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 2 }}>
                        <CreditCardIcon color="primary" />
                        <Typography variant="h6" gutterBottom>
                          Membresías
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    {canViewMembershipStatus && alumnoCompleto?.membresias && alumnoCompleto.membresias.length > 0 ? (
                      <Grid item xs={12}>
                        <Stack spacing={3}>
                          {alumnoCompleto.membresias.map((membresia, index) => {
                            const totalPago = membresia.pago?.detalles?.reduce(
                              (sum, detalle) => sum + (parseFloat(detalle.monto_parcial) || 0),
                              0
                            ) || 0;

                            return (
                              <Card key={membresia.id_membrecia || index} variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Membresía #{index + 1} - {membresia.tipo_membrecia?.tipo_membrecia || 'N/A'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                    <Chip
                                      label={membresia.estado || 'N/A'}
                                      color={membresia.estado === 'activa' ? 'success' : 'default'}
                                      size="small"
                                    />
                                  </Box>
                                </Box>

                                <Grid container spacing={2} sx={{ mb: 2 }}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      Fecha Inicio
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatDate(membresia.fecha_inicio)}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" color="text.secondary">
                                      Fecha Fin
                                    </Typography>
                                    <Typography variant="body2">
                                      {formatDate(membresia.fecha_fin)}
                                    </Typography>
                                  </Grid>
                                  {membresia.grupo && (
                                    <>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          Grupo
                                        </Typography>
                                        <Typography variant="body2">
                                          {membresia.grupo?.nombre || 'N/A'}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          Disciplina
                                        </Typography>
                                        <Typography variant="body2">
                                          {membresia.grupo.disciplina?.disciplina || 'N/A'}
                                        </Typography>
                                      </Grid>
                                    </>
                                  )}
                                  {membresia.tipo_membrecia?.frecuencia_semanal && (
                                    <Grid item xs={12} sm={6}>
                                      <Typography variant="body2" color="text.secondary">
                                        Frecuencia Semanal
                                      </Typography>
                                      <Typography variant="body2">
                                        {membresia.tipo_membrecia.frecuencia_semanal} veces por semana
                                      </Typography>
                                    </Grid>
                                  )}
                                </Grid>

                                {/* Pago */}
                                {membresia.pago && (
                                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                      <PaymentIcon color="primary" fontSize="small" />
                                      <Typography variant="subtitle2" fontWeight="bold">
                                        Pago
                                      </Typography>
                                    </Box>
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          Fecha de Pago
                                        </Typography>
                                        <Typography variant="body2">
                                          {formatDate(membresia.pago.fecha_pago)}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" color="text.secondary">
                                          Estado
                                        </Typography>
                                        <Chip
                                          label={membresia.pago.estado || 'N/A'}
                                          color={membresia.pago.estado === 'completado' ? 'success' : 'default'}
                                          size="small"
                                        />
                                      </Grid>
                                      {membresia.pago.observaciones && (
                                        <Grid item xs={12}>
                                          <Typography variant="body2" color="text.secondary">
                                            Observaciones
                                          </Typography>
                                          <Typography variant="body2">
                                            {membresia.pago.observaciones}
                                          </Typography>
                                        </Grid>
                                      )}
                                      {totalPago > 0 && (
                                        <Grid item xs={12}>
                                          <Typography variant="body2" color="text.secondary">
                                            Total Pagado
                                          </Typography>
                                          <Typography variant="h6" color="primary">
                                            {formatCurrency(totalPago)}
                                          </Typography>
                                        </Grid>
                                      )}
                                    </Grid>

                                    {/* Detalles de Pago */}
                                    {membresia.pago.detalles && membresia.pago.detalles.length > 0 && (
                                      <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                                          Detalles de Pago:
                                        </Typography>
                                        <Stack spacing={1}>
                                          {membresia.pago.detalles.map((detalle, detalleIndex) => (
                                            <Box
                                              key={detalle.id_detalle_pago || detalleIndex}
                                              sx={{
                                                p: 1.5,
                                                bgcolor: 'grey.50',
                                                borderRadius: 1,
                                                border: 1,
                                                borderColor: 'grey.200',
                                              }}
                                            >
                                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                <Typography variant="body2" fontWeight="medium">
                                                  {detalle.metodo_pago === 'efectivo' ? '💵 Efectivo' :
                                                   detalle.metodo_pago === 'transferencia' ? '🏦 Transferencia' :
                                                   detalle.metodo_pago === 'tarjeta' ? '💳 Tarjeta' :
                                                   detalle.metodo_pago || 'N/A'}
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                  {formatCurrency(detalle.monto_parcial)}
                                                </Typography>
                                              </Box>
                                              <Typography variant="caption" color="text.secondary">
                                                Fecha: {formatDate(detalle.fecha_detalle)}
                                              </Typography>
                                              {detalle.referencia_transferencia && (
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                  Referencia: {detalle.referencia_transferencia}
                                                </Typography>
                                              )}
                                            </Box>
                                          ))}
                                        </Stack>
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </Card>
                            );
                          })}
                        </Stack>
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          Este alumno no tiene membresías registradas
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                );
              })()}
            </Box>
          ) : (
            <Box p={2}>
              <Typography variant="body2" color="error">
                Error al cargar la información del alumno
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Cerrar</Button>
          {!isProfesor && (alumnoCompleto || detailDialog.alumno) && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handleCloseDetailDialog();
                handleOpenModal(alumnoCompleto || detailDialog.alumno);
              }}
            >
              Editar Alumno
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Alumnos;

