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
  Divider,
  Box,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import * as grupoService from '../../services/grupoService';
import * as grupoHorarioService from '../../services/grupoHorarioService';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';
import HorariosManager from '../HorariosManager/HorariosManager';

function GrupoForm({ onSuccess, onCancel, initialData = null }) {
  // Función para limpiar datos iniciales y asegurar que solo contengan campos serializables
  const getInitialFormData = React.useCallback(() => {
    if (initialData) {
      return {
        nombre: initialData.nombre || '',
        cupo_maximo: initialData.cupo_maximo || '',
        estado: initialData.estado ?? 1,
        id_disciplina: initialData.id_disciplina || '',
        id_categoria: initialData.id_categoria || '',
      };
    }
    return {
      nombre: '',
      cupo_maximo: '',
      estado: 1,
      id_disciplina: '',
      id_categoria: '',
    };
  }, [initialData]);

  // Estados del formulario
  const [formData, setFormData] = React.useState(getInitialFormData);

  // Estados para horarios
  const [horarios, setHorarios] = React.useState([]);
  const [loadingHorarios, setLoadingHorarios] = React.useState(false);

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
    
    // Si estamos editando, cargar horarios existentes
    if (initialData && initialData.id_grupo) {
      loadHorarios(initialData.id_grupo);
    } else if (initialData && initialData.horarios) {
      // Si los horarios vienen en initialData, limpiarlos para asegurar que solo contengan datos serializables
      const horariosLimpios = initialData.horarios.map(h => ({
        id_grupo_horario: h.id_grupo_horario,
        id_grupo: h.id_grupo,
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        activo: h.activo,
      }));
      setHorarios(horariosLimpios);
    }
  }, [initialData]);

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

  const loadHorarios = async (idGrupo) => {
    setLoadingHorarios(true);
    try {
      const data = await grupoHorarioService.getByGrupo(idGrupo);
      // Asegurar que siempre sea un array y limpiar solo los campos necesarios
      const horariosData = Array.isArray(data) ? data : [];
      // Limpiar los horarios para asegurar que solo contengan datos serializables
      const horariosLimpios = horariosData.map(h => ({
        id_grupo_horario: h.id_grupo_horario,
        id_grupo: h.id_grupo,
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        activo: h.activo,
      }));
      setHorarios(horariosLimpios);
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      setHorarios([]);
    } finally {
      setLoadingHorarios(false);
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

  const handleHorariosChange = (newHorarios) => {
    // Asegurar que solo guardamos datos serializables
    const horariosLimpios = newHorarios.map(h => ({
      id_grupo_horario: h.id_grupo_horario,
      id_grupo: h.id_grupo,
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      activo: h.activo,
    }));
    setHorarios(horariosLimpios);
  };

  const formatTimeForAPI = (time) => {
    // Convertir HH:MM a HH:MM:SS para la API
    if (!time) return '';
    if (time.length === 5) return `${time}:00`;
    return time;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (initialData && initialData.id_grupo) {
        // Actualizar grupo - crear objeto limpio con solo los campos necesarios
        const grupoData = {
          nombre: formData.nombre,
          cupo_maximo: formData.cupo_maximo,
          estado: formData.estado,
          id_disciplina: formData.id_disciplina,
          id_categoria: formData.id_categoria,
        };
        await grupoService.update(initialData.id_grupo, grupoData);
        
        // Gestionar horarios por separado
        // Obtener horarios actuales del servidor
        const horariosActualesResponse = await grupoHorarioService.getByGrupo(initialData.id_grupo);
        // Limpiar los horarios para asegurar que solo contengan datos serializables
        const horariosActuales = (Array.isArray(horariosActualesResponse) ? horariosActualesResponse : []).map(h => ({
          id_grupo_horario: h.id_grupo_horario,
          id_grupo: h.id_grupo,
          dia_semana: h.dia_semana,
          hora_inicio: h.hora_inicio,
          hora_fin: h.hora_fin,
          activo: h.activo,
        }));
        
        // Identificar horarios a eliminar (están en el servidor pero no en el estado local)
        const horariosAEliminar = horariosActuales.filter(
          h => !horarios.some(localH => localH.id_grupo_horario === h.id_grupo_horario)
        );
        
        // Eliminar horarios que ya no están
        for (const horario of horariosAEliminar) {
          await grupoHorarioService.deleteById(horario.id_grupo_horario);
        }
        
        // Identificar horarios nuevos (no tienen id_grupo_horario)
        const horariosNuevos = horarios.filter(h => !h.id_grupo_horario);
        
        // Crear nuevos horarios
        if (horariosNuevos.length > 0) {
          const horariosParaCrear = horariosNuevos.map(h => ({
            id_grupo: initialData.id_grupo,
            dia_semana: h.dia_semana,
            hora_inicio: formatTimeForAPI(h.hora_inicio),
            hora_fin: formatTimeForAPI(h.hora_fin),
            activo: h.activo || 1,
          }));
          await grupoHorarioService.createMultiple(horariosParaCrear);
        }
        
        // Identificar horarios a actualizar (tienen id_grupo_horario pero han cambiado)
        const horariosAActualizar = horarios.filter(h => {
          if (!h.id_grupo_horario) return false;
          const horarioActual = horariosActuales.find(ha => ha.id_grupo_horario === h.id_grupo_horario);
          if (!horarioActual) return false;
          return (
            horarioActual.dia_semana !== h.dia_semana ||
            formatTimeForAPI(horarioActual.hora_inicio) !== formatTimeForAPI(h.hora_inicio) ||
            formatTimeForAPI(horarioActual.hora_fin) !== formatTimeForAPI(h.hora_fin) ||
            horarioActual.activo !== h.activo
          );
        });
        
        // Actualizar horarios modificados
        for (const horario of horariosAActualizar) {
          await grupoHorarioService.update(horario.id_grupo_horario, {
            dia_semana: horario.dia_semana,
            hora_inicio: formatTimeForAPI(horario.hora_inicio),
            hora_fin: formatTimeForAPI(horario.hora_fin),
            activo: horario.activo || 1,
          });
        }
      } else {
        // Crear nuevo grupo con horarios - crear objeto limpio con solo los campos necesarios
        const payload = {
          nombre: formData.nombre,
          cupo_maximo: formData.cupo_maximo,
          estado: formData.estado,
          id_disciplina: formData.id_disciplina,
          id_categoria: formData.id_categoria,
        };
        
        // Agregar horarios si hay alguno
        if (horarios.length > 0) {
          payload.horarios = horarios.map(h => ({
            dia_semana: h.dia_semana,
            hora_inicio: formatTimeForAPI(h.hora_inicio),
            hora_fin: formatTimeForAPI(h.hora_fin),
            activo: h.activo || 1,
          }));
        }
        
        await grupoService.create(payload);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar grupo:', error);
      setError(
        error.message ||
          'Error al guardar el grupo. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <Divider sx={{ my: 2 }} />

        {/* Gestión de Horarios */}
        {loadingHorarios ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <HorariosManager
            horarios={horarios}
            onChange={handleHorariosChange}
            errors={errors}
          />
        )}

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
            disabled={loading || loadingDisciplinas || loadingCategorias}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default GrupoForm;

