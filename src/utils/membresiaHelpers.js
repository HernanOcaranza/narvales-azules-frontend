/**
 * Funciones helper para trabajar con membresías y estados de pago
 */

/**
 * Determina el estado de membresía de un alumno
 * @param {object} alumno - Objeto alumno con membresias
 * @returns {object} - Objeto con tipo, label, color, icon y prioridad
 */
export function getEstadoMembresia(alumno) {
  // Si no tiene membresías
  if (!alumno.membresias || alumno.membresias.length === 0) {
    return {
      tipo: 'sin_membresia',
      label: 'Sin Membresía',
      color: '#dc3545', // rojo
      icon: 'error',
      prioridad: 1
    };
  }

  // Obtener la membresía más reciente (por fecha_inicio)
  const membresiaMasReciente = alumno.membresias
    .filter(m => m.fecha_inicio) // Filtrar membresías sin fecha
    .sort((a, b) => {
      const dateA = new Date(a.fecha_inicio);
      const dateB = new Date(b.fecha_inicio);
      return dateB.getTime() - dateA.getTime(); // Más reciente primero
    })[0];

  // Si no hay membresías con fecha, usar la primera
  const membresia = membresiaMasReciente || alumno.membresias[0];

  const estadoMembresia = membresia.estado;
  const estadoPago = membresia.pago?.estado || 'pendiente';

  // Membresía vencida
  if (estadoMembresia === 'vencida') {
    return {
      tipo: 'vencida',
      label: 'Membresía Vencida',
      color: '#6c757d', // gris
      icon: 'schedule',
      prioridad: 5
    };
  }

  // Membresía suspendida
  if (estadoMembresia === 'suspendida') {
    return {
      tipo: 'suspendida',
      label: 'Membresía Suspendida',
      color: '#ffc107', // amarillo
      icon: 'pause_circle',
      prioridad: 6
    };
  }

  // Membresía cancelada
  if (estadoMembresia === 'cancelada') {
    return {
      tipo: 'cancelada',
      label: 'Membresía Cancelada',
      color: '#6c757d', // gris
      icon: 'cancel',
      prioridad: 6
    };
  }

  // Membresía activa - verificar estado de pago
  if (estadoMembresia === 'activa') {
    if (estadoPago === 'completo') {
      return {
        tipo: 'activa_completa',
        label: 'Activa - Pagada',
        color: '#28a745', // verde
        icon: 'check_circle',
        prioridad: 4
      };
    } else if (estadoPago === 'parcial') {
      return {
        tipo: 'activa_parcial',
        label: 'Activa - Pago Incompleto',
        color: '#fd7e14', // naranja
        icon: 'warning',
        prioridad: 3
      };
    } else if (estadoPago === 'pendiente' || estadoPago === 'cancelado' || !estadoPago) {
      // pendiente, cancelado o sin pago
      return {
        tipo: 'activa_pendiente',
        label: 'Activa - Sin Pagar',
        color: '#dc3545', // rojo
        icon: 'error',
        prioridad: 2
      };
    } else {
      // Cualquier otro estado de pago
      return {
        tipo: 'activa_pendiente',
        label: 'Activa - Sin Pagar',
        color: '#dc3545', // rojo
        icon: 'error',
        prioridad: 2
      };
    }
  }

  // Estado por defecto
  return {
    tipo: 'sin_membresia',
    label: 'Estado Desconocido',
    color: '#6c757d',
    icon: 'help',
    prioridad: 7
  };
}

/**
 * Obtiene el color de MUI correspondiente al tipo de estado
 * @param {string} tipo - Tipo de estado
 * @returns {string} - Color de MUI ('success', 'error', 'warning', 'default')
 */
export function getEstadoMembresiaMuiColor(tipo) {
  const colorMap = {
    'sin_membresia': 'error',
    'activa_completa': 'success',
    'activa_parcial': 'warning',
    'activa_pendiente': 'error',
    'vencida': 'default',
    'suspendida': 'warning',
    'cancelada': 'default',
  };
  return colorMap[tipo] || 'default';
}

/**
 * Filtra alumnos por estado de membresía
 * @param {array} alumnos - Lista de alumnos
 * @param {string|array} estadosFiltro - Estado(s) a filtrar
 * @returns {array} - Alumnos filtrados
 */
export function filtrarAlumnosPorEstado(alumnos, estadosFiltro) {
  if (!estadosFiltro || estadosFiltro.length === 0) {
    return alumnos;
  }

  const estadosArray = Array.isArray(estadosFiltro) ? estadosFiltro : [estadosFiltro];

  return alumnos.filter(alumno => {
    const estado = getEstadoMembresia(alumno);
    return estadosArray.includes(estado.tipo);
  });
}

/**
 * Ordena alumnos por prioridad de estado de membresía
 * @param {array} alumnos - Lista de alumnos
 * @param {string} orden - 'asc' o 'desc' (default: 'asc' - mayor prioridad primero)
 * @returns {array} - Alumnos ordenados
 */
export function ordenarAlumnosPorEstado(alumnos, orden = 'asc') {
  return [...alumnos].sort((a, b) => {
    const estadoA = getEstadoMembresia(a);
    const estadoB = getEstadoMembresia(b);
    
    if (orden === 'asc') {
      return estadoA.prioridad - estadoB.prioridad;
    } else {
      return estadoB.prioridad - estadoA.prioridad;
    }
  });
}
