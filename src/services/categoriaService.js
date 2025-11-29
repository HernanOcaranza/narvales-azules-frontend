/**
 * Servicio para gestionar categorías
 * Realiza llamadas a los endpoints de categorías de la API
 */

import api from './api';

const ENDPOINT = '/categorias';

/**
 * Obtiene todas las categorías
 * @returns {Promise} - Lista de categorías
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene una categoría por su ID
 * @param {string|number} id - ID de la categoría
 * @returns {Promise} - Datos de la categoría
 */
export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

/**
 * Crea una nueva categoría
 * @param {object} data - Datos de la categoría a crear
 * @returns {Promise} - Categoría creada
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza una categoría existente
 * @param {string|number} id - ID de la categoría a actualizar
 * @param {object} data - Datos actualizados de la categoría
 * @returns {Promise} - Categoría actualizada
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina una categoría
 * @param {string|number} id - ID de la categoría a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const categoriaService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default categoriaService;

