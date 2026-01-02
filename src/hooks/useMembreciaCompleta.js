/**
 * Hook personalizado para obtener información completa de una membresía
 * Incluye: alumno (con tutor, categoría, condición), tipo de membresía,
 * grupo (con disciplina y categoría), pago y todos los detalles de pago
 */

import React from 'react';
import * as membresiasService from '../services/membresiasService';

/**
 * Hook para obtener una membresía completa por ID
 * @param {string|number} id - ID de la membresía
 * @returns {object} - { membresia, loading, error, refetch }
 */
export const useMembreciaCompleta = (id) => {
  const [membresia, setMembresia] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchMembresia = React.useCallback(async () => {
    if (!id) {
      setLoading(false);
      setMembresia(null);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await membresiasService.getCompletoById(id);
      
      // El servicio ya extrae response.data si existe, pero verificamos el formato
      if (response && typeof response === 'object') {
        // Si la respuesta tiene success y data, usar data
        if (response.success !== undefined && response.data) {
          setMembresia(response.data);
        } else {
          // Si ya viene el data directamente (el servicio lo extrajo)
          setMembresia(response);
        }
      } else {
        setMembresia(null);
      }
    } catch (err) {
      console.error('Error al cargar membresía completa:', err);
      setError(err.message || 'Error al cargar la información completa de la membresía');
      setMembresia(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchMembresia();
  }, [fetchMembresia]);

  return { 
    membresia, 
    loading, 
    error,
    refetch: fetchMembresia
  };
};

