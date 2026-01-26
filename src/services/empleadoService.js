/**
 * Servicio para gestionar empleados
 * Realiza llamadas a los endpoints de empleados de la API
 */

import api from './api';

const ENDPOINT = '/empleados';

/**
 * Obtiene todos los empleados
 * @returns {Promise} - Lista de empleados
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene un empleado por su ID
 * @param {string|number} id - ID del empleado
 * @returns {Promise} - Datos del empleado
 */
export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

/**
 * Crea un nuevo empleado
 * @param {object} data - Datos del empleado a crear
 * @returns {Promise} - Empleado creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un empleado existente
 * @param {string|number} id - ID del empleado a actualizar
 * @param {object} data - Datos actualizados del empleado
 * @returns {Promise} - Empleado actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un empleado
 * @param {string|number} id - ID del empleado a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const empleadoService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default empleadoService;

