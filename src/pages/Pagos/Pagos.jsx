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
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
// import api from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/helpers';

function Pagos() {
  const [pagos, setPagos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadPagos();
  }, []);

  const loadPagos = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const data = await api.get('/pagos');
      // setPagos(data);
      setPagos([]);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="contained" startIcon={<AddIcon />}>
          Registrar Pago
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {pagos.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay pagos registrados
            </Typography>
          ) : (
            pagos.map((pago) => (
              <Card key={pago.id}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {pago.alumnoNombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monto: {formatCurrency(pago.monto)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {formatDate(pago.fecha)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Método: {pago.metodoPago}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={pago.estado?.toUpperCase()}
                      color={getEstadoColor(pago.estado)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
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
                <TableCell>ID</TableCell>
                <TableCell>Alumno</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Método de Pago</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay pagos registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pagos.map((pago) => (
                  <TableRow key={pago.id} hover>
                    <TableCell>{pago.id}</TableCell>
                    <TableCell>{pago.alumnoNombre}</TableCell>
                    <TableCell>{formatCurrency(pago.monto)}</TableCell>
                    <TableCell>{formatDate(pago.fecha)}</TableCell>
                    <TableCell>{pago.metodoPago}</TableCell>
                    <TableCell>
                      <Chip
                        label={pago.estado?.toUpperCase()}
                        color={getEstadoColor(pago.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default Pagos;

