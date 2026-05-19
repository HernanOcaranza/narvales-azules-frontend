import React from 'react';
import { Save } from 'lucide-react';
import * as condicionService from '../../services/condicionService';
import { Button, Input } from '../../components/ui';

function CondicionForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = React.useState(initialData || { condicion: '', descripcion: '', atencion: 1 });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.condicion.trim()) { setError('La condición es requerida'); return; }
    setLoading(true);
    try {
      initialData?.id_condicion ? await condicionService.update(initialData.id_condicion, formData) : await condicionService.create(formData);
      onSuccess();
    } catch (err) { setError(err.message || 'Error al guardar'); } 
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}
      <Input label="Condición" name="condicion" value={formData.condicion} onChange={handleChange} required autoFocus />
      <Input label="Descripción" name="descripcion" value={formData.descripcion} onChange={handleChange} />
      <Input label="Atención" name="atencion" type="number" min="1" max="5" value={formData.atencion} onChange={handleChange} />
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" variant="primary" icon={Save} loading={loading}>Guardar</Button>
      </div>
    </form>
  );
}

export default CondicionForm;