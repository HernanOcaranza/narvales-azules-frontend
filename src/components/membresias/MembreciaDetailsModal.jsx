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
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../utils/helpers';

function MembreciaDetailsModal({ open, onClose, membresia }) {
  if (!membresia) return null;

  const getEstadoColor = (estado) => {
    const colors = {
      activa: 'success',
      vencida: 'error',
      suspendida: 'warning',
      cancelada: 'default',
    };
    return colors[estado] || 'default';
  };

  const getPagoTotal = () => {
    if (membresia.pago && membresia.pago.detalles) {
      return membresia.pago.detalles.reduce(
        (sum, detalle) => sum + (Number(detalle.monto_parcial) || 0),
        0
      );
    }
    return 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Detalles de la Membresía #{membresia.id_membrecia}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Información de la Membresía */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información de la Membresía
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Estado
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={membresia.estado?.toUpperCase()}
                  color={getEstadoColor(membresia.estado)}
                  size="small"
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Tipo de Membresía
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {membresia.tipo_membrecia?.tipo_membrecia || '-'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Fecha de Inicio
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDate(membresia.fecha_inicio)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Fecha de Fin
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {membresia.fecha_fin ? formatDate(membresia.fecha_fin) : 'Sin fecha de fin'}
              </Typography>
            </Grid>

            {/* Información del Alumno */}
            {membresia.alumno && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Información del Alumno
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre Completo
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {membresia.alumno.nombre} {membresia.alumno.apellido}
                  </Typography>
                </Grid>

                {membresia.alumno.dni && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      DNI
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {membresia.alumno.dni}
                    </Typography>
                  </Grid>
                )}
              </>
            )}

            {/* Información del Grupo */}
            {membresia.grupo && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Información del Grupo
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Nombre del Grupo
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {membresia.grupo.nombre}
                  </Typography>
                </Grid>
              </>
            )}

            {/* Información del Pago */}
            {membresia.pago && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Información del Pago
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID del Pago
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    #{membresia.pago.id_pago}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Estado del Pago
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={membresia.pago.estado?.toUpperCase()}
                      color={membresia.pago.estado === 'pagado' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Grid>

                {membresia.pago.detalles && membresia.pago.detalles.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Detalles de Pago
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Método</TableCell>
                              <TableCell>Monto</TableCell>
                              <TableCell>Fecha</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {membresia.pago.detalles.map((detalle) => (
                              <TableRow key={detalle.id_detalle_pago}>
                                <TableCell>{detalle.metodo_pago}</TableCell>
                                <TableCell>{formatCurrency(detalle.monto_parcial)}</TableCell>
                                <TableCell>{formatDate(detalle.fecha_detalle)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Typography variant="h6" color="primary">
                          Total: {formatCurrency(getPagoTotal())}
                        </Typography>
                      </Box>
                    </Grid>
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
  );
}

export default MembreciaDetailsModal;

