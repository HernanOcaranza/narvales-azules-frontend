import React from 'react';
import { Save } from 'lucide-react';
import * as grupoService from '../../services/grupoService';
import * as disciplinaService from '../../services/disciplinaService';
import * as categoriaService from '../../services/categoriaService';
import * as grupoEmpleadoService from '../../services/grupoEmpleadoService';
import { Button, Input, Select } from '../../components/ui';
import HorariosManager from '../HorariosManager/HorariosManager';
import EmpleadosManager from '../grupos/EmpleadosManager';

function GrupoForm({ onSuccess, onCancel, initialData = null }) {
  const normalizeEstado = (estado) => {
    if (estado === 1 || estado === '1' || estado === 'activo') return 'activo';
    return 'inactivo';
  };
  const [formData, setFormData] = React.useState(initialData ? { ...initialData, estado: normalizeEstado(initialData.estado) } : { nombre: '', cupo_maximo: '', id_disciplina: '', id_categoria: '', estado: 'activo' });
  const [disciplinas, setDisciplinas] = React.useState([]);
  const [categorias, setCategorias] = React.useState([]);
  const [horarios, setHorarios] = React.useState(initialData?.horarios || []);
  const [empleados, setEmpleados] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    Promise.all([disciplinaService.getAll({ limit: 100 }), categoriaService.getAll({ limit: 100 })]).then(([d, c]) => {
      const disciplinasData = d?.data?.data || d?.data || d || [];
      const categoriasData = c?.data?.data || c?.data || c || [];
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    });
    if (initialData?.id_grupo) {
      grupoEmpleadoService.getByGrupo(initialData.id_grupo).then(res => {
        const data = Array.isArray(res) ? res : [];
        setEmpleados(data.map(e => ({ id_empleado: e.id_empleado, rol: e.rol })));
      }).catch(() => {});
    }
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleHorariosChange = (newHorarios) => setHorarios(newHorarios);
  const handleEmpleadosChange = (newEmpleados) => setEmpleados(newEmpleados);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.id_disciplina) { setError('Nombre y disciplina son requeridos'); return; }
    setLoading(true);
    try {
      const payload = { ...formData, cupo_maximo: parseInt(formData.cupo_maximo), id_disciplina: parseInt(formData.id_disciplina), id_categoria: formData.id_categoria ? parseInt(formData.id_categoria) : null, estado: formData.estado === 'activo' ? 1 : 0, horarios };
      if (initialData?.id_grupo) {
        await grupoService.update(initialData.id_grupo, payload);
        if (empleados.length > 0) {
          await grupoEmpleadoService.asignarEmpleados(initialData.id_grupo, empleados);
        }
      } else {
        const created = await grupoService.create(payload);
        if (empleados.length > 0 && created?.data?.id_grupo) {
          await grupoEmpleadoService.asignarEmpleados(created.data.id_grupo, empleados);
        }
      }
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required autoFocus />
      <Input label="Cupo Máximo" name="cupo_maximo" type="number" min="1" value={formData.cupo_maximo} onChange={handleChange} required />
      <Select label="Disciplina" name="id_disciplina" value={formData.id_disciplina || ''} onChange={handleChange} required>
        {disciplinas.map(d => <option key={d.id_disciplina} value={d.id_disciplina}>{d.disciplina}</option>)}
      </Select>
      <Select label="Categoría" name="id_categoria" value={formData.id_categoria || ''} onChange={handleChange}>
        {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.categoria}</option>)}
      </Select>
      <Select label="Estado" name="estado" value={formData.estado || 'activo'} onChange={handleChange}>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </Select>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Horarios</label>
        <HorariosManager horarios={horarios} onChange={handleHorariosChange} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Empleados asignados</label>
        <EmpleadosManager empleados={empleados} onChange={handleEmpleadosChange} />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default GrupoForm;