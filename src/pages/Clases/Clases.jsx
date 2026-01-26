import React from 'react';
import {
  Box,
  Button,
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
  Chip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import * as claseService from '../../services/claseService';
import { Alert, Snackbar } from '@mui/material';
import { formatDate } from '../../utils/helpers';

function Clases() {
  const [clases, setClases] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [editDialog, setEditDialog] = React.useState({ open: false, clase: null });
  const [detailDialog, setDetailDialog] = React.useState({ open: false, clase: null });
  const [editFormData, setEditFormData] = React.useState({});
  const [editLoading, setEditLoading] = React.useState(false);
  const [editErrors, setEditErrors] = React.useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadClases();
  }, []);

  const loadClases = async () => {
    setLoading(true);
    try {
      const response = await claseService.getAll();
      // Asegurar que siempre sea un array
      const data = Array.isArray(response) ? response : [];
      setClases(data);
    } catch (error) {
      console.error('Error al cargar clases:', error);
      setClases([]);
      setSnackbar({
        open: true,
        message: 'Error al cargar las clases. Por favor, intente nuevamente.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarClases = async () => {
    setGenerating(true);
    try {
      const response = await claseService.generarTodas();
      const message = response?.message || 'Clases generadas correctamente';
      setSnackbar({
        open: true,
        message: message,
        severity: 'success',
      });
      // Recargar las clases después de generar
      await loadClases();
    } catch (error) {
      console.error('Error al generar clases:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error al generar las clases. Por favor, intente nuevamente.',
        severity: 'error',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenEditDialog = (clase) => {
    // Formatear fecha para el input
    const formatDateForInput = (date) => {
      if (!date) return '';
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      // Usar métodos locales en lugar de UTC para evitar problemas de zona horaria
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Formatear hora para el input (HH:MM:SS -> HH:MM)
    const formatTimeForInput = (time) => {
      if (!time) return '';
      if (time.length >= 5) {
        return time.substring(0, 5);
      }
      return time;
    };

    // Convertir estado numérico a string del enum
    const getEstadoEnum = (estado) => {
      if (typeof estado === 'string') {
        // Si ya es string, validar que sea uno de los valores del enum
        if (['pendiente', 'realizada', 'suspendida'].includes(estado)) {
          return estado;
        }
      }
      // Convertir número a string del enum
      if (estado === 1 || estado === 'activo' || estado === 'realizada') {
        return 'realizada';
      }
      if (estado === 0 || estado === 'inactivo' || estado === 'suspendida') {
        return 'suspendida';
      }
      if (estado === 'pendiente') {
        return 'pendiente';
      }
      return 'pendiente'; // Valor por defecto
    };

    setEditFormData({
      fecha_clase: formatDateForInput(clase.fecha_clase),
      hora_inicio: formatTimeForInput(clase.hora_inicio),
      hora_fin: formatTimeForInput(clase.hora_fin),
      estado: getEstadoEnum(clase.estado),
    });
    setEditDialog({ open: true, clase });
    setEditErrors({});
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, clase: null });
    setEditFormData({});
    setEditErrors({});
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value, // El estado ahora es string, no número
    }));
    // Limpiar error del campo
    if (editErrors[name]) {
      setEditErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.fecha_clase) {
      newErrors.fecha_clase = 'La fecha es requerida';
    }

    if (!editFormData.hora_inicio) {
      newErrors.hora_inicio = 'La hora de inicio es requerida';
    }

    if (!editFormData.hora_fin) {
      newErrors.hora_fin = 'La hora de fin es requerida';
    }

    if (editFormData.hora_inicio && editFormData.hora_fin) {
      const inicio = new Date(`2000-01-01T${editFormData.hora_inicio}:00`);
      const fin = new Date(`2000-01-01T${editFormData.hora_fin}:00`);
      if (fin <= inicio) {
        newErrors.hora_fin = 'La hora de fin debe ser mayor que la hora de inicio';
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return;
    }

    setEditLoading(true);
    try {
      const formatTimeForAPI = (time) => {
        if (!time) return '';
        if (time.length === 5) return `${time}:00`;
        return time;
      };

      const updateData = {
        fecha_clase: editFormData.fecha_clase,
        hora_inicio: formatTimeForAPI(editFormData.hora_inicio),
        hora_fin: formatTimeForAPI(editFormData.hora_fin),
        estado: editFormData.estado,
      };

      const claseId = editDialog.clase.id_clase || editDialog.clase.id;
      await claseService.update(claseId, updateData);
      
      setSnackbar({
        open: true,
        message: 'Clase actualizada correctamente',
        severity: 'success',
      });
      handleCloseEditDialog();
      await loadClases();
    } catch (error) {
      console.error('Error al actualizar clase:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error al actualizar la clase. Por favor, intente nuevamente.',
        severity: 'error',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenDetailDialog = async (clase) => {
    // Cargar detalles completos de la clase si es necesario
    try {
      const claseId = clase.id_clase || clase.id;
      const claseCompleta = await claseService.getById(claseId);
      setDetailDialog({ open: true, clase: claseCompleta || clase });
    } catch (error) {
      console.error('Error al cargar detalles de la clase:', error);
      setDetailDialog({ open: true, clase });
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialog({ open: false, clase: null });
  };

  // Helper para obtener el nombre del grupo
  const getGrupoNombre = (clase) => {
    return clase.grupo?.nombre || clase.id_grupo || 'N/A';
  };

  // Helper para formatear la hora
  const formatTime = (time) => {
    if (!time) return '-';
    // Si viene en formato HH:MM:SS, tomar solo HH:MM
    if (time.length >= 5) {
      return time.substring(0, 5);
    }
    return time;
  };

  // Helper para obtener el rango de horas
  const getHorario = (clase) => {
    const inicio = formatTime(clase.hora_inicio);
    const fin = formatTime(clase.hora_fin);
    if (inicio && fin) {
      return `${inicio} - ${fin}`;
    }
    return inicio || fin || '-';
  };

  // Helper para obtener la capacidad
  const getCapacidad = (clase) => {
    return clase.grupo?.cupo_maximo || clase.cupo_maximo || '-';
  };

  // Helper para obtener los inscriptos (probablemente se calcula de alguna relación)
  const getInscriptos = (clase) => {
    // Si hay un campo directo, usarlo
    if (clase.inscriptos !== undefined) {
      return clase.inscriptos;
    }
    // Si hay una relación con alumnos, contar
    if (clase.alumnos && Array.isArray(clase.alumnos)) {
      return clase.alumnos.length;
    }
    return 0;
  };

  // Helper para obtener el estado
  const getEstado = (clase) => {
    if (clase.estado === 'realizada' || clase.estado === 1) {
      return 'Realizada';
    }
    if (clase.estado === 'suspendida' || clase.estado === 0) {
      return 'Suspendida';
    }
    if (clase.estado === 'pendiente') {
      return 'Pendiente';
    }
    return 'Desconocido';
  };

  // Helper para obtener el color del estado
  const getEstadoColor = (clase) => {
    const estado = clase.estado;
    if (estado === 'realizada' || estado === 1) {
      return 'success';
    }
    if (estado === 'suspendida' || estado === 0) {
      return 'error';
    }
    if (estado === 'pendiente') {
      return 'warning';
    }
    return 'default';
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
          onClick={handleGenerarClases}
          disabled={generating || loading}
        >
          {generating ? 'Generando...' : 'Generar Clases'}
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {clases.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay clases registradas
            </Typography>
          ) : (
            clases.map((clase) => (
              <Card key={clase.id_clase || clase.id}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {getGrupoNombre(clase)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {formatDate(clase.fecha_clase)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Horario: {getHorario(clase)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacidad: {getInscriptos(clase)}/{getCapacidad(clase)}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={getEstado(clase)}
                      color={getEstadoColor(clase)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(clase)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDetailDialog(clase)}>
                      <VisibilityIcon />
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
                <TableCell>Grupo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Horario</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Inscriptos</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay clases registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clases.map((clase) => (
                  <TableRow key={clase.id_clase || clase.id} hover>
                    <TableCell>{getGrupoNombre(clase)}</TableCell>
                    <TableCell>{formatDate(clase.fecha_clase)}</TableCell>
                    <TableCell>{getHorario(clase)}</TableCell>
                    <TableCell>{getCapacidad(clase)}</TableCell>
                    <TableCell>{getInscriptos(clase)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getEstado(clase)}
                        color={getEstadoColor(clase)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(clase)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDetailDialog(clase)}>
                          <VisibilityIcon />
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

      {/* Dialog para editar clase */}
      <Dialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          Editar Clase
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Fecha"
                name="fecha_clase"
                type="date"
                value={editFormData.fecha_clase || ''}
                onChange={handleEditFormChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!editErrors.fecha_clase}
                helperText={editErrors.fecha_clase}
              />

              <TextField
                label="Hora de Inicio"
                name="hora_inicio"
                type="time"
                value={editFormData.hora_inicio || ''}
                onChange={handleEditFormChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!editErrors.hora_inicio}
                helperText={editErrors.hora_inicio}
                inputProps={{
                  step: 300, // 5 minutos
                }}
              />

              <TextField
                label="Hora de Fin"
                name="hora_fin"
                type="time"
                value={editFormData.hora_fin || ''}
                onChange={handleEditFormChange}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!editErrors.hora_fin}
                helperText={editErrors.hora_fin}
                inputProps={{
                  step: 300, // 5 minutos
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="estado"
                  value={editFormData.estado || 'pendiente'}
                  onChange={handleEditFormChange}
                  label="Estado"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="realizada">Realizada</MenuItem>
                  <MenuItem value="suspendida">Suspendida</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} disabled={editLoading}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={editLoading ? <CircularProgress size={20} /> : <SaveIcon />}
            onClick={handleSaveEdit}
            disabled={editLoading}
          >
            {editLoading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles de clase */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Detalles de la Clase</Typography>
            <IconButton onClick={handleCloseDetailDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailDialog.clase && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Información de la Clase
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Grupo
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {getGrupoNombre(detailDialog.clase)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {formatDate(detailDialog.clase.fecha_clase)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Horario
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {getHorario(detailDialog.clase)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={getEstado(detailDialog.clase)}
                      color={getEstadoColor(detailDialog.clase)}
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Capacidad
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {getCapacidad(detailDialog.clase)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Inscriptos
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {getInscriptos(detailDialog.clase)}
                  </Typography>
                </Grid>

                {detailDialog.clase.grupo && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                        Información del Grupo
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Disciplina
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {detailDialog.clase.grupo.disciplina?.disciplina || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Categoría
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {detailDialog.clase.grupo.categoria?.categoria || 'N/A'}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Cerrar</Button>
          {detailDialog.clase && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                handleCloseDetailDialog();
                handleOpenEditDialog(detailDialog.clase);
              }}
            >
              Editar
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Clases;

