import React from 'react';
import { Save } from 'lucide-react';
import * as disciplinaService from '../../services/disciplinaService';
import { Button, Input } from '../../components/ui';

function DisciplinaForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || { disciplina: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.disciplina.trim()) { setError('La disciplina es requerida'); return; }
    setLoading(true);
    try {
      initialData?.id_disciplina ? await disciplinaService.update(initialData.id_disciplina, formData) : await disciplinaService.create(formData);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="Disciplina" name="disciplina" value={formData.disciplina} onChange={handleChange} required autoFocus />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default DisciplinaForm;