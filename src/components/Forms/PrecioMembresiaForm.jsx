import React from 'react';
import { Save } from 'lucide-react';
import * as precioMembresiasService from '../../services/precioMembresiasService';
import * as tipoMembresiasService from '../../services/tipoMembresiasService';
import * as disciplinaService from '../../services/disciplinaService';
import { getTodayLocalDate } from '../../utils/helpers';
import { Button, Input, Select } from '../../components/ui';

function PrecioMembresiaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(() => {
    if (initialData) {
      return {
        ...initialData,
        fecha_inicio_vigencia: initialData.fecha_inicio_vigencia || initialData.fecha_inicio || '',
        fecha_fin_vigencia: initialData.fecha_fin_vigencia || initialData.fecha_fin || '',
        precio: initialData.precio || initialData.monto || '',
        id_tipo_membrecia: initialData.id_tipo_membrecia || '',
        id_disciplina: initialData.id_disciplina || '',
      };
    }
    return { id_tipo_membrecia: '', id_disciplina: '', precio: '', fecha_inicio_vigencia: getTodayLocalDate(), fecha_fin_vigencia: '' };
  });

  const [tiposMembrecia, setTiposMembrecia] = React.useState([]);
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    Promise.all([tipoMembresiasService.getAll({ limit: 100 }), disciplinaService.getAll({ limit: 100 })]).then(([t, d]) => {
      const tiposData = t?.data?.data || t?.data || t || [];
      const disciplinasData = d?.data?.data || d?.data || d || [];
      setTiposMembrecia(Array.isArray(tiposData) ? tiposData : []);
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_tipo_membrecia || !formData.precio) { setError('Tipo de membresía y precio son requeridos'); return; }
    setLoading(true);
    try {
      const payload = { ...formData, id_tipo_membrecia: parseInt(formData.id_tipo_membrecia), id_disciplina: formData.id_disciplina ? parseInt(formData.id_disciplina) : null, precio: parseFloat(formData.precio) };
      initialData?.id_precio ? await precioMembresiasService.update(initialData.id_precio, payload) : await precioMembresiasService.create(payload);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Select label="Tipo de Membresía" name="id_tipo_membrecia" value={formData.id_tipo_membrecia || ''} onChange={handleChange} required>
        {tiposMembrecia.map(t => <option key={t.id_tipo_membrecia} value={t.id_tipo_membrecia}>{t.tipo_membrecia}</option>)}
      </Select>
      <Select label="Disciplina" name="id_disciplina" value={formData.id_disciplina || ''} onChange={handleChange}>
        {disciplinas.map(d => <option key={d.id_disciplina} value={d.id_disciplina}>{d.disciplina}</option>)}
      </Select>
      <Input label="Precio" type="number" name="precio" value={formData.precio} onChange={handleChange} required />
      <Input label="Fecha Inicio Vigencia" type="date" name="fecha_inicio_vigencia" value={formData.fecha_inicio_vigencia} onChange={handleChange} />
      <Input label="Fecha Fin Vigencia" type="date" name="fecha_fin_vigencia" value={formData.fecha_fin_vigencia} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default PrecioMembresiaForm;