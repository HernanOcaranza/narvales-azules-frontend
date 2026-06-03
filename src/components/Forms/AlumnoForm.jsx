import React from 'react';
import { Save, Plus, X } from 'lucide-react';
import * as alumnoService from '../../services/alumnoService';
import * as tutorService from '../../services/tutorService';
import * as categoriaService from '../../services/categoriaService';
import * as condicionService from '../../services/condicionService';
import TutorForm from './TutorForm';
import { formatDateForInput, getTodayLocalDate } from '../../utils/helpers';
import { Button, Input, Select, Spinner } from '../../components/ui';

function AlumnoForm({ onSuccess, onCancel, initialData = null }) {
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
      fecha_registro: getTodayLocalDate(),
      estado: 1,
      certificado: 0,
      id_tutor: '',
      id_categoria: '',
      id_condicion: '',
    };
  });

  const [categorias, setCategorias] = React.useState([]);
  const [condiciones, setCondiciones] = React.useState([]);
  const [tutores, setTutores] = React.useState([]);
  const [tutorSearchText, setTutorSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showNewTutor, setShowNewTutor] = React.useState(false);
  const overlayClickRef = React.useRef(false);

  React.useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [cats, conds, tuts] = await Promise.all([
        categoriaService.getAll({ limit: 100 }),
        condicionService.getAll({ limit: 100 }),
        tutorService.getAll({ limit: 100 })
      ]);
      const catsData = cats?.data?.data || cats?.data || cats || [];
      const condsData = conds?.data?.data || conds?.data || conds || [];
      const tutsData = tuts?.data?.data || tuts?.data || tuts || [];
      setCategorias(Array.isArray(catsData) ? catsData : []);
      setCondiciones(Array.isArray(condsData) ? condsData : []);
      setTutores(Array.isArray(tutsData) ? tutsData : []);
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        id_categoria: formData.id_categoria ? parseInt(formData.id_categoria) : null,
        id_condicion: formData.id_condicion ? parseInt(formData.id_condicion) : null,
        id_tutor: formData.id_tutor ? parseInt(formData.id_tutor) : null,
        certificado: formData.certificado ? 1 : 0,
      };
      
      if (initialData?.id_alumno) {
        await alumnoService.update(initialData.id_alumno, payload);
      } else {
        await alumnoService.create(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Error al guardar el alumno');
    } finally {
      setLoading(false);
    }
  };

  const handleTutorCreated = (newTutor) => {
    setTutores(prev => [...prev, newTutor]);
    setFormData(prev => ({ ...prev, id_tutor: newTutor.id_tutor }));
    setShowNewTutor(false);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <Input
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
        <Input
          label="DNI"
          name="dni"
          value={formData.dni}
          onChange={handleChange}
        />
        <Input
          label="Fecha de Nacimiento"
          type="date"
          name="fecha_nacimiento"
          value={formData.fecha_nacimiento}
          onChange={handleChange}
          required
        />
        <Input
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
        />
        <Input
          label="Fecha de Registro"
          type="date"
          name="fecha_registro"
          value={formData.fecha_registro}
          onChange={handleChange}
        />
        <Select
          label="Categoría"
          name="id_categoria"
          value={formData.id_categoria || ''}
          onChange={handleChange}
        >
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.categoria}</option>
          ))}
        </Select>
        <Select
          label="Condición"
          name="id_condicion"
          value={formData.id_condicion || ''}
          onChange={handleChange}
        >
          {condiciones.map(cond => (
            <option key={cond.id_condicion} value={cond.id_condicion}>{cond.condicion}</option>
          ))}
        </Select>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-text-primary mb-1">Tutor</label>
            <select
              name="id_tutor"
              value={formData.id_tutor || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none"
            >
              <option value="">Seleccionar tutor...</option>
              {tutores.map(tutor => (
                <option key={tutor.id_tutor} value={tutor.id_tutor}>
                  {tutor.nombre} {tutor.apellido} - {tutor.telefono}
                </option>
              ))}
            </select>
          </div>
          <Button type="button" variant="outline" size="sm" icon={Plus} onClick={() => setShowNewTutor(true)}>
            Nuevo
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="certificado"
          name="certificado"
          checked={formData.certificado === 1}
          onChange={(e) => setFormData(prev => ({ ...prev, certificado: e.target.checked ? 1 : 0 }))}
          className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main"
        />
        <label htmlFor="certificado" className="text-sm text-text-primary">Certificado médico</label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary" icon={Save} loading={loading}>
          {initialData ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>

    {showNewTutor && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onMouseDown={(e) => { overlayClickRef.current = (e.target === e.currentTarget); }}
        onMouseUp={(e) => { if (e.target === e.currentTarget && overlayClickRef.current) setShowNewTutor(false); }}
      >
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Nuevo Tutor</h3>
            <button onClick={() => setShowNewTutor(false)} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <TutorForm
            onSuccess={handleTutorCreated}
            onCancel={() => setShowNewTutor(false)}
          />
        </div>
      </div>
    )}
  </>
);
}

export default AlumnoForm;