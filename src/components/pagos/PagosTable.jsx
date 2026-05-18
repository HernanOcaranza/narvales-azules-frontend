import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../utils/helpers';

function PagosTable({
  pagos,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  isMobile = false,
}) {
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

  const calculateTotal = (pago) => {
    if (pago.detalles && Array.isArray(pago.detalles)) {
      return pago.detalles.reduce((sum, detalle) => sum + (Number(detalle.monto_parcial) || 0), 0);
    }
    return 0;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {pagos.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
            No hay pagos registrados
          </Typography>
        ) : (
          pagos.map((pago) => {
            const total = calculateTotal(pago);
            return (
              <Card key={pago.id_pago} variant="outlined" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">Pago</Typography>
                    <Chip
                      label={pago.tipo?.toUpperCase()}
                      color={getTipoColor(pago.tipo)}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Fecha: {formatDate(pago.fecha_pago)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Monto Total: {formatCurrency(total)}
                  </Typography>
                  <Box sx={{ my: 1 }}>
                    <Chip
                      label={pago.estado?.toUpperCase()}
                      color={getEstadoColor(pago.estado)}
                      size="small"
                    />
                  </Box>
                  {pago.empleado && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Empleado: {pago.empleado.nombre} {pago.empleado.apellido}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => onViewDetails(pago)}>
                      <VisibilityIcon />
                    </IconButton>
                    {onEdit && (
                      <IconButton size="small" color="primary" onClick={() => onEdit(pago)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton size="small" color="error" onClick={() => onDelete(pago)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Monto Total</TableCell>
            <TableCell>Empleado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pagos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body1" color="text.secondary" p={2}>
                  No hay pagos registrados
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            pagos.map((pago) => {
              const total = calculateTotal(pago);
              return (
                <TableRow key={pago.id_pago} hover>
                  <TableCell>
                    <Chip
                      label={pago.tipo?.toUpperCase()}
                      color={getTipoColor(pago.tipo)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(pago.fecha_pago)}</TableCell>
                  <TableCell>
                    <Chip
                      label={pago.estado?.toUpperCase()}
                      color={getEstadoColor(pago.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(total)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {pago.empleado
                      ? `${pago.empleado.nombre} ${pago.empleado.apellido}`
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => onViewDetails(pago)}>
                        <VisibilityIcon />
                      </IconButton>
                      {onEdit && (
                        <IconButton size="small" color="primary" onClick={() => onEdit(pago)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton size="small" color="error" onClick={() => onDelete(pago)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PagosTable;

