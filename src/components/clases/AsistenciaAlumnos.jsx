import React from 'react';
import { Save, Plus, Trash2, Check } from 'lucide-react';
import * as claseService from '../../services/claseService';
import * as alumnoService from '../../services/alumnoService';

function AsistenciaAlumnos({ idClase, onAsistenciaGuardada }) {
  const [alumnos, setAlumnos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerQuery, setPickerQuery] = React.useState('');
  const [pickerResults, setPickerResults] = React.useState([]);
  const [searching, setSearching] = React.useState(false);

  const loadAsistencia = React.useCallback(() => {
    if (!idClase) return;
    setLoading(true);
    claseService.getAsistenciaAlumnos(idClase)
      .then((result) => {
        const alumnosData = result?.alumnos || [];
        setAlumnos(alumnosData);
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message || 'Error al cargar asistencia' });
      })
      .finally(() => setLoading(false));
  }, [idClase]);

  React.useEffect(() => {
    loadAsistencia();
  }, [loadAsistencia]);

  const handleTogglePresente = (index) => {
    setAlumnos(prev => {
      const updated = [...prev];
      const current = updated[index].presente;
      updated[index] = { ...updated[index], presente: current === 1 ? 0 : current === 0 ? null : 1 };
      return updated;
    });
  };

  const handleToggleRecuperacion = (index) => {
    setAlumnos(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], es_recuperacion: updated[index].es_recuperacion === 1 ? 0 : 1 };
      return updated;
    });
  };

  const handleOpenPicker = () => {
    setPickerQuery('');
    setPickerResults([]);
    setPickerOpen(true);
  };

  const handleSearchChange = async (e) => {
    const q = e.target.value;
    setPickerQuery(q);
    if (q.length < 2) {
      setPickerResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await alumnoService.searchByNombre(q);
      const todos = res?.data || res || [];
      const disponibles = todos.filter(
        a => !alumnos.some(al => al.id_alumno === a.id_alumno)
      );
      setPickerResults(Array.isArray(disponibles) ? disponibles : []);
    } catch {
      setPickerResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddAlumno = (alumno) => {
    setAlumnos(prev => [...prev, {
      id_alumno: alumno.id_alumno,
      nombre: alumno.nombre,
      apellido: alumno.apellido,
      dni: alumno.dni,
      presente: 1,
      es_recuperacion: 1,
      de_plantilla: false
    }]);
    setPickerOpen(false);
  };

  const handleRemove = (index) => {
    setAlumnos(prev => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = alumnos.map(a => ({
        id_alumno: a.id_alumno,
        presente: a.presente ?? 0,
        es_recuperacion: a.es_recuperacion ?? 0
      }));
      await claseService.registrarAsistenciaAlumnos(idClase, payload);
      setMessage({ type: 'success', text: 'Asistencia guardada correctamente' });
      loadAsistencia();
      if (onAsistenciaGuardada) onAsistenciaGuardada();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al guardar asistencia' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Cargando asistencia...</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-primary">Asistencia de Alumnos</h4>
        <button
          type="button"
          onClick={handleOpenPicker}
          className="flex items-center gap-1 px-3 py-1.5 text-sm border border-primary-main text-primary-main rounded-lg hover:bg-primary-main/5"
        >
          <Plus className="w-4 h-4" /> Agregar alumno
        </button>
      </div>

      {pickerOpen && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-xs font-medium text-gray-600 mb-1">Buscar alumno</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-2 py-1.5 border rounded text-sm"
              placeholder="Escriba al menos 2 caracteres..."
              value={pickerQuery}
              onChange={handleSearchChange}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="px-3 py-1.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
          {searching && <p className="text-xs text-gray-400 mt-1">Buscando...</p>}
          {pickerResults.length > 0 && (
            <ul className="mt-2 divide-y divide-blue-100 max-h-40 overflow-y-auto">
              {pickerResults.map(a => (
                <li key={a.id_alumno}>
                  <button
                    type="button"
                    onClick={() => handleAddAlumno(a)}
                    className="w-full text-left px-2 py-1.5 text-sm hover:bg-blue-100 rounded flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-500" />
                    {a.nombre} {a.apellido} ({a.dni})
                  </button>
                </li>
              ))}
            </ul>
          )}
          {pickerQuery.length >= 2 && !searching && pickerResults.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">No se encontraron alumnos</p>
          )}
        </div>
      )}

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {alumnos.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-3">
          No hay alumnos registrados para esta clase.
        </p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-medium text-gray-600">Alumno</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">Presente</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600">Recuperación</th>
                <th className="text-center px-3 py-2 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumnos.map((al, index) => (
                <tr key={al.id_alumno || index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {al.nombre} {al.apellido}
                      </span>
                      {al.de_plantilla && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">plantilla</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary-main focus:ring-primary-main"
                        checked={al.presente === 1}
                        onChange={() => handleTogglePresente(index)}
                      />
                      <span className={`text-xs font-medium ${al.presente === 1 ? 'text-green-600' : al.presente === 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {al.presente === 1 ? 'Presente' : al.presente === 0 ? 'Ausente' : 'Sin registro'}
                      </span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <label className={`inline-flex items-center gap-2 ${al.de_plantilla ? '' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        disabled={al.de_plantilla}
                        className={`w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 ${al.de_plantilla ? 'opacity-40 cursor-not-allowed' : ''}`}
                        checked={al.es_recuperacion === 1}
                        onChange={() => handleToggleRecuperacion(index)}
                      />
                      <span className={`text-xs font-medium ${al.es_recuperacion === 1 ? 'text-amber-600' : 'text-gray-400'} ${al.de_plantilla ? 'opacity-40' : ''}`}>
                        {al.es_recuperacion === 1 ? 'Recuperación' : 'Normal'}
                      </span>
                    </label>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {!al.de_plantilla && (
                      <button
                        onClick={() => handleRemove(index)}
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

      {alumnos.length > 0 && (
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

export default AsistenciaAlumnos;
