import React from 'react';
import { Save } from 'lucide-react';
import * as categoriaService from '../../services/categoriaService';
import { Button, Input } from '../../components/ui';

function CategoriaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || { categoria: '', descripcion: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categoria.trim()) { setError('La categoría es requerida'); return; }
    setLoading(true);
    try {
      initialData?.id_categoria ? await categoriaService.update(initialData.id_categoria, formData) : await categoriaService.create(formData);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange} required autoFocus />
      <Input label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default CategoriaForm;