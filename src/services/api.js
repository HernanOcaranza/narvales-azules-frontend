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
 * Limpia un objeto para asegurar que solo contenga datos serializables
 * Elimina funciones, elementos del DOM, y referencias circulares
 */
const cleanForSerialization = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // Si es un valor primitivo, retornarlo tal cual
  if (typeof obj !== 'object') {
    return obj;
  }
  
  // Si es una fecha, convertirla a string
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  // Si es un array, limpiar cada elemento
  if (Array.isArray(obj)) {
    return obj.map(cleanForSerialization);
  }
  
  // Si es un objeto, limpiar cada propiedad
  const cleaned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // Saltar funciones y elementos del DOM
      if (typeof value === 'function') {
        continue;
      }
      if (value instanceof HTMLElement || value instanceof Event) {
        continue;
      }
      // Saltar propiedades que empiezan con __ (propiedades internas de React)
      if (key.startsWith('__')) {
        continue;
      }
      cleaned[key] = cleanForSerialization(value);
    }
  }
  return cleaned;
};

/**
 * Métodos HTTP helpers
 */
export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => {
    const cleanedData = cleanForSerialization(data);
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(cleanedData),
    });
  },
  
  put: (endpoint, data, options = {}) => {
    const cleanedData = cleanForSerialization(data);
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(cleanedData),
    });
  },
  
  patch: (endpoint, data, options = {}) => {
    const cleanedData = cleanForSerialization(data);
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(cleanedData),
    });
  },
  
  delete: (endpoint, options = {}) => 
    request(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

