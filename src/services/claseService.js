/**
 * Servicio para gestionar clases
 * Realiza llamadas a los endpoints de clases de la API
 */

import api from './api';

const ENDPOINT = '/clases';

/**
 * Obtiene todas las clases
 * @returns {Promise} - Lista de clases
 */
export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Obtiene clases por grupo
 * @param {string|number} idGrupo - ID del grupo
 * @returns {Promise} - Lista de clases del grupo
 */
export const getByGrupo = async (idGrupo) => {
  const response = await api.get(`${ENDPOINT}/grupo/${idGrupo}`);
  return response?.data || response;
};

/**
 * Obtiene clases por fecha
 * @param {string} fecha - Fecha en formato DATEONLY (YYYY-MM-DD)
 * @returns {Promise} - Lista de clases de la fecha
 */
export const getByFecha = async (fecha) => {
  const response = await api.get(`${ENDPOINT}/fecha?fecha=${encodeURIComponent(fecha)}`);
  return response?.data || response;
};

/**
 * Obtiene clases por rango de fechas
 * @param {string} fechaInicio - Fecha de inicio en formato DATEONLY (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin en formato DATEONLY (YYYY-MM-DD)
 * @returns {Promise} - Lista de clases en el rango de fechas
 */
export const getByFechaRange = async (fechaInicio, fechaFin) => {
  const response = await api.get(
    `${ENDPOINT}/fecha-range?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`
  );
  return response?.data || response;
};

/**
 * Obtiene una clase por su ID
 * @param {string|number} id - ID de la clase
 * @returns {Promise} - Datos de la clase
 */
export const getById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  return response?.data || response;
};

/**
 * Crea una nueva clase
 * @param {object} data - Datos de la clase a crear (fecha_clase, hora_inicio, hora_fin, id_grupo)
 * @returns {Promise} - Clase creada
 */
export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

/**
 * Actualiza una clase existente
 * @param {string|number} id - ID de la clase a actualizar
 * @param {object} data - Datos actualizados de la clase
 * @returns {Promise} - Clase actualizada
 */
export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

/**
 * Elimina una clase
 * @param {string|number} id - ID de la clase a eliminar
 * @returns {Promise} - Respuesta de la eliminación
 */
export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

/**
 * Genera todas las clases del mes según los grupos existentes
 * @returns {Promise} - Respuesta con las clases generadas
 */
export const generarTodas = async () => {
  const response = await api.post(`${ENDPOINT}/generar-todas`);
  return response?.data || response;
};

// Exportar todas las funciones como objeto también
const claseService = {
  getAll,
  getByGrupo,
  getByFecha,
  getByFechaRange,
  getById,
  create,
  update,
  deleteById,
  generarTodas,
};

export default claseService;

