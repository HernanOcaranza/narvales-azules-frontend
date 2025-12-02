/**
 * Hook personalizado para gestionar detalles de pago
 */

import React from 'react';
import * as detallePagosService from '../services/detallePagosService';

export function useDetallePagos(pagoId) {
  const [detalles, setDetalles] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Carga los detalles de un pago
   */
  const fetchDetalles = React.useCallback(async () => {
    if (!pagoId) {
      setDetalles([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await detallePagosService.getByPago(pagoId);
      setDetalles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener detalles de pago:', err);
      setError(err.message || 'Error al cargar los detalles');
      setDetalles([]);
    } finally {
      setLoading(false);
    }
  }, [pagoId]);

  // Cargar detalles cuando cambia el pagoId
  React.useEffect(() => {
    fetchDetalles();
  }, [fetchDetalles]);

  /**
   * Calcula el monto total de los detalles
   */
  const totalMonto = React.useMemo(() => {
    return detalles.reduce((sum, detalle) => {
      return sum + (Number(detalle.monto_parcial) || 0);
    }, 0);
  }, [detalles]);

  /**
   * Crea un nuevo detalle de pago
   * @param {object} data - Datos del detalle
   */
  const createDetalle = React.useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoDetalle = await detallePagosService.create(data);
      await fetchDetalles(); // Recargar detalles
      return nuevoDetalle;
    } catch (err) {
      console.error('Error al crear detalle:', err);
      setError(err.message || 'Error al crear el detalle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDetalles]);

  /**
   * Actualiza un detalle existente
   * @param {string|number} id - ID del detalle
   * @param {object} data - Datos actualizados
   */
  const updateDetalle = React.useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const detalleActualizado = await detallePagosService.update(id, data);
      await fetchDetalles(); // Recargar detalles
      return detalleActualizado;
    } catch (err) {
      console.error('Error al actualizar detalle:', err);
      setError(err.message || 'Error al actualizar el detalle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDetalles]);

  /**
   * Elimina un detalle
   * @param {string|number} id - ID del detalle
   */
  const deleteDetalle = React.useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await detallePagosService.deleteById(id);
      await fetchDetalles(); // Recargar detalles
    } catch (err) {
      console.error('Error al eliminar detalle:', err);
      setError(err.message || 'Error al eliminar el detalle');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDetalles]);

  return {
    detalles,
    loading,
    error,
    totalMonto,
    fetchDetalles,
    createDetalle,
    updateDetalle,
    deleteDetalle,
  };
}

