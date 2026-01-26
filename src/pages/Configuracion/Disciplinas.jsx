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
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import * as disciplinaService from '../../services/disciplinaService';
import DisciplinaForm from '../../components/Forms/DisciplinaForm';

function Disciplinas() {
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    setLoading(true);
    try {
      const data = await disciplinaService.getAll();
      setDisciplinas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar disciplinas:', error);
      setDisciplinas([]);
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
    loadDisciplinas();
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await disciplinaService.deleteById(deleteDialog.item.id_disciplina);
        setDeleteDialog({ open: false, item: null });
        loadDisciplinas();
      } catch (error) {
        console.error('Error al eliminar disciplina:', error);
        alert('Error al eliminar la disciplina. Por favor, intente nuevamente.');
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Nueva Disciplina
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {disciplinas.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay disciplinas registradas
            </Typography>
          ) : (
            disciplinas.map((disciplina) => (
              <Card key={disciplina.id_disciplina}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {disciplina.disciplina}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenModal(disciplina)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(disciplina)}
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
                <TableCell>Disciplina</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disciplinas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay disciplinas registradas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                disciplinas.map((disciplina) => (
                  <TableRow key={disciplina.id_disciplina} hover>
                    <TableCell>{disciplina.id_disciplina}</TableCell>
                    <TableCell>{disciplina.disciplina}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenModal(disciplina)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(disciplina)}
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

      {/* Modal para crear/editar disciplina */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Disciplina' : 'Nueva Disciplina'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DisciplinaForm
              onSuccess={handleSuccess}
              onCancel={handleCloseModal}
              initialData={editingItem}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar la disciplina "{deleteDialog.item?.disciplina}"?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Disciplinas;

