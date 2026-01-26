/**
 * Servicio para gestionar clase-empleado (relación entre clases y empleados)
 * Realiza llamadas a los endpoints de clase-empleado de la API
 */

import api from './api';

const ENDPOINT = '/clase-empleados';

/**
 * Obtiene todas las relaciones clase-empleado
 * @returns {Promise} - Lista de relaciones clase-empleado
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene relaciones clase-empleado por clase
 * @param {string|number} idClase - ID de la clase
 * @returns {Promise} - Lista de relaciones de la clase
 */
export const getByClase = async (idClase) => {
  const response = await api.get(`${ENDPOINT}/clase/${idClase}`);
  return response?.data || response;
};

/**
 * Obtiene relaciones clase-empleado por empleado
 * @param {string|number} idEmpleado - ID del empleado
 * @returns {Promise} - Lista de relaciones del empleado
 */
export const getByEmpleado = async (idEmpleado) => {
  const response = await api.get(`${ENDPOINT}/empleado/${idEmpleado}`);
  return response?.data || response;
};

/**
 * Obtiene una relación clase-empleado por su ID compuesto
 * @param {string|number} idClase - ID de la clase
 * @param {string|number} idEmpleado - ID del empleado
 * @returns {Promise} - Datos de la relación clase-empleado
 */
export const getById = async (idClase, idEmpleado) => {
  return await api.get(`${ENDPOINT}/${idClase}/${idEmpleado}`);
};

/**
 * Crea una nueva relación clase-empleado
 * @param {object} data - Datos de la relación a crear (id_clase, id_empleado, presente, rol)
 * @returns {Promise} - Relación clase-empleado creada
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza una relación clase-empleado existente
 * @param {string|number} idClase - ID de la clase
 * @param {string|number} idEmpleado - ID del empleado
 * @param {object} data - Datos actualizados de la relación
 * @returns {Promise} - Relación clase-empleado actualizada
 */
export const update = async (idClase, idEmpleado, data) => {
  return await api.put(`${ENDPOINT}/${idClase}/${idEmpleado}`, data);
};

/**
 * Elimina una relación clase-empleado
 * @param {string|number} idClase - ID de la clase
 * @param {string|number} idEmpleado - ID del empleado
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (idClase, idEmpleado) => {
  return await api.delete(`${ENDPOINT}/${idClase}/${idEmpleado}`);
};

// Exportar todas las funciones como objeto también
const claseEmpleadoService = {
  getAll,
  getByClase,
  getByEmpleado,
  getById,
  create,
  update,
  deleteById,
};

export default claseEmpleadoService;

