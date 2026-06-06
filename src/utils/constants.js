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
  OLVIDE_CLAVE: '/olvide-mi-clave',
  CAMBIAR_CLAVE: '/cambiar-clave',
  CAMBIAR_CONTRASENIA: '/cambiar-contrasenia',
  REPORTES: '/reportes',
  REPORTES_ASISTENCIA_ALUMNOS: '/reportes/asistencia-alumnos',
  REPORTES_ASISTENCIA_EMPLEADOS: '/reportes/asistencia-empleados',
  REPORTES_MEMBRESIAS: '/reportes/membresias',
  REPORTES_FINANCIERO: '/reportes/financiero',
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
  { valor: 0, nombre: 'Domingo' },
  { valor: 1, nombre: 'Lunes' },
  { valor: 2, nombre: 'Martes' },
  { valor: 3, nombre: 'Miércoles' },
  { valor: 4, nombre: 'Jueves' },
  { valor: 5, nombre: 'Viernes' },
  { valor: 6, nombre: 'Sábado' },
];

// Helper para obtener nombre del día
export const obtenerNombreDia = (diaSemana) => {
  if (diaSemana === undefined || diaSemana === null) return 'Desconocido';
  const dia = DIAS_SEMANA.find(d => d.valor === diaSemana);
  return dia?.nombre || 'Desconocido';
};

