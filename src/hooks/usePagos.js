/**
 * Hook personalizado para gestionar pagos
 */

import React from 'react';
import * as pagosService from '../services/pagosService';

export function usePagos() {
  const [pagos, setPagos] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Obtiene todos los pagos con filtros opcionales
   * @param {object} filters - Filtros (tipo, fechaDesde, fechaHasta, estado, observaciones)
   */
  const fetchPagos = React.useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pagosService.getAll(filters);
      setPagos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener pagos:', err);
      setError(err.message || 'Error al cargar los pagos');
      setPagos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene un pago por ID (incluye detalles)
   * @param {string|number} id - ID del pago
   */
  const fetchPagoById = React.useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pagosService.getById(id);
      return data;
    } catch (err) {
      console.error('Error al obtener pago:', err);
      setError(err.message || 'Error al cargar el pago');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo pago
   * @param {object} data - Datos del pago
   */
  const createPago = React.useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoPago = await pagosService.create(data);
      return nuevoPago;
    } catch (err) {
      console.error('Error al crear pago:', err);
      setError(err.message || 'Error al crear el pago');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza un pago existente
   * @param {string|number} id - ID del pago
   * @param {object} data - Datos actualizados
   */
  const updatePago = React.useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const pagoActualizado = await pagosService.update(id, data);
      return pagoActualizado;
    } catch (err) {
      console.error('Error al actualizar pago:', err);
      setError(err.message || 'Error al actualizar el pago');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina un pago
   * @param {string|number} id - ID del pago
   */
  const deletePago = React.useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await pagosService.deleteById(id);
    } catch (err) {
      console.error('Error al eliminar pago:', err);
      setError(err.message || 'Error al eliminar el pago');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    pagos,
    loading,
    error,
    fetchPagos,
    fetchPagoById,
    createPago,
    updatePago,
    deletePago,
  };
}

