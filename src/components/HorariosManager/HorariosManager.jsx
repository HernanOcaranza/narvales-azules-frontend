import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui';
import { DIAS_SEMANA } from '../../utils/constants';

function HorariosManager({ horarios = [], onChange }) {
  const addHorario = () => onChange([...horarios, { dia_semana: 1, hora_inicio: '08:00', hora_fin: '09:00', activo: true }]);
  const removeHorario = (index) => onChange(horarios.filter((_, i) => i !== index));
  const updateHorario = (index, field, value) => {
    const updated = [...horarios];
    updated[index][field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {horarios.map((horario, index) => (
        <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
          <select className="px-2 py-1 rounded border" value={horario.dia_semana} onChange={(e) => updateHorario(index, 'dia_semana', parseInt(e.target.value))}>
            {DIAS_SEMANA.map(d => <option key={d.valor} value={d.valor}>{d.nombre}</option>)}
          </select>
          <input type="time" className="px-2 py-1 rounded border" value={horario.hora_inicio} onChange={(e) => updateHorario(index, 'hora_inicio', e.target.value)} />
          <span className="text-text-secondary">a</span>
          <input type="time" className="px-2 py-1 rounded border" value={horario.hora_fin} onChange={(e) => updateHorario(index, 'hora_fin', e.target.value)} />
          <button onClick={() => removeHorario(index)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addHorario}>Agregar Horario</Button>
    </div>
  );
}

export default HorariosManager;