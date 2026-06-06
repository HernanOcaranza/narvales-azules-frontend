import React from 'react';
import { Save } from 'lucide-react';
import * as grupoService from '../../services/grupoService';
import * as alumnoService from '../../services/alumnoService';
import TipoMembreciaSelector from './TipoMembreciaSelector';
import DetallesPagoManager from './DetallesPagoManager';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';
import { Button, Input, Select } from '../ui';

export default function MembreciaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      const detallesPago = (initialData.pago?.detalles || []).map(detalle => ({
        ...detalle,
        id_detalle_pago: detalle.id_detalle_pago || undefined,
      }));
      
      return {
        ...initialData,
        fecha_inicio: formatDateForInput(initialData.fecha_inicio),
        detallesPago: detallesPago,
        fecha_pago: formatDateForInput(initialData.pago?.fecha_pago),
        observaciones_pago: initialData.pago?.observaciones || '',
      };
    }
    return {
      id_alumno: null,
      id_tipo_membrecia: null,
      id_grupo: '',
      fecha_inicio: getTodayLocalDate(),
      estado: 'activa',
      detallesPago: [],
      fecha_pago: getTodayLocalDate(),
      observaciones_pago: '',
    };
  });

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
    if (formData.id_alumno) {
      const alumnoSeleccionado = alumnos.find(a => a.id_alumno === formData.id_alumno);
      if (alumnoSeleccionado) {
        const textoEsperado = `${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}`;
        if (alumnoSearch !== textoEsperado) {
          setAlumnoSearch(textoEsperado);
        }
        return;
      }
    }

    if (alumnoSearch && alumnoSearch.length >= 2 && !formData.id_alumno) {
      const timeoutId = setTimeout(() => {
        searchAlumnos();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else if (alumnoSearch.length === 0 && !formData.id_alumno) {
      setAlumnos([]);
    }
  }, [alumnoSearch, formData.id_alumno]);

  const loadGrupos = async () => {
    try {
      const data = await grupoService.getAll({ limit: 100 });
      const gruposData = data?.data?.data || data?.data || data || [];
      setGrupos(Array.isArray(gruposData) ? gruposData : []);
    } catch (err) {
      console.error('Error al cargar grupos:', err);
    }
  };

  const searchAlumnos = async () => {
    setLoadingAlumnos(true);
    try {
      const data = await alumnoService.searchByNombre(alumnoSearch);
      const alumnosData = data?.data?.data || data?.data || data || [];
      setAlumnos(Array.isArray(alumnosData) ? alumnosData : []);
    } catch (err) {
      console.error('Error al buscar alumnos:', err);
      setAlumnos([]);
    } finally {
      setLoadingAlumnos(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.id_alumno) {
      setErrors({ id_alumno: 'El alumno es requerido' });
      return;
    }
    if (!formData.id_tipo_membrecia) {
      setErrors({ id_tipo_membrecia: 'El tipo de membresía es requerido' });
      return;
    }

    const membresiaData = {
      id_alumno: formData.id_alumno,
      id_tipo_membrecia: formData.id_tipo_membrecia,
      id_grupo: formData.id_grupo || null,
      fecha_inicio: formData.fecha_inicio,
      estado: formData.estado,
    };

    const requestData = { ...membresiaData };

    if (formData.detallesPago && formData.detallesPago.length > 0) {
      requestData.pago = {
        ...(initialData?.pago?.id_pago ? { id_pago: initialData.pago.id_pago } : {}),
        fecha_pago: formData.fecha_pago || formData.fecha_inicio,
        observaciones: formData.observaciones_pago || undefined,
        detalles: formData.detallesPago.map(detalle => ({
          ...(detalle.id_detalle_pago ? { id_detalle_pago: detalle.id_detalle_pago } : {}),
          metodo_pago: detalle.metodo_pago,
          monto_parcial: Number(detalle.monto_parcial),
          fecha_detalle: detalle.fecha_detalle,
          referencia_transferencia: detalle.referencia_transferencia || undefined,
        })),
      };
    }

    setLoading(true);
    try {
      if (onSuccess) {
        await onSuccess(requestData);
      }
    } catch (err) {
      console.error('Error al guardar membresía:', err);
      setError(err.message || 'Error al guardar la membresía');
    } finally {
      setLoading(false);
    }
  };

  const estados = ['activa', 'vencida', 'suspendida', 'cancelada'];

  const selectedAlumno = alumnos.find(a => a.id_alumno === formData.id_alumno);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="relative">
        <label className="block text-sm font-medium text-text-primary mb-1">
          Alumno <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`w-full px-3 py-2 rounded-lg border ${errors.id_alumno ? 'border-red-500' : 'border-gray-300'} focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none`}
          placeholder="Escriba para buscar..."
          value={alumnoSearch}
          onChange={(e) => setAlumnoSearch(e.target.value)}
        />
        {loadingAlumnos && (
          <div className="absolute right-3 top-9">
            <div className="w-4 h-4 border-2 border-primary-main border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {alumnos.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
            {alumnos.map(alumno => (
              <button
                key={alumno.id_alumno}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                onClick={() => {
                  handleChange('id_alumno', alumno.id_alumno);
                  setAlumnoSearch(`${alumno.nombre} ${alumno.apellido}`);
                  setAlumnos([]);
                }}
              >
                {alumno.nombre} {alumno.apellido}
              </button>
            ))}
          </div>
        )}
        {errors.id_alumno && (
          <p className="text-red-500 text-sm mt-1">{errors.id_alumno}</p>
        )}
      </div>

      <TipoMembreciaSelector
        value={formData.id_tipo_membrecia}
        onChange={(value) => handleChange('id_tipo_membrecia', value)}
        error={errors.id_tipo_membrecia}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-primary">Grupo</label>
        <select
          className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
          value={formData.id_grupo || ''}
          onChange={(e) => handleChange('id_grupo', e.target.value)}
        >
          <option value="">Seleccionar grupo</option>
          {grupos.map(grupo => (
            <option key={grupo.id_grupo} value={grupo.id_grupo}>
              {grupo.nombre}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Fecha de Inicio"
        type="date"
        name="fecha_inicio"
        value={formData.fecha_inicio}
        onChange={(e) => handleChange('fecha_inicio', e.target.value)}
        required
      />

      {initialData && (
        <Select
          label="Estado"
          value={formData.estado}
          onChange={(e) => handleChange('estado', e.target.value)}
        >
          {estados.map(estado => (
            <option key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
          ))}
        </Select>
      )}

      <div className="border-t border-gray-200 pt-4">
        <p className="font-medium text-text-primary mb-3">Información de Pago (Opcional)</p>
        
        <div className="space-y-3">
          <Input
            label="Fecha de Pago"
            type="date"
            name="fecha_pago"
            value={formData.fecha_pago}
            onChange={(e) => handleChange('fecha_pago', e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Observaciones del Pago</label>
            <textarea
              className="px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none resize-none"
              rows={2}
              value={formData.observaciones_pago}
              onChange={(e) => handleChange('observaciones_pago', e.target.value)}
              placeholder="Observaciones opcionales sobre el pago..."
            />
          </div>

          <DetallesPagoManager
            detalles={formData.detallesPago}
            onChange={(detalles) => handleChange('detallesPago', detalles)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}