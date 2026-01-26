/**
 * Hook personalizado para gestionar tipos de membresía
 */

import React from 'react';
import * as tipoMembresiasService from '../services/tipoMembresiasService';
import * as precioMembresiasService from '../services/precioMembresiasService';

export function useTipoMembresias() {
  const [tipos, setTipos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Obtiene todos los tipos de membresía
   */
  const fetchTipos = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tipoMembresiasService.getAll();
      setTipos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener tipos de membresía:', err);
      setError(err.message || 'Error al cargar los tipos de membresía');
      setTipos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene el precio vigente de un tipo de membresía
   * @param {string|number} idTipoMembrecia - ID del tipo de membresía
   */
  const getPrecioVigente = React.useCallback(async (idTipoMembrecia) => {
    if (!idTipoMembrecia) return null;
    
    setLoading(true);
    setError(null);
    try {
      const precio = await precioMembresiasService.getPrecioVigente(idTipoMembrecia);
      return precio;
    } catch (err) {
      console.error('Error al obtener precio vigente:', err);
      setError(err.message || 'Error al obtener el precio vigente');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tipos,
    loading,
    error,
    fetchTipos,
    getPrecioVigente,
  };
}

