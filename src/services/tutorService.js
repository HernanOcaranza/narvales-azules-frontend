/**
 * Servicio para gestionar tutores
 * Realiza llamadas a los endpoints de tutores de la API
 */

import api from './api';

const ENDPOINT = '/tutores';

/**
 * Obtiene todos los tutores
 * @returns {Promise} - Lista de tutores
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Busca tutores por nombre
 * @param {string} nombre - Nombre del tutor a buscar
 * @returns {Promise} - Lista de tutores encontrados
 */
export const searchByNombre = async (nombre) => {
  const response = await api.get(`${ENDPOINT}/search?nombre=${encodeURIComponent(nombre)}`);
  return response?.data || response;
};

/**
 * Obtiene un tutor por su ID
 * @param {string|number} id - ID del tutor
 * @returns {Promise} - Datos del tutor
 */
export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

/**
 * Crea un nuevo tutor
 * @param {object} data - Datos del tutor a crear (nombre, apellido, telefono, dni, fecha_registro)
 * @returns {Promise} - Tutor creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un tutor existente
 * @param {string|number} id - ID del tutor a actualizar
 * @param {object} data - Datos actualizados del tutor
 * @returns {Promise} - Tutor actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un tutor
 * @param {string|number} id - ID del tutor a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const tutorService = {
  getAll,
  searchByNombre,
  getById,
  create,
  update,
  deleteById,
};

export default tutorService;

