import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as grupoService from '../../services/grupoService';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';

function NuevoGrupo() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados del formulario
  const [formData, setFormData] = React.useState({
    nombre: '',
    cupo_maximo: '',
    estado: 1,
    id_disciplina: '',
    id_categoria: '',
  });

  // Estados para las opciones de los desplegables
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);

  // Estados de carga y errores
  const [loading, setLoading] = React.useState(false);
  const [loadingDisciplinas, setLoadingDisciplinas] = React.useState(true);
  const [loadingCategorias, setLoadingCategorias] = React.useState(true);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  // Cargar disciplinas y categorías al montar el componente
  React.useEffect(() => {
    loadDisciplinas();
    loadCategorias();
  }, []);

  const loadDisciplinas = async () => {
    setLoadingDisciplinas(true);
    try {
      const data = await disciplinaService.getAll();
      // Asegurar que siempre sea un array
      setDisciplinas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar disciplinas:', error);
      setDisciplinas([]);
    } finally {
      setLoadingDisciplinas(false);
    }
  };

  const loadCategorias = async () => {
    setLoadingCategorias(true);
    try {
      const data = await categoriaService.getAll();
      // Asegurar que siempre sea un array
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setCategorias([]);
    } finally {
      setLoadingCategorias(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cupo_maximo' || name === 'estado' ? Number(value) : value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length > 40) {
      newErrors.nombre = 'El nombre no puede tener más de 40 caracteres';
    }

    if (!formData.cupo_maximo || formData.cupo_maximo <= 0) {
      newErrors.cupo_maximo = 'El cupo máximo debe ser mayor a 0';
    }

    if (!formData.id_disciplina) {
      newErrors.id_disciplina = 'Debe seleccionar una disciplina';
    }

    if (!formData.id_categoria) {
      newErrors.id_categoria = 'Debe seleccionar una categoría';
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
      await grupoService.create(formData);
      navigate(-1); // Volver a la página anterior
    } catch (error) {
      console.error('Error al crear grupo:', error);
      setError(
        error.response?.data?.message ||
          'Error al crear el grupo. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ minWidth: 'auto' }}
        >
          Volver
        </Button>
        <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
          Nuevo Grupo
        </Typography>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          maxWidth: { xs: '100%', sm: 600 },
          mx: 'auto',
        }}
      >
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
              inputProps={{ maxLength: 40 }}
            />

            {/* Cupo Máximo */}
            <TextField
              label="Cupo Máximo"
              name="cupo_maximo"
              type="number"
              value={formData.cupo_maximo}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.cupo_maximo}
              helperText={errors.cupo_maximo}
              inputProps={{ min: 1 }}
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

            {/* Disciplina */}
            <FormControl fullWidth required error={!!errors.id_disciplina}>
              <InputLabel>Disciplina</InputLabel>
              <Select
                name="id_disciplina"
                value={formData.id_disciplina}
                onChange={handleChange}
                label="Disciplina"
                disabled={loadingDisciplinas}
              >
                {loadingDisciplinas ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Cargando...
                  </MenuItem>
                ) : disciplinas.length === 0 ? (
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      No hay disciplinas disponibles
                    </Typography>
                  </MenuItem>
                ) : (
                  disciplinas.map((disciplina) => (
                    <MenuItem key={disciplina.id_disciplina} value={disciplina.id_disciplina}>
                      {disciplina.disciplina}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.id_disciplina && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.id_disciplina}
                </Typography>
              )}
              {!loadingDisciplinas && disciplinas.length === 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  No hay ninguna disciplina creada. Por favor, cree una disciplina primero.
                </Alert>
              )}
            </FormControl>

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
              {!loadingCategorias && categorias.length === 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  No hay ninguna categoría creada. Por favor, cree una categoría primero.
                </Alert>
              )}
            </FormControl>

            {/* Botones */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ pt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                fullWidth={isMobile}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                fullWidth={isMobile}
                disabled={loading || loadingDisciplinas || loadingCategorias}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

export default NuevoGrupo;

