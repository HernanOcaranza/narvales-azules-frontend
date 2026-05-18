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
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { formatDate, formatCurrency } from '../../utils/helpers';
import * as precioMembresiasService from '../../services/precioMembresiasService';

function MembresiasTable({
  membresias,
  loading,
  onViewDetails,
  onEdit,
  onDelete,
  onRenew,
  isMobile = false,
}) {
  const [preciosVigentes, setPreciosVigentes] = React.useState({});

  // Cargar precios vigentes para los tipos de membresía que no tienen detalles de pago
  React.useEffect(() => {
    const cargarPreciosVigentes = async () => {
      const preciosMap = {};
      const tiposNecesarios = new Set();

      membresias.forEach((membresia) => {
        // Solo cargar precio si no hay detalles de pago
        const tieneDetalles = membresia.pago?.detalles && Array.isArray(membresia.pago.detalles) && membresia.pago.detalles.length > 0;
        if (!tieneDetalles && membresia.id_tipo_membrecia && !preciosVigentes[membresia.id_tipo_membrecia]) {
          tiposNecesarios.add(membresia.id_tipo_membrecia);
        }
      });

      // Cargar precios vigentes para los tipos necesarios
      for (const idTipo of tiposNecesarios) {
        try {
          const precio = await precioMembresiasService.getPrecioVigente(idTipo);
          if (precio) {
            preciosMap[idTipo] = Number(precio.precio || precio.monto || 0);
          }
        } catch (err) {
          console.error(`Error al cargar precio vigente para tipo ${idTipo}:`, err);
        }
      }

      if (Object.keys(preciosMap).length > 0) {
        setPreciosVigentes((prev) => ({ ...prev, ...preciosMap }));
      }
    };

    if (membresias.length > 0) {
      cargarPreciosVigentes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membresias]);

  const getEstadoColor = (estado) => {
    const colors = {
      activa: 'success',
      vencida: 'error',
      suspendida: 'warning',
      cancelada: 'default',
    };
    return colors[estado] || 'default';
  };

  const isVencimientoProximo = (fechaFin) => {
    if (!fechaFin) return false;
    const fin = new Date(fechaFin);
    const hoy = new Date();
    const diffTime = fin - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const getPrecio = (membresia) => {
    // Primero intentar obtener el precio de los detalles de pago
    if (membresia.pago && membresia.pago.detalles && Array.isArray(membresia.pago.detalles) && membresia.pago.detalles.length > 0) {
      const totalDetalles = membresia.pago.detalles.reduce((sum, detalle) => sum + (Number(detalle.monto_parcial) || 0), 0);
      if (totalDetalles > 0) {
        return totalDetalles;
      }
    }
    
    // Si no hay detalles, intentar obtener el precio del tipo de membresía (de la cache o del objeto)
    if (membresia.tipo_membrecia && membresia.tipo_membrecia.precio_vigente) {
      return Number(membresia.tipo_membrecia.precio_vigente.precio || membresia.tipo_membrecia.precio_vigente.monto || 0);
    }
    
    // Si hay un precio en la cache de precios vigentes
    if (membresia.id_tipo_membrecia && preciosVigentes[membresia.id_tipo_membrecia]) {
      return preciosVigentes[membresia.id_tipo_membrecia];
    }
    
    // Si hay un precio directo en el pago (aunque no tenga detalles)
    if (membresia.pago && membresia.pago.precio) {
      return Number(membresia.pago.precio);
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
        {membresias.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
            No hay membresías registradas
          </Typography>
        ) : (
          membresias.map((membresia) => {
            const precio = getPrecio(membresia);
            const vencimientoProximo = isVencimientoProximo(membresia.fecha_fin);
            return (
              <Card key={membresia.id_membrecia} variant="outlined" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6">
                      Membresía
                    </Typography>
                    <Chip
                      label={membresia.estado?.toUpperCase()}
                      color={getEstadoColor(membresia.estado)}
                      size="small"
                    />
                  </Box>
                  {membresia.alumno && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Alumno: {membresia.alumno.nombre} {membresia.alumno.apellido}
                    </Typography>
                  )}
                  {membresia.tipo_membrecia && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tipo: {membresia.tipo_membrecia.tipo_membrecia || `Tipo ${membresia.tipo_membrecia.id_tipo_membrecia}`}
                    </Typography>
                  )}
                  {membresia.grupo && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Grupo: {membresia.grupo.nombre}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Inicio: {formatDate(membresia.fecha_inicio)}
                  </Typography>
                  {membresia.fecha_fin && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Fin: {formatDate(membresia.fecha_fin)}
                      {vencimientoProximo && (
                        <Chip label="Vence pronto" color="warning" size="small" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Precio: {formatCurrency(precio)}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary" onClick={() => onViewDetails(membresia)}>
                      <VisibilityIcon />
                    </IconButton>
                    {onEdit && (
                      <IconButton size="small" color="primary" onClick={() => onEdit(membresia)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {onRenew && membresia.estado === 'vencida' && (
                      <IconButton size="small" color="success" onClick={() => onRenew(membresia)}>
                        <RefreshIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton size="small" color="error" onClick={() => onDelete(membresia)}>
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
            <TableCell>Alumno</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Grupo</TableCell>
            <TableCell>Fecha Inicio</TableCell>
            <TableCell>Fecha Fin</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {membresias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body1" color="text.secondary" p={2}>
                  No hay membresías registradas
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            membresias.map((membresia) => {
              const precio = getPrecio(membresia);
              const vencimientoProximo = isVencimientoProximo(membresia.fecha_fin);
              return (
                <TableRow key={membresia.id_membrecia} hover>
                  <TableCell>
                    {membresia.alumno
                      ? `${membresia.alumno.nombre} ${membresia.alumno.apellido}`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {membresia.tipo_membrecia?.tipo_membrecia || '-'}
                  </TableCell>
                  <TableCell>{membresia.grupo?.nombre || '-'}</TableCell>
                  <TableCell>{formatDate(membresia.fecha_inicio)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {membresia.fecha_fin ? formatDate(membresia.fecha_fin) : '-'}
                      {vencimientoProximo && (
                        <Chip label="Vence pronto" color="warning" size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={membresia.estado?.toUpperCase()}
                      color={getEstadoColor(membresia.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {formatCurrency(precio)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => onViewDetails(membresia)}>
                        <VisibilityIcon />
                      </IconButton>
                      {onEdit && (
                        <IconButton size="small" color="primary" onClick={() => onEdit(membresia)}>
                          <EditIcon />
                        </IconButton>
                      )}
                      {onRenew && membresia.estado === 'vencida' && (
                        <IconButton size="small" color="success" onClick={() => onRenew(membresia)}>
                          <RefreshIcon />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton size="small" color="error" onClick={() => onDelete(membresia)}>
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

export default MembresiasTable;

