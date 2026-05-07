/**
 * Servicio para gestionar clases
 * Realiza llamadas a los endpoints de clases de la API
 */

import api from './api';

const ENDPOINT = '/clases';

/**
 * Obtiene todas las clases con paginación opcional y filtros
 * @param {object} options - Opciones de paginación y filtros
 * @param {number} options.page - Número de página (default: 1)
 * @param {number} options.limit - Registros por página (default: 10)
 * @param {object} options.filters - Filtros a aplicar
 * @returns {Promise} - Lista de clases con información de paginación
 */
export const getAll = async (options = {}) => {
  const { page = 1, limit = 10, filters = {} } = options;
  
  const params = { page, limit };
  
  if (filters.idGrupo) params.idGrupo = filters.idGrupo;
  if (filters.idDisciplina) params.idDisciplina = filters.idDisciplina;
  if (filters.idCategoria) params.idCategoria = filters.idCategoria;
  if (filters.estado) params.estado = filters.estado;
  if (filters.fechaDesde) params.fechaDesde = filters.fechaDesde;
  if (filters.fechaHasta) params.fechaHasta = filters.fechaHasta;
  
  const response = await api.get(ENDPOINT, { params });
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

