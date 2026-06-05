import React from 'react';
import { Save, Plus, Trash2, Check } from 'lucide-react';
import * as claseService from '../../services/claseService';
import * as empleadoService from '../../services/empleadoService';

function AsistenciaEmpleados({ idClase, onAsistenciaGuardada }) {
  const [empleados, setEmpleados] = React.useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerEmpleado, setPickerEmpleado] = React.useState('');
  const [pickerRol, setPickerRol] = React.useState('profesor');

  React.useEffect(() => {
    if (!idClase) return;
    setLoading(true);
    Promise.all([
      claseService.getAsistenciaEmpleados(idClase),
      empleadoService.getAll()
    ]).then(([asistencia, empRes]) => {
      const empleadosData = asistencia?.empleados || [];
      const todosEmpleados = empRes?.data || empRes || [];
      setEmpleados(empleadosData);
      setEmpleadosDisponibles(Array.isArray(todosEmpleados) ? todosEmpleados : []);
    }).catch((err) => {
      setMessage({ type: 'error', text: err.message || 'Error al cargar asistencia' });
    }).finally(() => setLoading(false));
  }, [idClase]);

  const handleTogglePresente = (index) => {
    setEmpleados(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], presente: updated[index].presente === 1 ? 0 : 1 };
      return updated;
    });
  };

  const handleRolChange = (index, rol) => {
    setEmpleados(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], rol };
      return updated;
    });
  };

  const handleOpenPicker = () => {
    setPickerEmpleado('');
    setPickerRol('profesor');
    setPickerOpen(true);
  };

  const handleConfirmPicker = () => {
    if (!pickerEmpleado) return;
    const emp = empleadosDisponibles.find(e => e.id_empleado === parseInt(pickerEmpleado));
    if (!emp) return;
    setEmpleados(prev => [...prev, {
      id_empleado: emp.id_empleado,
      nombre: emp.nombre,
      apellido: emp.apellido,
      rol: pickerRol,
      presente: 1,
      de_plantilla: false
    }]);
    setPickerOpen(false);
  };

  const handleRemoveEmpleado = (index) => {
    setEmpleados(prev => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = empleados.map(e => ({
        id_empleado: e.id_empleado,
        presente: e.presente === null ? 1 : e.presente,
        rol: e.rol
      }));
      await claseService.registrarAsistenciaEmpleados(idClase, payload);
      setMessage({ type: 'success', text: 'Asistencia guardada correctamente' });
      if (onAsistenciaGuardada) onAsistenciaGuardada();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al guardar asistencia' });
    } finally {
      setSaving(false);
    }
  };

  const disponiblesParaAgregar = empleadosDisponibles.filter(
    e => !empleados.some(emp => emp.id_empleado === e.id_empleado)
  );

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Cargando asistencia...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">Asistencia de Empleados</h4>
        {disponiblesParaAgregar.length > 0 && (
          <button
            type="button"
            onClick={handleOpenPicker}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary-main text-primary-main rounded-lg hover:bg-primary-main/5"
          >
            <Plus className="w-4 h-4" /> Agregar empleado
          </button>
        )}
      </div>

      {pickerOpen && (
        <div className="flex items-end gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Empleado</label>
            <select
              className="w-full px-2 py-1.5 border rounded text-sm"
              value={pickerEmpleado}
              onChange={(e) => setPickerEmpleado(e.target.value)}
            >
              <option value="">Seleccionar...</option>
              {disponiblesParaAgregar.map(e => (
                <option key={e.id_empleado} value={e.id_empleado}>
                  {e.nombre} {e.apellido} ({e.tipo})
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-gray-600 mb-1">Rol</label>
            <select
              className="w-full px-2 py-1.5 border rounded text-sm"
              value={pickerRol}
              onChange={(e) => setPickerRol(e.target.value)}
            >
              <option value="profesor">Profesor</option>
              <option value="guardavidas">Guardavidas</option>
              <option value="asistente">Asistente</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleConfirmPicker}
            disabled={!pickerEmpleado}
            className="px-3 py-1.5 bg-primary-main text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 text-sm"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {empleados.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-3">
          No hay empleados registrados para esta clase.
        </p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-medium text-gray-600">Empleado</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">Rol</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">Presente</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empleados.map((emp, index) => (
                <tr key={emp.id_empleado || index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {emp.nombre} {emp.apellido}
                      </span>
                      {emp.de_plantilla && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">plantilla</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="px-2 py-1 border rounded text-sm"
                      value={emp.rol}
                      onChange={(e) => handleRolChange(index, e.target.value)}
                    >
                      <option value="profesor">Profesor</option>
                      <option value="guardavidas">Guardavidas</option>
                      <option value="asistente">Asistente</option>
                      <option value="recepcionista">Recepcionista</option>
                      <option value="otro">Otro</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main"
                        checked={emp.presente === 1 || emp.presente === null}
                        onChange={() => handleTogglePresente(index)}
                      />
                      <span className={`text-xs font-medium ${emp.presente === 1 ? 'text-green-600' : emp.presente === 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {emp.presente === 1 ? 'Presente' : emp.presente === 0 ? 'Ausente' : 'Sin registro'}
                      </span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {!emp.de_plantilla && (
                      <button
                        onClick={() => handleRemoveEmpleado(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {empleados.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGuardar}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Asistencia'}
          </button>
        </div>
      )}
    </div>
  );
}

export default AsistenciaEmpleados;
