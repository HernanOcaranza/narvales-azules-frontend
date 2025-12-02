/**
 * Hook personalizado para gestionar membresías
 */

import React from 'react';
import * as membresiasService from '../services/membresiasService';

export function useMembresias() {
  const [membresias, setMembresias] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  /**
   * Obtiene todas las membresías con filtros opcionales
   * @param {object} filters - Filtros (idAlumno, estado, idTipoMembrecia, idGrupo, fechaDesde, fechaHasta)
   */
  const fetchMembresias = React.useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await membresiasService.getAll(filters);
      setMembresias(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener membresías:', err);
      setError(err.message || 'Error al cargar las membresías');
      setMembresias([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene las membresías de un alumno específico
   * @param {string|number} idAlumno - ID del alumno
   */
  const fetchMembresiasByAlumno = React.useCallback(async (idAlumno) => {
    setLoading(true);
    setError(null);
    try {
      const data = await membresiasService.getByAlumno(idAlumno);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error al obtener membresías del alumno:', err);
      setError(err.message || 'Error al cargar las membresías del alumno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene una membresía por ID
   * @param {string|number} id - ID de la membresía
   */
  const fetchMembreciaById = React.useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await membresiasService.getById(id);
      return data;
    } catch (err) {
      console.error('Error al obtener membresía:', err);
      setError(err.message || 'Error al cargar la membresía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea una nueva membresía (y automáticamente crea un pago asociado)
   * @param {object} data - Datos de la membresía
   */
  const createMembrecia = React.useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaMembrecia = await membresiasService.create(data);
      return nuevaMembrecia;
    } catch (err) {
      console.error('Error al crear membresía:', err);
      setError(err.message || 'Error al crear la membresía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza una membresía existente
   * @param {string|number} id - ID de la membresía
   * @param {object} data - Datos actualizados
   */
  const updateMembrecia = React.useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const membresiaActualizada = await membresiasService.update(id, data);
      return membresiaActualizada;
    } catch (err) {
      console.error('Error al actualizar membresía:', err);
      setError(err.message || 'Error al actualizar la membresía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina una membresía
   * @param {string|number} id - ID de la membresía
   */
  const deleteMembrecia = React.useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await membresiasService.deleteById(id);
    } catch (err) {
      console.error('Error al eliminar membresía:', err);
      setError(err.message || 'Error al eliminar la membresía');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    membresias,
    loading,
    error,
    fetchMembresias,
    fetchMembresiasByAlumno,
    fetchMembreciaById,
    createMembrecia,
    updateMembrecia,
    deleteMembrecia,
  };
}

