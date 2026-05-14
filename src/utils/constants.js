/**
 * Constantes del sistema
 */

// Rutas de la aplicación
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  ALUMNOS: '/alumnos',
  MEMBRESIAS: '/membresias',
  PAGOS: '/pagos',
  CLASES: '/clases',
  GRUPOS: '/grupos',
  EMPLEADOS: '/empleados',
  CONFIGURACION: '/configuracion',
  CONFIGURACION_CATEGORIAS: '/configuracion/categorias',
  CONFIGURACION_DISCIPLINAS: '/configuracion/disciplinas',
  CONFIGURACION_CONDICIONES: '/configuracion/condiciones',
  CONFIGURACION_TIPO_MEMBRESIAS: '/configuracion/tipo-membresias',
  CONFIGURACION_PRECIO_MEMBRESIAS: '/configuracion/precio-membresias',
};

// Estados comunes
export const ESTADOS = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  PENDIENTE: 'pendiente',
  CANCELADO: 'cancelado',
};

// Tipos de membresía
export const TIPOS_MEMBRESIA = {
  MENSUAL: 'mensual',
  TRIMESTRAL: 'trimestral',
  SEMESTRAL: 'semestral',
  ANUAL: 'anual',
};

// Estados de pago
export const ESTADOS_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  VENCIDO: 'vencido',
  CANCELADO: 'cancelado',
};

// Estados de clase
export const ESTADOS_CLASE = {
  PENDIENTE: 'pendiente',
  REALIZADA: 'realizada',
  SUSPENDIDA: 'suspendida',
};

// Días de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
export const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Helper para obtener nombre del día
export const obtenerNombreDia = (diaSemana) => {
  return DIAS_SEMANA[diaSemana] || 'Desconocido';
};

