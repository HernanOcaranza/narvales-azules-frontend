/**
 * Servicio para gestionar alumnos
 * Realiza llamadas a los endpoints de alumnos de la API
 */

import api from './api';

const ENDPOINT = '/alumnos';

/**
 * Obtiene todos los alumnos
 * @returns {Promise} - Lista de alumnos
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene alumnos por tutor
 * @param {string|number} idTutor - ID del tutor
 * @returns {Promise} - Lista de alumnos del tutor
 */
export const getByTutor = async (idTutor) => {
  const response = await api.get(`${ENDPOINT}/tutor/${idTutor}`);
  return response?.data || response;
};

/**
 * Busca alumnos por nombre
 * @param {string} nombre - Nombre del alumno a buscar
 * @returns {Promise} - Lista de alumnos encontrados
 */
export const searchByNombre = async (nombre) => {
  const response = await api.get(`${ENDPOINT}/search?nombre=${encodeURIComponent(nombre)}`);
  return response?.data || response;
};

/**
 * Obtiene un alumno por su ID
 * @param {string|number} id - ID del alumno
 * @returns {Promise} - Datos del alumno
 */
export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

/**
 * Crea un nuevo alumno
 * @param {object} data - Datos del alumno a crear (nombre, apellido, dni, fecha_nacimiento, direccion, fecha_registro, estado, id_tutor, id_categoria, id_condicion)
 * @returns {Promise} - Alumno creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un alumno existente
 * @param {string|number} id - ID del alumno a actualizar
 * @param {object} data - Datos actualizados del alumno
 * @returns {Promise} - Alumno actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un alumno
 * @param {string|number} id - ID del alumno a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const alumnoService = {
  getAll,
  getByTutor,
  searchByNombre,
  getById,
  create,
  update,
  deleteById,
};

export default alumnoService;

