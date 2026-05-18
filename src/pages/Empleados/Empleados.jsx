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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import * as empleadoService from '../../services/empleadoService';
import EmpleadoForm from '../../components/Forms/EmpleadoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { formatDate } from '../../utils/helpers';

function Empleados() {
  const [empleados, setEmpleados] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    setLoading(true);
    try {
      const data = await empleadoService.getAll();
      // Asegurar que siempre sea un array
      setEmpleados(Array.isArray(data) ? data : []);
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
    loadEmpleados(); // Recargar la lista después de crear/editar
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await empleadoService.deleteById(deleteDialog.item.id_empleado);
        setDeleteDialog({ open: false, item: null });
        loadEmpleados();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Error al eliminar el empleado. Por favor, intente nuevamente.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const getEstadoColor = (estado) => {
    return estado === 1 ? 'success' : 'default';
  };

  const getEstadoLabel = (estado) => {
    return estado === 1 ? 'Activo' : 'Inactivo';
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      admin: 'Administrador',
      profesor: 'Profesor',
      recepcionista: 'Recepcionista',
    };
    return tipos[tipo] || tipo;
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
          Crear Nuevo Empleado
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {empleados.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay empleados registrados
            </Typography>
          ) : (
            empleados.map((empleado) => (
              <Card key={empleado.id_empleado} variant="outlined" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {empleado.nombre} {empleado.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Usuario: {empleado.usuario}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {getTipoLabel(empleado.tipo)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teléfono: {empleado.telefono}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha Alta: {formatDate(empleado.fecha_alta)}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={getEstadoLabel(empleado.estado)}
                      color={getEstadoColor(empleado.estado)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => handleOpenModal(empleado)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(empleado)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Fecha Alta</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empleados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay empleados registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                empleados.map((empleado) => (
                  <TableRow key={empleado.id_empleado} hover>
                    <TableCell>{empleado.nombre}</TableCell>
                    <TableCell>{empleado.apellido}</TableCell>
                    <TableCell>{empleado.usuario}</TableCell>
                    <TableCell>{getTipoLabel(empleado.tipo)}</TableCell>
                    <TableCell>{empleado.telefono}</TableCell>
                    <TableCell>{formatDate(empleado.fecha_alta)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getEstadoLabel(empleado.estado)}
                        color={getEstadoColor(empleado.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" color="primary" onClick={() => handleOpenModal(empleado)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteClick(empleado)}>
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

      {/* Modal para crear/editar empleado */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <EmpleadoForm
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
        title="el empleado"
        itemName={deleteDialog.item ? `${deleteDialog.item.nombre} ${deleteDialog.item.apellido}` : ''}
      />
    </Box>
  );
}

export default Empleados;

