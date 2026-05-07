/**
 * Servicio para gestionar membresías
 * Realiza llamadas a los endpoints de membresías de la API
 */

import api from './api';

const ENDPOINT = '/membresias';

/**
 * Obtiene todas las membresías con paginación y filtros
 * @param {object} options - Opciones de paginación y filtros
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.limit - Registros por página (default: 10)
 * @param {object} options.filters - Filtros opcionales (idAlumno, estado, idTipoMembrecia, idGrupo, fechaDesde, fechaHasta)
 * @returns {Promise} - Lista de membresías con información de paginación
 */
export const getAll = async (options = {}) => {
  const { page = 1, limit = 10, ...filters } = options;
  const params = new URLSearchParams();
  
  params.append('page', page);
  params.append('limit', limit);
  
  if (filters.idAlumno) {
    params.append('idAlumno', filters.idAlumno);
  }
  if (filters.estado) {
    params.append('estado', filters.estado);
  }
  if (filters.idTipoMembrecia) {
    params.append('idTipoMembrecia', filters.idTipoMembrecia);
  }
  if (filters.idGrupo) {
    params.append('idGrupo', filters.idGrupo);
  }
  if (filters.fechaDesde) {
    params.append('fechaDesde', filters.fechaDesde);
  }
  if (filters.fechaHasta) {
    params.append('fechaHasta', filters.fechaHasta);
  }
  
  const response = await api.get(`${ENDPOINT}?${params.toString()}`);
  return response?.data || response;
};

/**
 * Obtiene las membresías de un alumno específico
 * @param {string|number} idAlumno - ID del alumno
 * @returns {Promise} - Lista de membresías del alumno
 */
export const getByAlumno = async (idAlumno) => {
  const response = await api.get(`${ENDPOINT}/alumno/${idAlumno}`);
  return response?.data || response;
};

/**
 * Obtiene una membresía por su ID
 * @param {string|number} id - ID de la membresía
 * @returns {Promise} - Datos de la membresía
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response?.data || response;
};

/**
 * Obtiene una membresía completa con toda su información relacionada (alumno, grupo, tipo de membresía, pago y detalles de pago)
 * @param {string|number} id - ID de la membresía
 * @returns {Promise} - Datos completos de la membresía
 */
export const getCompletoById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}/completo`);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Crea una nueva membresía (y automáticamente crea un pago asociado)
 * @param {object} data - Datos de la membresía a crear
 * @returns {Promise} - Membresía creada
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza una membresía existente
 * @param {string|number} id - ID de la membresía a actualizar
 * @param {object} data - Datos actualizados de la membresía
 * @returns {Promise} - Membresía actualizada
 */
export const update = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Elimina una membresía
 * @param {string|number} id - ID de la membresía a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const membresiasService = {
  getAll,
  getByAlumno,
  getById,
  getCompletoById,
  create,
  update,
  deleteById,
};

export default membresiasService;

