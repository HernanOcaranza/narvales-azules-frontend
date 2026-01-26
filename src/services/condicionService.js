/**
 * Servicio para gestionar condiciones
 * Realiza llamadas a los endpoints de condiciones de la API
 */

import api from './api';

const ENDPOINT = '/condiciones';

/**
 * Obtiene todas las condiciones
 * @returns {Promise} - Lista de condiciones
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene una condición por su ID
 * @param {string|number} id - ID de la condición
 * @returns {Promise} - Datos de la condición
 */
export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

/**
 * Crea una nueva condición
 * @param {object} data - Datos de la condición a crear (condicion, atencion, descripcion)
 * @returns {Promise} - Condición creada
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza una condición existente
 * @param {string|number} id - ID de la condición a actualizar
 * @param {object} data - Datos actualizados de la condición
 * @returns {Promise} - Condición actualizada
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina una condición
 * @param {string|number} id - ID de la condición a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const condicionService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default condicionService;

