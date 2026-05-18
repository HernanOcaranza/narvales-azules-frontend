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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import * as grupoService from '../../services/grupoService';
import GrupoForm from '../../components/Forms/GrupoForm';
import ConfirmDeleteDialog from '../../components/Dialogs/ConfirmDeleteDialog';
import GruposFilters from '../../components/grupos/GruposFilters';
import Pagination from '../../components/Pagination/Pagination';
import { obtenerNombreDia, DIAS_SEMANA } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

function Grupos() {
  const { userRole } = useAuth();
  const isProfesor = userRole === 'profesor';
  const isRecepcionista = userRole === 'recepcionista';
  const canEdit = !isProfesor && !isRecepcionista;
  const [grupos, setGrupos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, item: null });
  const [filters, setFilters] = React.useState({
    idDisciplina: '',
    idCategoria: '',
    estado: '',
    nombre: '',
  });
  const [pagination, setPagination] = React.useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  React.useEffect(() => {
    loadGrupos(pagination.page, pagination.limit);
  }, [filters]);

  const loadGrupos = async (page, limit) => {
    setLoading(true);
    try {
      const filtrosBackend = {};
      if (filters.idDisciplina) filtrosBackend.idDisciplina = parseInt(filters.idDisciplina);
      if (filters.idCategoria) filtrosBackend.idCategoria = parseInt(filters.idCategoria);
      if (filters.estado !== '') filtrosBackend.estado = filters.estado;
      if (filters.nombre) filtrosBackend.nombre = filters.nombre;

      const result = await grupoService.getAll({ page, limit, filters: filtrosBackend });
      const response = result?.data?.data || result?.data || result;
      const pagInfo = result?.data?.pagination || result?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
      setGrupos(Array.isArray(response) ? response : []);
      setPagination(pagInfo);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
      setGrupos([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    loadGrupos(newPage, pagination.limit);
  };

  const handleLimitChange = (newLimit) => {
    const limitNum = parseInt(newLimit, 10);
    setPagination(prev => ({ ...prev, limit: limitNum, page: 1 }));
    loadGrupos(1, limitNum);
  };

  const handleClearFilters = () => {
    setFilters({
      idDisciplina: '',
      idCategoria: '',
      estado: '',
      nombre: '',
    });
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
    loadGrupos(pagination.page, pagination.limit);
  };

  const handleDeleteClick = (item) => {
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.item) {
      try {
        await grupoService.deleteById(deleteDialog.item.id_grupo);
        setDeleteDialog({ open: false, item: null });
        loadGrupos(pagination.page, pagination.limit);
      } catch (error) {
        console.error('Error al eliminar grupo:', error);
        alert('Error al eliminar el grupo. Por favor, intente nuevamente.');
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

  const formatearHorarios = (horarios) => {
    if (!horarios || horarios.length === 0) {
      return 'Sin horarios configurados';
    }

    // Filtrar solo horarios activos
    const horariosActivos = horarios.filter(h => h.activo === 1);
    if (horariosActivos.length === 0) {
      return 'Sin horarios activos';
    }

    // Agrupar por hora
    const horariosPorHora = {};
    horariosActivos.forEach(horario => {
      const horaInicio = horario.hora_inicio?.substring(0, 5) || horario.hora_inicio;
      const horaFin = horario.hora_fin?.substring(0, 5) || horario.hora_fin;
      const key = `${horaInicio}-${horaFin}`;
      
      if (!horariosPorHora[key]) {
        horariosPorHora[key] = {
          hora: `${horaInicio} - ${horaFin}`,
          dias: []
        };
      }
      horariosPorHora[key].dias.push(obtenerNombreDia(horario.dia_semana));
    });

    // Formatear resultado
    return Object.values(horariosPorHora).map(item => {
      const diasAbreviados = item.dias.map(dia => {
        const index = DIAS_SEMANA.indexOf(dia);
        if (index === -1) return dia;
        // Abreviar días: Lunes -> Lun, Miércoles -> Mié, etc.
        return dia.substring(0, 3);
      });
      return `${diasAbreviados.join(', ')} ${item.hora}`;
    }).join(' | ');
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
        {canEdit ? (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
            Crear Nuevo Grupo
          </Button>
        ) : null}
      </Box>

      <Accordion 
        defaultExpanded={false}
        disableGutters 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          borderRadius: '8px !important',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          mb: 1,
          '& .MuiAccordionSummary-root': {
            minHeight: 40,
            p: '0 8px',
          },
          '& .MuiAccordionSummary-content': {
            my: 1,
          },
        }}
      >
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />}
          sx={{ 
            minHeight: 40, 
            p: '0 8px',
          }}
        >
          <FilterListIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
          <Typography sx={{ fontWeight: 500 }}>Filtros</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: '8px !important' }}>
          <GruposFilters
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
          />
        </AccordionDetails>
      </Accordion>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : isMobile ? (
        <Stack spacing={2}>
          {grupos.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" p={4}>
              No hay grupos registrados
            </Typography>
          ) : (
            grupos.map((grupo) => (
              <Card key={grupo.id_grupo} variant="outlined" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {grupo.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cupo Máximo: {grupo.cupo_maximo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Disciplina: {grupo.disciplina?.disciplina || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categoría: {grupo.categoria?.categoria || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Horarios: {formatearHorarios(grupo.horarios)}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    <Chip
                      label={getEstadoLabel(grupo.estado)}
                      color={getEstadoColor(grupo.estado)}
                      size="small"
                    />
                  </Box>
                  {canEdit && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenModal(grupo)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(grupo)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
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
                <TableCell>Cupo Máximo</TableCell>
                <TableCell>Disciplina</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Horarios</TableCell>
                <TableCell>Estado</TableCell>
                {canEdit && <TableCell align="right">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {grupos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canEdit ? 7 : 6} align="center">
                    <Typography variant="body1" color="text.secondary" p={2}>
                      No hay grupos registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                grupos.map((grupo) => (
                  <TableRow key={grupo.id_grupo} hover>
                    <TableCell>{grupo.nombre}</TableCell>
                    <TableCell>{grupo.cupo_maximo}</TableCell>
                    <TableCell>
                      {grupo.disciplina?.disciplina || grupo.id_disciplina || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {grupo.categoria?.categoria || grupo.id_categoria || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {formatearHorarios(grupo.horarios)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getEstadoLabel(grupo.estado)}
                        color={getEstadoColor(grupo.estado)}
                        size="small"
                      />
                    </TableCell>
                    {canEdit && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" color="primary" onClick={() => handleOpenModal(grupo)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(grupo)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      {/* Modal para crear/editar grupo */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingItem ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <GrupoForm
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
        title="el grupo"
        itemName={deleteDialog.item?.nombre || ''}
      />
    </Box>
  );
}

export default Grupos;

