/**
 * Servicio para gestionar autenticación
 * Realiza llamadas a los endpoints de autenticación de la API
 */

import api from './api';

const ENDPOINT = '/auth';

/**
 * Realiza el login del usuario
 * @param {string} usuario - Nombre de usuario
 * @param {string} contrasenia - Contraseña del usuario
 * @returns {Promise} - Datos del usuario y token
 */
export const login = async (usuario, contrasenia) => {
  const response = await api.post(`${ENDPOINT}/login`, {
    usuario,
    contrasenia,
  });
  
  // Si la respuesta tiene un campo 'data', extraerlo, sino devolver la respuesta completa
  const data = response?.data || response;
  
  // Guardar el token en localStorage si existe
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  
  // Guardar información del usuario si existe
  if (data.usuario) {
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
  }
  
  return data;
};

/**
 * Cierra la sesión del usuario
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si hay un token guardado
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Obtiene el token del usuario autenticado
 * @returns {string|null} - Token del usuario o null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Obtiene la información del usuario autenticado
 * @returns {object|null} - Información del usuario o null
 */
export const getUser = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

// Exportar todas las funciones como objeto también
const authService = {
  login,
  logout,
  isAuthenticated,
  getToken,
  getUser,
};

export default authService;

