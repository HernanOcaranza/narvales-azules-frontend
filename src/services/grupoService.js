/**
 * Servicio para gestionar grupos
 * Realiza llamadas a los endpoints de grupos de la API
 */

import api from './api';

const ENDPOINT = '/grupos';

/**
 * Obtiene todos los grupos con paginación opcional y filtros
 * @param {object} options - Opciones de paginación y filtros
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.limit - Registros por página (default: 10)
 * @param {object} options.filters - Filtros a aplicar
 * @returns {Promise} - Lista de grupos con información de paginación
 */
export const getAll = async (options = {}) => {
  const { page = 1, limit = 10, filters = {} } = options;
  
  const params = { page, limit };
  
  if (filters.idDisciplina) params.idDisciplina = filters.idDisciplina;
  if (filters.idCategoria) params.idCategoria = filters.idCategoria;
  if (filters.estado !== undefined && filters.estado !== '') params.estado = filters.estado;
  if (filters.nombre) params.nombre = filters.nombre;
  
  const response = await api.get(ENDPOINT, { params });
  const result = response?.data || response;
  return result;
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

