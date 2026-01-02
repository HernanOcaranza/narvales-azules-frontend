import React from 'react';
import {
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import * as alumnoService from '../../services/alumnoService';
import * as grupoService from '../../services/grupoService';
import TipoMembreciaSelector from './TipoMembreciaSelector';
import DetallesPagoManager from './DetallesPagoManager';
import { validateMembrecia, validateDetallePago } from '../../utils/validators';

function MembreciaForm({ onSuccess, onCancel, initialData = null }) {
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      // Asegurarse de que los detalles de pago incluyan sus IDs si existen
      const detallesPago = (initialData.pago?.detalles || []).map(detalle => ({
        ...detalle,
        // Preservar el ID si existe para poder actualizarlo
        id_detalle_pago: detalle.id_detalle_pago || undefined,
      }));
      
      return {
        ...initialData,
        fecha_inicio: formatDateForInput(initialData.fecha_inicio),
        fecha_fin: formatDateForInput(initialData.fecha_fin),
        detallesPago: detallesPago,
        fecha_pago: formatDateForInput(initialData.pago?.fecha_pago),
        observaciones_pago: initialData.pago?.observaciones || '',
      };
    }
    return {
      id_alumno: null,
      id_tipo_membrecia: null,
      id_grupo: null,
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      estado: 'activa',
      detallesPago: [],
      fecha_pago: new Date().toISOString().split('T')[0],
      observaciones_pago: '',
    };
  });

  // Actualizar formData cuando cambia initialData (útil cuando se carga la membresía completa)
  React.useEffect(() => {
    if (initialData) {
      const detallesPago = (initialData.pago?.detalles || []).map(detalle => ({
        ...detalle,
        id_detalle_pago: detalle.id_detalle_pago || undefined,
      }));
      
      setFormData(prev => ({
        ...prev,
        ...initialData,
        fecha_inicio: formatDateForInput(initialData.fecha_inicio),
        fecha_fin: formatDateForInput(initialData.fecha_fin),
        detallesPago: detallesPago,
        fecha_pago: formatDateForInput(initialData.pago?.fecha_pago) || prev.fecha_pago,
        observaciones_pago: initialData.pago?.observaciones || prev.observaciones_pago,
      }));
    }
  }, [initialData]);

  const [alumnos, setAlumnos] = React.useState([]);
  const [grupos, setGrupos] = React.useState([]);
  const [alumnoSearch, setAlumnoSearch] = React.useState('');
  const [loadingAlumnos, setLoadingAlumnos] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    loadGrupos();
    if (initialData && initialData.alumno) {
      const alumnoInicial = initialData.alumno;
      setAlumnos([alumnoInicial]);
      setAlumnoSearch(`${alumnoInicial.nombre} ${alumnoInicial.apellido}`);
    }
  }, [initialData]);

  React.useEffect(() => {
    // Si hay un alumno seleccionado, asegurar que esté en la lista y el texto coincida
    if (formData.id_alumno) {
      const alumnoSeleccionado = alumnos.find(a => a.id_alumno === formData.id_alumno);
      if (alumnoSeleccionado) {
        const textoEsperado = `${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}`;
        if (alumnoSearch !== textoEsperado) {
          setAlumnoSearch(textoEsperado);
        }
        return; // No buscar si ya está seleccionado
      }
    }

    // Buscar solo si hay texto y no hay alumno seleccionado
    if (alumnoSearch && alumnoSearch.length >= 2 && !formData.id_alumno) {
      const timeoutId = setTimeout(() => {
        searchAlumnos();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (alumnoSearch.length === 0 && !formData.id_alumno) {
      // Solo limpiar si no hay alumno seleccionado
      setAlumnos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alumnoSearch, formData.id_alumno]);

  const loadGrupos = async () => {
    try {
      const data = await grupoService.getAll();
      setGrupos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar grupos:', err);
    }
  };

  const searchAlumnos = async () => {
    setLoadingAlumnos(true);
    try {
      const data = await alumnoService.searchByNombre(alumnoSearch);
      setAlumnos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al buscar alumnos:', err);
      setAlumnos([]);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar datos de membresía (sin pago)
    const membresiaData = {
      id_alumno: formData.id_alumno,
      id_tipo_membrecia: formData.id_tipo_membrecia,
      id_grupo: formData.id_grupo,
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin || undefined,
      estado: formData.estado,
    };

    const validationErrors = validateMembrecia(membresiaData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Validar detalles de pago si existen
    if (formData.detallesPago && formData.detallesPago.length > 0) {
      const detallesErrors = {};
      formData.detallesPago.forEach((detalle, index) => {
        const detalleErrors = validateDetallePago(detalle);
        if (Object.keys(detalleErrors).length > 0) {
          detallesErrors[`detalle_${index}`] = detalleErrors;
        }
      });
      if (Object.keys(detallesErrors).length > 0) {
        setErrors({ ...errors, detallesPago: 'Por favor, corrija los errores en los detalles de pago' });
        return;
      }
    }

    setLoading(true);
    try {
      if (onSuccess) {
        // Preparar datos según el nuevo formato de API
        const requestData = {
          ...membresiaData,
        };

        // Si hay detalles de pago, incluir el objeto pago
        if (formData.detallesPago && formData.detallesPago.length > 0) {
          requestData.pago = {
            // Si estamos editando y hay un pago previo, incluir su ID
            ...(initialData?.pago?.id_pago ? { id_pago: initialData.pago.id_pago } : {}),
            fecha_pago: formData.fecha_pago || formData.fecha_inicio,
            estado: 'completo', // El estado debe ser: pendiente, parcial, completo, cancelado
            observaciones: formData.observaciones_pago || undefined,
            detalles: formData.detallesPago.map(detalle => ({
              // Incluir el ID si existe para que el backend sepa si es actualización o creación
              ...(detalle.id_detalle_pago ? { id_detalle_pago: detalle.id_detalle_pago } : {}),
              metodo_pago: detalle.metodo_pago,
              monto_parcial: Number(detalle.monto_parcial),
              fecha_detalle: detalle.fecha_detalle,
              referencia_transferencia: detalle.referencia_transferencia || undefined,
            })),
          };
        }

        // Log para debugging (puedes eliminarlo después)
        console.log('Datos del formulario a enviar:', JSON.stringify(requestData, null, 2));

        await onSuccess(requestData);
      }
    } catch (err) {
      console.error('Error al guardar membresía:', err);
      setError(err.message || 'Error al guardar la membresía. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const estados = ['activa', 'vencida', 'suspendida', 'cancelada'];

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Autocomplete
          options={alumnos}
          getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
          loading={loadingAlumnos}
          inputValue={alumnoSearch}
          onInputChange={(e, newValue, reason) => {
            // Solo actualizar si no es porque se seleccionó una opción
            if (reason !== 'reset') {
              setAlumnoSearch(newValue);
            }
          }}
          onChange={(e, newValue) => {
            handleChange('id_alumno', newValue?.id_alumno || null);
            // Si se deselecciona, limpiar también el texto
            if (!newValue) {
              setAlumnoSearch('');
            }
          }}
          value={alumnos.find(a => a.id_alumno === formData.id_alumno) || null}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Alumno"
              required
              error={!!errors.id_alumno}
              helperText={errors.id_alumno}
              placeholder="Escriba para buscar..."
            />
          )}
        />

        <TipoMembreciaSelector
          value={formData.id_tipo_membrecia}
          onChange={(value) => handleChange('id_tipo_membrecia', value)}
          error={errors.id_tipo_membrecia}
        />

        <FormControl fullWidth required error={!!errors.id_grupo}>
          <InputLabel>Grupo</InputLabel>
          <Select
            name="id_grupo"
            value={formData.id_grupo || ''}
            onChange={(e) => handleChange('id_grupo', e.target.value)}
            label="Grupo"
          >
            {grupos.map((grupo) => (
              <MenuItem key={grupo.id_grupo} value={grupo.id_grupo}>
                {grupo.nombre}
              </MenuItem>
            ))}
          </Select>
          {errors.id_grupo && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.id_grupo}
            </Alert>
          )}
        </FormControl>

        <TextField
          label="Fecha de Inicio"
          name="fecha_inicio"
          type="date"
          value={formData.fecha_inicio}
          onChange={(e) => handleChange('fecha_inicio', e.target.value)}
          required
          fullWidth
          error={!!errors.fecha_inicio}
          helperText={errors.fecha_inicio}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Fecha de Fin (Opcional)"
          name="fecha_fin"
          type="date"
          value={formData.fecha_fin}
          onChange={(e) => handleChange('fecha_fin', e.target.value)}
          fullWidth
          error={!!errors.fecha_fin}
          helperText={errors.fecha_fin}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth required error={!!errors.estado}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={formData.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            label="Estado"
          >
            {estados.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {errors.estado && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errors.estado}
            </Alert>
          )}
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Sección de Pago */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Información de Pago (Opcional)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Puede crear la membresía sin pago y agregarlo después, o agregar los detalles de pago ahora.
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Fecha de Pago"
              name="fecha_pago"
              type="date"
              value={formData.fecha_pago}
              onChange={(e) => handleChange('fecha_pago', e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Fecha del pago (solo si se agregan detalles de pago)"
            />

            <TextField
              label="Observaciones del Pago"
              name="observaciones_pago"
              value={formData.observaciones_pago}
              onChange={(e) => handleChange('observaciones_pago', e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Observaciones opcionales sobre el pago..."
            />

            <DetallesPagoManager
              detalles={formData.detallesPago}
              onChange={(detalles) => handleChange('detallesPago', detalles)}
              errors={errors.detallesPago ? { general: errors.detallesPago } : {}}
            />
          </Stack>
        </Box>

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
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default MembreciaForm;

