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
  
  // Si viene en formato YYYY-MM-DD, parsear manualmente para evitar problemas de zona horaria
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split('-');
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }
  
  // Si es un objeto Date, usar métodos locales
  if (date instanceof Date) {
    if (isNaN(date.getTime())) return '-';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  }
  
  // Si es un string ISO con hora, extraer solo la parte de la fecha
  if (typeof date === 'string') {
    const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year);
    }
  }
  
  // Fallback: intentar parsear como Date
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

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD usando la zona horaria local
 * Evita problemas de conversión UTC que pueden cambiar el día
 * @returns {string} - Fecha actual en formato YYYY-MM-DD
 */
export function getTodayLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha a formato YYYY-MM-DD usando la zona horaria local
 * Útil para inputs de tipo date que requieren formato YYYY-MM-DD
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} - Fecha en formato YYYY-MM-DD o string vacío si es inválida
 */
export function formatDateForInput(date) {
  if (!date) return '';
  
  // Si ya viene en formato YYYY-MM-DD, devolverla tal cual
  // Esto evita problemas de zona horaria cuando el backend envía fechas sin hora
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Si es un objeto Date, usar métodos locales
  if (date instanceof Date) {
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Si es un string ISO con hora, parsear manualmente para evitar problemas de zona horaria
  // Extraer solo la parte de la fecha (YYYY-MM-DD) si viene en formato ISO
  if (typeof date === 'string') {
    const dateMatch = date.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      return dateMatch[1];
    }
  }
  
  // Fallback: intentar parsear como Date
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  // Usar métodos locales en lugar de UTC para evitar problemas de zona horaria
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

