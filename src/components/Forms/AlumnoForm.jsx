import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Autocomplete,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Save as SaveIcon, Add as AddIcon } from '@mui/icons-material';
import * as alumnoService from '../../services/alumnoService';
import * as tutorService from '../../services/tutorService';
import * as categoriaService from '../../services/categoriaService';
import * as condicionService from '../../services/condicionService';
import TutorForm from './TutorForm';

function AlumnoForm({ onSuccess, onCancel, initialData = null }) {
  // Función para formatear fecha a YYYY-MM-DD para input type="date"
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  // Estados del formulario
  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_nacimiento: formatDateForInput(initialData.fecha_nacimiento),
        fecha_registro: formatDateForInput(initialData.fecha_registro),
        certificado: initialData.certificado !== undefined && initialData.certificado !== null ? initialData.certificado : 0,
      };
    }
    return {
      nombre: '',
      apellido: '',
      dni: '',
      fecha_nacimiento: '',
      direccion: '',
      fecha_registro: new Date().toISOString().split('T')[0],
      estado: 1,
      certificado: 0,
      id_tutor: '',
      id_categoria: '',
      id_condicion: '',
    };
  });

  // Estados para las opciones de los desplegables
  const [categorias, setCategorias] = React.useState([]);
  const [condiciones, setCondiciones] = React.useState([]);
  const [tutores, setTutores] = React.useState([]);
  const [tutorSearchText, setTutorSearchText] = React.useState('');
  const [selectedTutor, setSelectedTutor] = React.useState(null);
  const [loadingTutores, setLoadingTutores] = React.useState(false);

  // Estados para el modal de tutor
  const [openTutorModal, setOpenTutorModal] = React.useState(false);

  // Estados de carga y errores
  const [loading, setLoading] = React.useState(false);
  const [loadingCategorias, setLoadingCategorias] = React.useState(true);
  const [loadingCondiciones, setLoadingCondiciones] = React.useState(true);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  // Funciones para cargar datos
  const loadCategorias = React.useCallback(async () => {
    setLoadingCategorias(true);
    try {
      const data = await categoriaService.getAll();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    } finally {
      setLoadingCategorias(false);
    }
  }, []);

  const loadCondiciones = React.useCallback(async () => {
    setLoadingCondiciones(true);
    try {
      const data = await condicionService.getAll();
      setCondiciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar condiciones:', error);
      setCondiciones([]);
    } finally {
      setLoadingCondiciones(false);
    }
  }, []);

  const loadTutorById = React.useCallback(async (id) => {
    try {
      const response = await tutorService.getById(id);
      const tutor = response?.data || response;
      setSelectedTutor(tutor);
      setTutorSearchText(tutor ? `${tutor.nombre} ${tutor.apellido}` : '');
    } catch (error) {
      console.error('Error al cargar tutor:', error);
    }
  }, []);

  const searchTutores = React.useCallback(async (nombre) => {
    setLoadingTutores(true);
    try {
      const data = await tutorService.searchByNombre(nombre);
      setTutores(Array.isArray(data) ? data : []);
    } catch (error) {
      // Solo mostrar error si no es un 404 (ruta no encontrada)
      if (error.response?.status !== 404) {
        console.error('Error al buscar tutores:', error);
      }
      setTutores([]);
    } finally {
      setLoadingTutores(false);
    }
  }, []);

  // Cargar categorías y condiciones al montar el componente
  React.useEffect(() => {
    loadCategorias();
    loadCondiciones();
  }, [loadCategorias, loadCondiciones]);

  // Cargar tutor si hay initialData con id_tutor
  React.useEffect(() => {
    if (initialData && initialData.id_tutor) {
      loadTutorById(initialData.id_tutor);
    }
  }, [initialData, loadTutorById]);

  // Buscar tutores cuando cambia el texto de búsqueda
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tutorSearchText.trim().length >= 2) {
        searchTutores(tutorSearchText);
      } else {
        setTutores([]);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [tutorSearchText, searchTutores]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (checked ? 1 : 0)
        : name === 'estado' 
        ? Number(value) 
        : value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTutorChange = (event, newValue) => {
    // Si es el botón de agregar, abrir el modal
    if (newValue && newValue.isAddButton) {
      handleOpenTutorModal();
      return;
    }
    
    if (newValue && newValue.id_tutor) {
      // Es un tutor seleccionado
      setSelectedTutor(newValue);
      setFormData((prev) => ({
        ...prev,
        id_tutor: newValue.id_tutor,
      }));
      setTutorSearchText(`${newValue.nombre} ${newValue.apellido}`);
      if (errors.id_tutor) {
        setErrors((prev) => ({
          ...prev,
          id_tutor: '',
        }));
      }
    } else {
      // Se limpió la selección
      setSelectedTutor(null);
      setFormData((prev) => ({
        ...prev,
        id_tutor: '',
      }));
      setTutorSearchText('');
    }
  };

  const handleOpenTutorModal = () => {
    setOpenTutorModal(true);
  };

  const handleCloseTutorModal = () => {
    setOpenTutorModal(false);
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 50) {
      newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length > 50) {
      newErrors.apellido = 'El apellido no puede tener más de 50 caracteres';
    }

    if (formData.dni && formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 caracteres';
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!formData.fecha_registro) {
      newErrors.fecha_registro = 'La fecha de registro es requerida';
    }

    if (!formData.id_tutor) {
      newErrors.id_tutor = 'Debe seleccionar un tutor';
    }

    if (!formData.id_categoria) {
      newErrors.id_categoria = 'Debe seleccionar una categoría';
    }

    if (!formData.id_condicion) {
      newErrors.id_condicion = 'Debe seleccionar una condición';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const isEditing = initialData && initialData.id_alumno;
      
      // Preparar datos para enviar - solo campos actualizables
      const dataToSend = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: formData.dni || null,
        fecha_nacimiento: formData.fecha_nacimiento,
        direccion: formData.direccion || null,
        fecha_registro: formData.fecha_registro,
        estado: formData.estado,
        certificado: formData.certificado !== undefined ? formData.certificado : 0,
        id_tutor: formData.id_tutor,
        id_categoria: formData.id_categoria,
        id_condicion: formData.id_condicion,
      };

      if (isEditing) {
        await alumnoService.update(initialData.id_alumno, dataToSend);
      } else {
        await alumnoService.create(dataToSend);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar alumno:', error);
      setError(
        error.response?.data?.message ||
          error.message ||
          'Error al guardar el alumno. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Nombre */}
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre}
            inputProps={{ maxLength: 50 }}
            autoFocus
          />

          {/* Apellido */}
          <TextField
            label="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.apellido}
            helperText={errors.apellido}
            inputProps={{ maxLength: 50 }}
          />

          {/* DNI */}
          <TextField
            label="DNI"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            fullWidth
            error={!!errors.dni}
            helperText={errors.dni || 'Opcional - 8 caracteres'}
            inputProps={{ maxLength: 8 }}
          />

          {/* Fecha de Nacimiento */}
          <TextField
            label="Fecha de Nacimiento"
            name="fecha_nacimiento"
            type="date"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.fecha_nacimiento}
            helperText={errors.fecha_nacimiento}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Dirección */}
          <TextField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            error={!!errors.direccion}
            helperText={errors.direccion}
          />

          {/* Fecha de Registro */}
          <TextField
            label="Fecha de Registro"
            name="fecha_registro"
            type="date"
            value={formData.fecha_registro}
            onChange={handleChange}
            required
            fullWidth
            error={!!errors.fecha_registro}
            helperText={errors.fecha_registro}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Estado */}
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              label="Estado"
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>

          {/* Certificado Médico */}
          <FormControlLabel
            control={
              <Checkbox
                name="certificado"
                checked={formData.certificado === 1}
                onChange={handleChange}
              />
            }
            label="Certificado Médico"
          />

          {/* Tutor - Autocomplete con búsqueda */}
          <Box>
            <Autocomplete
              options={
                tutorSearchText.trim().length >= 2
                  ? [{ isAddButton: true, label: 'Agregar Nuevo Tutor' }, ...tutores]
                  : [{ isAddButton: true, label: 'Agregar Nuevo Tutor' }]
              }
              getOptionLabel={(option) => {
                if (option.isAddButton) {
                  return option.label;
                }
                return option.id_tutor
                  ? `${option.nombre} ${option.apellido}`
                  : '';
              }}
              value={selectedTutor}
              onChange={handleTutorChange}
              onInputChange={(event, newInputValue) => {
                setTutorSearchText(newInputValue);
              }}
              inputValue={tutorSearchText}
              loading={loadingTutores}
              filterOptions={(x) => x} // Desactivar filtrado local, usamos el del servidor
              isOptionEqualToValue={(option, value) => {
                if (option.isAddButton || value?.isAddButton) return false;
                return option.id_tutor === value?.id_tutor;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tutor"
                  required
                  error={!!errors.id_tutor}
                  helperText={errors.id_tutor}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingTutores ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => {
                // Si es el botón de agregar nuevo tutor
                if (option.isAddButton) {
                  return (
                    <Box
                      {...props}
                      key="add-tutor-button"
                      component="li"
                      sx={{
                        borderBottom: tutorSearchText.trim().length >= 2 && tutores.length > 0 ? '1px solid #e0e0e0' : 'none',
                        pb: 1,
                        mb: tutorSearchText.trim().length >= 2 && tutores.length > 0 ? 0.5 : 0,
                        '&:hover': {
                          backgroundColor: 'transparent',
                        },
                      }}
                    >
                      <Button
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTutorModal();
                        }}
                        variant="outlined"
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        {option.label}
                      </Button>
                    </Box>
                  );
                }
                // Opción normal de tutor
                return (
                  <Box {...props} key={option.id_tutor} component="li">
                    {option.nombre} {option.apellido}
                  </Box>
                );
              }}
              noOptionsText={
                tutorSearchText.trim().length < 2
                  ? 'Escriba al menos 2 caracteres para buscar'
                  : 'No se encontraron tutores'
              }
            />
            {errors.id_tutor && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.id_tutor}
              </Typography>
            )}
          </Box>

          {/* Categoría */}
          <FormControl fullWidth required error={!!errors.id_categoria}>
            <InputLabel>Categoría</InputLabel>
            <Select
              name="id_categoria"
              value={formData.id_categoria}
              onChange={handleChange}
              label="Categoría"
              disabled={loadingCategorias}
            >
              {loadingCategorias ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Cargando...
                </MenuItem>
              ) : categorias.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No hay categorías disponibles
                  </Typography>
                </MenuItem>
              ) : (
                categorias.map((categoria) => (
                  <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.categoria}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.id_categoria && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.id_categoria}
              </Typography>
            )}
          </FormControl>

          {/* Condición */}
          <FormControl fullWidth required error={!!errors.id_condicion}>
            <InputLabel>Condición</InputLabel>
            <Select
              name="id_condicion"
              value={formData.id_condicion}
              onChange={handleChange}
              label="Condición"
              disabled={loadingCondiciones}
            >
              {loadingCondiciones ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Cargando...
                </MenuItem>
              ) : condiciones.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No hay condiciones disponibles
                  </Typography>
                </MenuItem>
              ) : (
                condiciones.map((condicion) => (
                  <MenuItem key={condicion.id_condicion} value={condicion.id_condicion}>
                    {condicion.condicion}
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.id_condicion && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.id_condicion}
              </Typography>
            )}
          </FormControl>

          {/* Botones */}
          <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading || loadingCategorias || loadingCondiciones}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Stack>
        </Stack>
      </form>

      {/* Modal para crear nuevo tutor */}
      <Dialog
        open={openTutorModal}
        onClose={handleCloseTutorModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Crear Nuevo Tutor</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TutorForm
              onSuccess={async (newTutor) => {
                // Si se creó un tutor nuevo, seleccionarlo automáticamente
                if (newTutor && newTutor.id_tutor) {
                  setSelectedTutor(newTutor);
                  setFormData((prev) => ({
                    ...prev,
                    id_tutor: newTutor.id_tutor,
                  }));
                  setTutorSearchText(`${newTutor.nombre} ${newTutor.apellido}`);
                  // Limpiar error del campo tutor si existe
                  if (errors.id_tutor) {
                    setErrors((prev) => ({
                      ...prev,
                      id_tutor: '',
                    }));
                  }
                } else {
                  // Si no se recibió el tutor, recargar la búsqueda
                  if (tutorSearchText.trim().length >= 2) {
                    await searchTutores(tutorSearchText);
                  }
                }
                handleCloseTutorModal();
              }}
              onCancel={handleCloseTutorModal}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AlumnoForm;

