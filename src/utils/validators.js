/**
 * Funciones de validación para formularios
 */

/**
 * Valida un pago
 * @param {object} pago - Datos del pago
 * @returns {object} - Objeto con errores (vacío si no hay errores)
 */
export function validatePago(pago) {
  const errors = {};

  if (!pago.tipo || (pago.tipo !== 'ingreso' && pago.tipo !== 'egreso')) {
    errors.tipo = 'El tipo de pago es requerido y debe ser "ingreso" o "egreso"';
  }

  if (pago.tipo === 'egreso' && !pago.id_empleado) {
    errors.id_empleado = 'El empleado es obligatorio para egresos';
  }

  if (pago.tipo === 'ingreso' && pago.id_empleado) {
    errors.id_empleado = 'Los ingresos no deben tener empleado asociado';
  }

  if (!pago.fecha_pago) {
    errors.fecha_pago = 'La fecha de pago es requerida';
  } else {
    const fecha = new Date(pago.fecha_pago);
    if (isNaN(fecha.getTime())) {
      errors.fecha_pago = 'La fecha de pago no es válida';
    }
  }

  if (!pago.estado || pago.estado.trim() === '') {
    errors.estado = 'El estado es requerido';
  }

  return errors;
}

/**
 * Valida un detalle de pago
 * @param {object} detalle - Datos del detalle
 * @returns {object} - Objeto con errores (vacío si no hay errores)
 */
export function validateDetallePago(detalle) {
  const errors = {};

  if (!detalle.metodo_pago || detalle.metodo_pago.trim() === '') {
    errors.metodo_pago = 'El método de pago es requerido';
  }

  if (!detalle.monto_parcial || Number(detalle.monto_parcial) <= 0) {
    errors.monto_parcial = 'El monto debe ser mayor a 0';
  }

  if (!detalle.fecha_detalle) {
    errors.fecha_detalle = 'La fecha del detalle es requerida';
  } else {
    const fecha = new Date(detalle.fecha_detalle);
    if (isNaN(fecha.getTime())) {
      errors.fecha_detalle = 'La fecha del detalle no es válida';
    }
  }

  return errors;
}

/**
 * Valida una membresía
 * @param {object} membresia - Datos de la membresía
 * @returns {object} - Objeto con errores (vacío si no hay errores)
 */
export function validateMembrecia(membresia) {
  const errors = {};

  if (!membresia.id_alumno) {
    errors.id_alumno = 'El alumno es requerido';
  }

  if (!membresia.id_tipo_membrecia) {
    errors.id_tipo_membrecia = 'El tipo de membresía es requerido';
  }

  if (!membresia.id_grupo) {
    errors.id_grupo = 'El grupo es requerido';
  }

  if (!membresia.fecha_inicio) {
    errors.fecha_inicio = 'La fecha de inicio es requerida';
  } else {
    const fechaInicio = new Date(membresia.fecha_inicio);
    if (isNaN(fechaInicio.getTime())) {
      errors.fecha_inicio = 'La fecha de inicio no es válida';
    }
  }

  if (membresia.fecha_fin) {
    const fechaInicio = new Date(membresia.fecha_inicio);
    const fechaFin = new Date(membresia.fecha_fin);
    
    if (isNaN(fechaFin.getTime())) {
      errors.fecha_fin = 'La fecha de fin no es válida';
    } else if (fechaFin < fechaInicio) {
      errors.fecha_fin = 'La fecha de fin debe ser mayor o igual a la fecha de inicio';
    }
  }

  if (!membresia.estado || !['activa', 'vencida', 'suspendida', 'cancelada'].includes(membresia.estado)) {
    errors.estado = 'El estado debe ser: activa, vencida, suspendida o cancelada';
  }

  return errors;
}

