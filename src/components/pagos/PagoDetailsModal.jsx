import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDetallePagos } from '../../hooks/useDetallePagos';
import DetallePagoForm from './DetallePagoForm';
import { formatDate, formatCurrency } from '../../utils/helpers';
import ConfirmDeleteDialog from '../Dialogs/ConfirmDeleteDialog';

function PagoDetailsModal({ open, onClose, pago, onRefresh }) {
  const [showDetalleForm, setShowDetalleForm] = React.useState(false);
  const [editingDetalle, setEditingDetalle] = React.useState(null);
  const [deleteDetalleDialog, setDeleteDetalleDialog] = React.useState({ open: false, detalle: null });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const { detalles, loading, totalMonto, createDetalle, updateDetalle, deleteDetalle } = useDetallePagos(
    pago?.id_pago
  );

  const handleSaveDetalle = async (formData) => {
    try {
      if (editingDetalle) {
        await updateDetalle(editingDetalle.id_detalle_pago, formData);
        setSnackbar({ open: true, message: 'Detalle actualizado correctamente', severity: 'success' });
      } else {
        await createDetalle(formData);
        setSnackbar({ open: true, message: 'Detalle creado correctamente', severity: 'success' });
      }
      setShowDetalleForm(false);
      setEditingDetalle(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al guardar el detalle', severity: 'error' });
    }
  };

  const handleEditDetalle = (detalle) => {
    setEditingDetalle(detalle);
    setShowDetalleForm(true);
  };

  const handleDeleteDetalle = (detalle) => {
    setDeleteDetalleDialog({ open: true, detalle });
  };

  const handleConfirmDeleteDetalle = async () => {
    try {
      await deleteDetalle(deleteDetalleDialog.detalle.id_detalle_pago);
      setSnackbar({ open: true, message: 'Detalle eliminado correctamente', severity: 'success' });
      setDeleteDetalleDialog({ open: false, detalle: null });
      if (onRefresh) onRefresh();
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error al eliminar el detalle', severity: 'error' });
    }
  };

  const handleCancelDetalleForm = () => {
    setShowDetalleForm(false);
    setEditingDetalle(null);
  };

  const getTipoColor = (tipo) => {
    return tipo === 'ingreso' ? 'success' : 'error';
  };

  const getEstadoColor = (estado) => {
    const colors = {
      pagado: 'success',
      pendiente: 'warning',
      vencido: 'error',
      cancelado: 'default',
    };
    return colors[estado] || 'default';
  };

  if (!pago) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Detalles del Pago #{pago.id_pago}</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Información del Pago */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Información del Pago
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Tipo
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={pago.tipo?.toUpperCase()}
                    color={getTipoColor(pago.tipo)}
                    size="small"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Estado
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={pago.estado?.toUpperCase()}
                    color={getEstadoColor(pago.estado)}
                    size="small"
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de Pago
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(pago.fecha_pago)}
                </Typography>
              </Grid>

              {pago.empleado && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Empleado
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {pago.empleado.nombre} {pago.empleado.apellido}
                  </Typography>
                </Grid>
              )}

              {pago.observaciones && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Observaciones
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {pago.observaciones}
                  </Typography>
                </Grid>
              )}

              {/* Detalles de Pago */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Detalles de Pago</Typography>
                  {!showDetalleForm && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setShowDetalleForm(true)}
                    >
                      Agregar Detalle
                    </Button>
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {showDetalleForm ? (
                <Grid item xs={12}>
                  <DetallePagoForm
                    onSuccess={handleSaveDetalle}
                    onCancel={handleCancelDetalleForm}
                    initialData={editingDetalle}
                    pagoId={pago.id_pago}
                  />
                </Grid>
              ) : (
                <>
                  {loading ? (
                    <Grid item xs={12}>
                      <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                      </Box>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Método</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Referencia</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {detalles.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} align="center">
                                    <Typography variant="body2" color="text.secondary" p={2}>
                                      No hay detalles registrados
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                detalles.map((detalle) => (
                                  <TableRow key={detalle.id_detalle_pago} hover>
                                    <TableCell>{detalle.metodo_pago}</TableCell>
                                    <TableCell>{formatCurrency(detalle.monto_parcial)}</TableCell>
                                    <TableCell>{formatDate(detalle.fecha_detalle)}</TableCell>
                                    <TableCell>{detalle.referencia_transferencia || '-'}</TableCell>
                                    <TableCell align="right">
                                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          onClick={() => handleEditDetalle(detalle)}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => handleDeleteDetalle(detalle)}
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
                      </Grid>

                      {detalles.length > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Typography variant="h6" color="primary">
                              Total: {formatCurrency(totalMonto)}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </>
                  )}
                </>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteDetalleDialog.open}
        onClose={() => setDeleteDetalleDialog({ open: false, detalle: null })}
        onConfirm={handleConfirmDeleteDetalle}
        title="el detalle de pago"
        itemName={`${deleteDetalleDialog.detalle?.metodo_pago || ''} - ${formatCurrency(deleteDetalleDialog.detalle?.monto_parcial || 0)}`}
      />

      {snackbar.open && (
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}
        >
          {snackbar.message}
        </Alert>
      )}
    </>
  );
}

export default PagoDetailsModal;

