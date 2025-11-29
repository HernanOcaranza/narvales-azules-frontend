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
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import * as alumnoService from '../../services/alumnoService';
import * as tutorService from '../../services/tutorService';
import AlumnoForm from '../../components/Forms/AlumnoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { formatDate } from '../../utils/helpers';

function Alumnos() {
  const [alumnos, setAlumnos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [detailDialog, setDetailDialog] = React.useState({ open: false, alumno: null });
  const [tutorDetails, setTutorDetails] = React.useState(null);
  const [loadingTutor, setLoadingTutor] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadAlumnos();
  }, []);

  const loadAlumnos = async () => {
    setLoading(true);
    try {
      const data = await alumnoService.getAll();
      // Asegurar que siempre sea un array
      setAlumnos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
      setAlumnos([]);
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
    setTutorDetails(null);
    
    // Si el alumno tiene id_tutor pero no tiene los datos completos del tutor, cargarlos
    if (alumno.id_tutor && (!alumno.tutor || !alumno.tutor.telefono)) {
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
      // Si ya tiene los datos del tutor, usarlos
      setTutorDetails(alumno.tutor);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, alumno: null });
    setTutorDetails(null);
  };

  const getEstadoColor = (estado) => {
    return estado === 1 ? 'success' : 'default';
  };

  const getEstadoLabel = (estado) => {
    return estado === 1 ? 'Activo' : 'Inactivo';
  };

  const filteredAlumnos = alumnos.filter((alumno) =>
    Object.values(alumno).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ whiteSpace: 'nowrap' }}
          onClick={() => handleOpenModal()}
        >
          Nuevo Alumno
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {filteredAlumnos.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay alumnos registrados
            </Typography>
          ) : (
            filteredAlumnos.map((alumno) => (
              <Card 
                key={alumno.id_alumno}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleOpenDetailDialog(alumno)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {alumno.nombre} {alumno.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DNI: {alumno.dni || 'N/A'}
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
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={getEstadoLabel(alumno.estado)}
                      color={getEstadoColor(alumno.estado)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small" color="primary" onClick={() => handleOpenModal(alumno)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(alumno)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Fecha Nacimiento</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Condición</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlumnos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
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
                    <TableCell>{alumno.id_alumno}</TableCell>
                    <TableCell>{alumno.nombre}</TableCell>
                    <TableCell>{alumno.apellido}</TableCell>
                    <TableCell>{alumno.dni || 'N/A'}</TableCell>
                    <TableCell>{formatDate(alumno.fecha_nacimiento)}</TableCell>
                    <TableCell>
                      {alumno.tutor ? `${alumno.tutor.nombre} ${alumno.tutor.apellido}` : 'N/A'}
                    </TableCell>
                    <TableCell>{alumno.categoria?.categoria || 'N/A'}</TableCell>
                    <TableCell>{alumno.condicion?.condicion || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getEstadoLabel(alumno.estado)}
                        color={getEstadoColor(alumno.estado)}
                        size="small"
                      />
                    </TableCell>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
        maxWidth="md"
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
          {detailDialog.alumno && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                {/* Información del Alumno */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Información del Alumno
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {`${detailDialog.alumno.nombre} ${detailDialog.alumno.apellido}`}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getEstadoLabel(detailDialog.alumno.estado)}
                      color={getEstadoColor(detailDialog.alumno.estado)}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    DNI
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {detailDialog.alumno.dni || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Nacimiento
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(detailDialog.alumno.fecha_nacimiento)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha de Registro
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(detailDialog.alumno.fecha_registro)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Categoría
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {detailDialog.alumno.categoria?.categoria || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Condición
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {detailDialog.alumno.condicion?.condicion || 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Dirección
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {detailDialog.alumno.direccion || 'N/A'}
                  </Typography>
                </Grid>

                {/* Información del Tutor */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
                    Información del Tutor
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                {loadingTutor ? (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress size={24} />
                    </Box>
                  </Grid>
                ) : (tutorDetails || detailDialog.alumno.tutor) ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Nombre Completo
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {`${(tutorDetails || detailDialog.alumno.tutor)?.nombre || ''} ${(tutorDetails || detailDialog.alumno.tutor)?.apellido || ''}`.trim() || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {(tutorDetails || detailDialog.alumno.tutor)?.telefono || 'N/A'}
                      </Typography>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No hay tutor asignado
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Cerrar</Button>
          {detailDialog.alumno && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handleCloseDetailDialog();
                handleOpenModal(detailDialog.alumno);
              }}
            >
              Editar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Alumnos;

