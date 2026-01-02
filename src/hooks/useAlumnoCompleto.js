/**
 * Hook personalizado para obtener información completa de un alumno
 * Incluye: tutor, categoría, condición, membresías, pagos y detalles de pago
 */

import React from 'react';
import * as alumnoService from '../services/alumnoService';

/**
 * Hook para obtener un alumno completo por ID
 * @param {string|number} id - ID del alumno
 * @returns {object} - { alumno, loading, error, refetch }
 */
export const useAlumnoCompleto = (id) => {
  const [alumno, setAlumno] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchAlumno = React.useCallback(async () => {
    if (!id) {
      setLoading(false);
      setAlumno(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await alumnoService.getCompletoById(id);
      
      // El servicio ya extrae response.data si existe, pero verificamos el formato
      if (response && typeof response === 'object') {
        // Si la respuesta tiene success y data, usar data
        if (response.success !== undefined && response.data) {
          setAlumno(response.data);
        } else {
          // Si ya viene el data directamente (el servicio lo extrajo)
          setAlumno(response);
        }
      } else {
        setAlumno(null);
      }
    } catch (err) {
      console.error('Error al cargar alumno completo:', err);
      setError(err.message || 'Error al cargar la información completa del alumno');
      setAlumno(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchAlumno();
  }, [fetchAlumno]);

  return { 
    alumno, 
    loading, 
    error,
    refetch: fetchAlumno
  };
};

