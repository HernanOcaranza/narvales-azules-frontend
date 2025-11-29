/**
 * Servicio para gestionar disciplinas
 * Realiza llamadas a los endpoints de disciplinas de la API
 */

import api from './api';

const ENDPOINT = '/disciplinas';

/**
 * Obtiene todas las disciplinas
 * @returns {Promise} - Lista de disciplinas
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene una disciplina por su ID
 * @param {string|number} id - ID de la disciplina
 * @returns {Promise} - Datos de la disciplina
 */
export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

/**
 * Crea una nueva disciplina
 * @param {object} data - Datos de la disciplina a crear
 * @returns {Promise} - Disciplina creada
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza una disciplina existente
 * @param {string|number} id - ID de la disciplina a actualizar
 * @param {object} data - Datos actualizados de la disciplina
 * @returns {Promise} - Disciplina actualizada
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina una disciplina
 * @param {string|number} id - ID de la disciplina a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const disciplinaService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default disciplinaService;

