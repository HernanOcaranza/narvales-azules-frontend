/**
 * Servicio para gestionar precios de membresía
 * Realiza llamadas a los endpoints de precio-membresias de la API
 */

import api from './api';

const ENDPOINT = '/precio-membresias';

/**
 * Obtiene todos los precios de membresía
 * @param {object} filters - Filtros opcionales (idTipoMembrecia)
 * @returns {Promise} - Lista de precios
 */
export const getAll = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.idTipoMembrecia) {
    params.append('idTipoMembrecia', filters.idTipoMembrecia);
  }
  
  const queryString = params.toString();
  const url = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;
  
  const response = await api.get(url);
  return response?.data || response;
};

/**
 * Obtiene el precio vigente de un tipo de membresía
 * @param {string|number} idTipoMembrecia - ID del tipo de membresía
 * @returns {Promise} - Precio vigente
 */
export const getPrecioVigente = async (idTipoMembrecia) => {
  const response = await api.get(`${ENDPOINT}/vigente/${idTipoMembrecia}`);
  return response?.data || response;
};

/**
 * Obtiene un precio por su ID
 * @param {string|number} id - ID del precio
 * @returns {Promise} - Datos del precio
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response?.data || response;
};

/**
 * Crea un nuevo precio de membresía
 * @param {object} data - Datos del precio a crear
 * @returns {Promise} - Precio creado
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza un precio existente
 * @param {string|number} id - ID del precio a actualizar
 * @param {object} data - Datos actualizados del precio
 * @returns {Promise} - Precio actualizado
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina un precio
 * @param {string|number} id - ID del precio a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

// Exportar todas las funciones como objeto también
const precioMembresiasService = {
  getAll,
  getPrecioVigente,
  getById,
  create,
  update,
  deleteById,
};

export default precioMembresiasService;

