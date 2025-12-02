/**
 * Servicio para gestionar tipos de membresía
 * Realiza llamadas a los endpoints de tipo-membresias de la API
 */

import api from './api';

const ENDPOINT = '/tipo-membresias';

/**
 * Obtiene todos los tipos de membresía
 * @returns {Promise} - Lista de tipos de membresía
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  return response?.data || response;
};

/**
 * Obtiene un tipo de membresía por su ID
 * @param {string|number} id - ID del tipo
 * @returns {Promise} - Datos del tipo
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response?.data || response;
};

/**
 * Crea un nuevo tipo de membresía
 * @param {object} data - Datos del tipo a crear
 * @returns {Promise} - Tipo creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un tipo de membresía existente
 * @param {string|number} id - ID del tipo a actualizar
 * @param {object} data - Datos actualizados del tipo
 * @returns {Promise} - Tipo actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un tipo de membresía
 * @param {string|number} id - ID del tipo a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const tipoMembresiasService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default tipoMembresiasService;

