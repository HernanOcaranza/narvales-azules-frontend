import React from 'react';
import { useTipoMembresias } from '../../hooks/useTipoMembresias';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Select, Spinner } from '../ui';

export default function TipoMembreciaSelector({ value, onChange, error, required = true }) {
  const { tipos, loading, fetchTipos, getPrecioVigente } = useTipoMembresias();
  const [precioVigente, setPrecioVigente] = React.useState(null);
  const [loadingPrecio, setLoadingPrecio] = React.useState(false);

  React.useEffect(() => { fetchTipos(); }, [fetchTipos]);

  React.useEffect(() => {
    if (value) {
      setLoadingPrecio(true);
      getPrecioVigente(value).then(setPrecioVigente).catch(() => setPrecioVigente(null)).finally(() => setLoadingPrecio(false));
    } else {
      setPrecioVigente(null);
    }
  }, [value]);

  return (
    <div>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:border-primary-main focus:ring-2 focus:ring-primary-light/30 outline-none`}
        required={required}
      >
        <option value="">Seleccione un tipo</option>
        {loading ? <option disabled>Cargando...</option> : tipos.map((tipo) => (
          <option key={tipo.id_tipo_membrecia} value={tipo.id_tipo_membrecia}>{tipo.tipo_membrecia || `Tipo ${tipo.id_tipo_membrecia}`}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      
      {value && (
        <div className="mt-2">
          {loadingPrecio ? (
            <div className="flex items-center gap-2 text-text-secondary text-sm"><Spinner size="sm" /> Cargando precio...</div>
          ) : precioVigente ? (
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <strong>Precio vigente:</strong> {formatCurrency(precioVigente.precio || precioVigente.monto || 0)}
              {(precioVigente.fecha_inicio_vigencia || precioVigente.fecha_inicio) && <span> (Vigente desde {formatDate(precioVigente.fecha_inicio_vigencia || precioVigente.fecha_inicio)})</span>}
            </div>
          ) : (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">No hay precio vigente para este tipo de membresía</div>
          )}
        </div>
      )}
    </div>
  );
}