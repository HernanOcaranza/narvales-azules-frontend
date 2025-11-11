/**
 * Servicio base para realizar peticiones HTTP con fetch vanilla
 * Centraliza la configuración de las llamadas a la API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Realiza una petición HTTP
 * @param {string} endpoint - Endpoint de la API (ej: '/alumnos')
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise} - Respuesta de la API
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Obtener token del localStorage si existe
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Si la respuesta no es exitosa, lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la petición' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    // Intentar parsear JSON, si falla retornar texto
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error en petición API:', error);
    throw error;
  }
}

/**
 * Métodos HTTP helpers
 */
export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (endpoint, data, options = {}) => 
    request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: (endpoint, data, options = {}) => 
    request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint, options = {}) => 
    request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

