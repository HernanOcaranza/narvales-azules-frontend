/**
 * Servicio para obtener estadísticas del dashboard
 * Realiza llamadas al endpoint de dashboard de la API
 */

import api from './api';

const ENDPOINT = '/dashboard';

/**
 * Obtiene las estadísticas del dashboard
 * @param {object} options - Opciones de filtro
 * @param {string} options.fechaDesde - Fecha inicio (YYYY-MM-DD)
 * @param {string} options.fechaHasta - Fecha fin (YYYY-MM-DD)
 * @returns {Promise} - Datos del dashboard (resumen, disciplinas, categorias, membresias, etc.)
 */
export const getStats = async (options = {}) => {
  const params = {};
  if (options.fechaDesde) params.fechaDesde = options.fechaDesde;
  if (options.fechaHasta) params.fechaHasta = options.fechaHasta;
  const response = await api.get(ENDPOINT, { params });
  return response?.data || response;
};

const dashboardService = {
  getStats,
};

export default dashboardService;