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
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Snackbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import * as precioMembresiasService from '../../services/precioMembresiasService';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import PrecioMembresiaForm from '../../components/Forms/PrecioMembresiaForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import { formatDate, formatCurrency } from '../../utils/helpers';

function PrecioMembresias() {
  const [precios, setPrecios] = React.useState([]);
  const [tiposMembrecia, setTiposMembrecia] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filtroTipo, setFiltroTipo] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadTiposMembrecia();
  }, []);

  React.useEffect(() => {
    loadPrecios();
  }, [filtroTipo]);

  const loadTiposMembrecia = async () => {
    try {
      const data = await tipoMembresiasService.getAll();
      setTiposMembrecia(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar tipos de membresía:', err);
    }
  };

  const loadPrecios = async () => {
    setLoading(true);
    try {
      const filters = filtroTipo ? { idTipoMembrecia: filtroTipo } : {};
      const data = await precioMembresiasService.getAll(filters);
      setPrecios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar precios de membresía:', error);
      setPrecios([]);
      setSnackbar({
        open: true,
        message: 'Error al cargar los precios de membresía. Por favor, intente nuevamente.',
        severity: 'error',
      });
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
    loadPrecios();
    setSnackbar({
      open: true,
      message: editingItem ? 'Precio actualizado correctamente' : 'Precio creado correctamente',
      severity: 'success',
    });
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await precioMembresiasService.deleteById(deleteDialog.item.id_precio_membrecia);
        setDeleteDialog({ open: false, item: null });
        loadPrecios();
        setSnackbar({
          open: true,
          message: 'Precio eliminado correctamente',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error al eliminar precio:', error);
        setSnackbar({
          open: true,
          message: error.message || 'Error al eliminar el precio. Por favor, intente nuevamente.',
          severity: 'error',
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  const getTipoNombre = (idTipoMembrecia) => {
    const tipo = tiposMembrecia.find(t => t.id_tipo_membrecia === idTipoMembrecia);
    return tipo ? (tipo.tipo_membrecia || `Tipo ${idTipoMembrecia}`) : `Tipo ${idTipoMembrecia}`;
  };

  const isVigente = (precio) => {
    const fechaInicio = precio.fecha_inicio_vigencia || precio.fecha_inicio;
    if (!fechaInicio) return false;
    const inicio = new Date(fechaInicio);
    const hoy = new Date();
    
    if (inicio > hoy) return false; // Aún no ha comenzado
    
    const fechaFin = precio.fecha_fin_vigencia || precio.fecha_fin;
    if (fechaFin) {
      const fin = new Date(fechaFin);
      return fin >= hoy;
    }
    
    return true; // Sin fecha de fin, está vigente
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filtrar por Tipo</InputLabel>
            <Select
              value={filtroTipo}
              label="Filtrar por Tipo"
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {tiposMembrecia.map((tipo) => (
                <MenuItem key={tipo.id_tipo_membrecia} value={tipo.id_tipo_membrecia}>
                  {tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Nuevo Precio
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {precios.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay precios registrados
            </Typography>
          ) : (
            precios.map((precio) => (
              <Card key={precio.id_precio_membrecia}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      {getTipoNombre(precio.id_tipo_membrecia)}
                    </Typography>
                    {isVigente(precio) && (
                      <Chip label="Vigente" color="success" size="small" />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Precio: {formatCurrency(precio.precio || precio.monto || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Inicio: {formatDate(precio.fecha_inicio_vigencia || precio.fecha_inicio)}
                  </Typography>
                  {(precio.fecha_fin_vigencia || precio.fecha_fin) && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Fin: {formatDate(precio.fecha_fin_vigencia || precio.fecha_fin)}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenModal(precio)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(precio)}
                    >
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
                <TableCell>Tipo de Membresía</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {precios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay precios registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                precios.map((precio) => (
                  <TableRow key={precio.id_precio_membrecia} hover>
                    <TableCell>{precio.id_precio_membrecia}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {getTipoNombre(precio.id_tipo_membrecia)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold" color="primary">
                        {formatCurrency(precio.precio || precio.monto || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(precio.fecha_inicio_vigencia || precio.fecha_inicio)}</TableCell>
                    <TableCell>{(precio.fecha_fin_vigencia || precio.fecha_fin) ? formatDate(precio.fecha_fin_vigencia || precio.fecha_fin) : '-'}</TableCell>
                    <TableCell>
                      {isVigente(precio) ? (
                        <Chip label="Vigente" color="success" size="small" />
                      ) : (
                        <Chip label="No vigente" color="default" size="small" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenModal(precio)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(precio)}
                        >
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

      {/* Modal para crear/editar precio */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Precio de Membresía' : 'Nuevo Precio de Membresía'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <PrecioMembresiaForm
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
        title="el precio"
        itemName={`${getTipoNombre(deleteDialog.item?.id_tipo_membrecia)} - ${formatCurrency(deleteDialog.item?.precio || deleteDialog.item?.monto || 0)}`}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PrecioMembresias;

