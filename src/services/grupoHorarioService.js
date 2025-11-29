/**
 * Servicio para gestionar horarios de grupos
 * Realiza llamadas a los endpoints de grupo-horarios de la API
 */

import api from './api';

const ENDPOINT = '/grupo-horarios';

/**
 * Obtiene todos los horarios
 * @returns {Promise} - Lista de horarios
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  return response?.data || response;
};

/**
 * Obtiene un horario por su ID
 * @param {string|number} id - ID del horario
 * @returns {Promise} - Datos del horario
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response?.data || response;
};

/**
 * Obtiene horarios de un grupo específico
 * @param {string|number} id_grupo - ID del grupo
 * @returns {Promise} - Lista de horarios del grupo
 */
export const getByGrupo = async (id_grupo) => {
  const response = await api.get(`${ENDPOINT}/grupo/${id_grupo}`);
  return response?.data || response;
};

/**
 * Crea un nuevo horario
 * @param {object} data - Datos del horario a crear
 * @returns {Promise} - Horario creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Crea múltiples horarios
 * @param {Array} horarios - Array de horarios a crear
 * @returns {Promise} - Horarios creados
 */
export const createMultiple = async (horarios) => {
  return await api.post(`${ENDPOINT}/multiple`, { horarios });
};

/**
 * Actualiza un horario existente
 * @param {string|number} id - ID del horario a actualizar
 * @param {object} data - Datos actualizados del horario
 * @returns {Promise} - Horario actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un horario
 * @param {string|number} id - ID del horario a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const grupoHorarioService = {
  getAll,
  getById,
  getByGrupo,
  create,
  createMultiple,
  update,
  deleteById,
};

export default grupoHorarioService;

