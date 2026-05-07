/**
 * Servicio para gestionar pagos
 * Realiza llamadas a los endpoints de pagos de la API
 */

import api from './api';

const ENDPOINT = '/pagos';

/**
 * Obtiene todos los pagos con paginación y filtros
 * @param {object} options - Opciones de paginación y filtros
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.limit - Registros por página (default: 10)
 * @param {object} options.filters - Filtros opcionales (tipo, fechaDesde, fechaHasta, estado, observaciones)
 * @returns {Promise} - Lista de pagos con información de paginación
 */
export const getAll = async (options = {}) => {
  const { page = 1, limit = 10, ...filters } = options;
  const params = new URLSearchParams();
  
  params.append('page', page);
  params.append('limit', limit);
  
  if (filters.tipo) {
    params.append('tipo', filters.tipo);
  }
  if (filters.estado) {
    params.append('estado', filters.estado);
  }
  if (filters.fechaDesde) {
    params.append('fechaDesde', filters.fechaDesde);
  }
  if (filters.fechaHasta) {
    params.append('fechaHasta', filters.fechaHasta);
  }
  if (filters.observaciones) {
    params.append('observaciones', filters.observaciones);
  }
  
  const response = await api.get(`${ENDPOINT}?${params.toString()}`);
  return response?.data || response;
};

/**
 * Obtiene un pago por su ID (incluye detalles)
 * @param {string|number} id - ID del pago
 * @returns {Promise} - Datos del pago con detalles incluidos
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response?.data || response;
};

/**
 * Crea un nuevo pago
 * @param {object} data - Datos del pago a crear
 * @returns {Promise} - Pago creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un pago existente
 * @param {string|number} id - ID del pago a actualizar
 * @param {object} data - Datos actualizados del pago
 * @returns {Promise} - Pago actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un pago
 * @param {string|number} id - ID del pago a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const pagosService = {
  getAll,
  getById,
  create,
  update,
  deleteById,
};

export default pagosService;

