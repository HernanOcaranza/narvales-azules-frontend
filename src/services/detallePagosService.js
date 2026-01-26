/**
 * Servicio para gestionar detalles de pago
 * Realiza llamadas a los endpoints de detalle-pagos de la API
 */

import api from './api';

const ENDPOINT = '/detalle-pagos';

/**
 * Obtiene los detalles de un pago específico
 * @param {string|number} idPago - ID del pago
 * @returns {Promise} - Lista de detalles del pago
 */
export const getByPago = async (idPago) => {
  const response = await api.get(`${ENDPOINT}/pago/${idPago}`);
  return response?.data || response;
};

/**
 * Obtiene un detalle de pago por su ID
 * @param {string|number} id - ID del detalle
 * @returns {Promise} - Datos del detalle
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response?.data || response;
};

/**
 * Crea un nuevo detalle de pago
 * @param {object} data - Datos del detalle a crear
 * @returns {Promise} - Detalle creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un detalle de pago existente
 * @param {string|number} id - ID del detalle a actualizar
 * @param {object} data - Datos actualizados del detalle
 * @returns {Promise} - Detalle actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un detalle de pago
 * @param {string|number} id - ID del detalle a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const detallePagosService = {
  getByPago,
  getById,
  create,
  update,
  deleteById,
};

export default detallePagosService;

