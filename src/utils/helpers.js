/**
 * Funciones de utilidad generales
 */

/**
 * Formatea una fecha a formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} format - Formato deseado (default: 'DD/MM/YYYY')
 * @returns {string} - Fecha formateada
 */
export function formatDate(date, format = 'DD/MM/YYYY') {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year);
}

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad a formatear
 * @param {string} currency - Moneda (default: 'ARS')
 * @returns {string} - Cantidad formateada
 */
export function formatCurrency(amount, currency = 'ARS') {
  if (amount === null || amount === undefined) return '-';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} - true si es válido
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

