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
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
// import api from '../../services/api';
import { formatDate } from '../../utils/helpers';

function Membresias() {
  const [membresias, setMembresias] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadMembresias();
  }, []);

  const loadMembresias = async () => {
    setLoading(true);
    try {
      // TODO: Reemplazar con endpoint real
      // const data = await api.get('/membresias');
      // setMembresias(data);
      setMembresias([]);
    } catch (error) {
      console.error('Error al cargar membresías:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      activo: 'success',
      inactivo: 'default',
      vencido: 'error',
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
          Nueva Membresía
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {membresias.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay membresías registradas
            </Typography>
          ) : (
            membresias.map((membresia) => (
              <Card key={membresia.id}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {membresia.alumnoNombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {membresia.tipo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {formatDate(membresia.fechaInicio)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fin: {formatDate(membresia.fechaFin)}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={membresia.estado?.toUpperCase()}
                      color={getEstadoColor(membresia.estado)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
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
                <TableCell>Alumno</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membresias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay membresías registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                membresias.map((membresia) => (
                  <TableRow key={membresia.id} hover>
                    <TableCell>{membresia.id}</TableCell>
                    <TableCell>{membresia.alumnoNombre}</TableCell>
                    <TableCell>{membresia.tipo}</TableCell>
                    <TableCell>{formatDate(membresia.fechaInicio)}</TableCell>
                    <TableCell>{formatDate(membresia.fechaFin)}</TableCell>
                    <TableCell>
                      <Chip
                        label={membresia.estado?.toUpperCase()}
                        color={getEstadoColor(membresia.estado)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" color="error">
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
    </Box>
  );
}

export default Membresias;

