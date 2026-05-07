/**
 * Servicio para obtener estadísticas del dashboard
 * Realiza llamadas al endpoint de dashboard de la API
 */

import api from './api';

const ENDPOINT = '/dashboard';

/**
 * Obtiene las estadísticas del dashboard
 * @returns {Promise} - Datos del dashboard (resumen, disciplinas, categorias, membresias, etc.)
 */
export const getStats = async () => {
  const response = await api.get(ENDPOINT);
  return response?.data || response;
};

const dashboardService = {
  getStats,
};

export default dashboardService;