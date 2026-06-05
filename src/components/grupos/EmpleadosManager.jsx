import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import * as empleadoService from '../../services/empleadoService';

function EmpleadosManager({ empleados = [], onChange }) {
  const [empleadosDisponibles, setEmpleadosDisponibles] = React.useState([]);

  React.useEffect(() => {
    empleadoService.getAll().then((res) => {
      const data = res?.data || res || [];
      setEmpleadosDisponibles(Array.isArray(data) ? data : []);
    }).catch(() => setEmpleadosDisponibles([]));
  }, []);

  const addEmpleado = () => {
    if (empleadosDisponibles.length === 0) return;
    const firstAvailable = empleadosDisponibles.find(
      e => !empleados.some(emp => emp.id_empleado === e.id_empleado)
    );
    if (firstAvailable) {
      onChange([...empleados, { id_empleado: firstAvailable.id_empleado, rol: 'profesor' }]);
    }
  };

  const removeEmpleado = (index) => {
    onChange(empleados.filter((_, i) => i !== index));
  };

  const updateEmpleado = (index, field, value) => {
    const updated = [...empleados];
    updated[index][field] = value;
    onChange(updated);
  };

  const empleadosRestantes = empleadosDisponibles.filter(
    e => !empleados.some(emp => emp.id_empleado === e.id_empleado)
  );

  return (
    <div className="space-y-3">
      {empleados.map((emp, index) => (
        <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
          <select
            className="flex-1 px-2 py-1 rounded border"
            value={emp.id_empleado}
            onChange={(e) => updateEmpleado(index, 'id_empleado', parseInt(e.target.value))}
          >
            {empleadosDisponibles.filter(e =>
              e.id_empleado === emp.id_empleado ||
              !empleados.some(emp2 => emp2.id_empleado === e.id_empleado && emp2 !== emp)
            ).map(e => (
              <option key={e.id_empleado} value={e.id_empleado}>
                {e.nombre} {e.apellido} ({e.tipo})
              </option>
            ))}
          </select>
          <select
            className="w-36 px-2 py-1 rounded border"
            value={emp.rol}
            onChange={(e) => updateEmpleado(index, 'rol', e.target.value)}
          >
            <option value="profesor">Profesor</option>
            <option value="guardavidas">Guardavidas</option>
            <option value="asistente">Asistente</option>
            <option value="recepcionista">Recepcionista</option>
            <option value="otro">Otro</option>
          </select>
          <button
            onClick={() => removeEmpleado(index)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      {empleadosRestantes.length > 0 && (
        <button
          type="button"
          onClick={addEmpleado}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary-main text-primary-main rounded-lg hover:bg-primary-main/5"
        >
          <Plus className="w-4 h-4" /> Agregar Empleado
        </button>
      )}
    </div>
  );
}

export default EmpleadosManager;
