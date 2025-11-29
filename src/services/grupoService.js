/**
 * Servicio para gestionar grupos
 * Realiza llamadas a los endpoints de grupos de la API
 */

import api from './api';

const ENDPOINT = '/grupos';

/**
 * Obtiene todos los grupos
 * @returns {Promise} - Lista de grupos
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene un grupo por su ID
 * @param {string|number} id - ID del grupo
 * @returns {Promise} - Datos del grupo
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene grupos por disciplina
 * @param {string|number} id_disciplina - ID de la disciplina
 * @returns {Promise} - Lista de grupos de la disciplina
 */
export const getByDisciplina = async (id_disciplina) => {
  return await api.get(`${ENDPOINT}/disciplina/${id_disciplina}`);
};

/**
 * Obtiene grupos por categoría
 * @param {string|number} id_categoria - ID de la categoría
 * @returns {Promise} - Lista de grupos de la categoría
 */
export const getByCategoria = async (id_categoria) => {
  return await api.get(`${ENDPOINT}/categoria/${id_categoria}`);
};

/**
 * Crea un nuevo grupo
 * @param {object} data - Datos del grupo a crear
 * @returns {Promise} - Grupo creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un grupo existente
 * @param {string|number} id - ID del grupo a actualizar
 * @param {object} data - Datos actualizados del grupo
 * @returns {Promise} - Grupo actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un grupo
 * @param {string|number} id - ID del grupo a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const grupoService = {
  getAll,
  getById,
  getByDisciplina,
  getByCategoria,
  create,
  update,
  deleteById,
};

export default grupoService;

