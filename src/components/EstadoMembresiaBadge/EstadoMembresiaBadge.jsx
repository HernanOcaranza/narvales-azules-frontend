import React from 'react';
import { Chip, Box } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  PauseCircle as PauseCircleIcon,
  Cancel as CancelIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { getEstadoMembresia, getEstadoMembresiaMuiColor } from '../../utils/membresiaHelpers';

/**
 * Componente que muestra un badge con el estado de membresía de un alumno
 * @param {object} props
 * @param {object} props.alumno - Objeto alumno con membresias
 * @param {boolean} props.showIcon - Si se debe mostrar el icono (default: true)
 * @param {string} props.size - Tamaño del badge ('small' | 'medium' | 'large', default: 'small')
 */
export const EstadoMembresiaBadge = ({ alumno, showIcon = true, size = 'small' }) => {
  if (!alumno) {
    return null;
  }
  
  const estado = getEstadoMembresia(alumno);
  const muiColor = getEstadoMembresiaMuiColor(estado.tipo);

  // Mapeo de iconos
  const iconMap = {
    'check_circle': CheckCircleIcon,
    'error': ErrorIcon,
    'warning': WarningIcon,
    'schedule': ScheduleIcon,
    'pause_circle': PauseCircleIcon,
    'cancel': CancelIcon,
    'help': HelpIcon,
  };

  const IconComponent = iconMap[estado.icon] || HelpIcon;

  return (
    <Chip
      label={estado.label}
      color={muiColor}
      size={size}
      icon={showIcon ? <IconComponent /> : undefined}
      sx={{
        fontWeight: 500,
        ...(muiColor === 'default' && {
          backgroundColor: `${estado.color}20`,
          color: estado.color,
          border: `1px solid ${estado.color}`,
        }),
      }}
    />
  );
};

export default EstadoMembresiaBadge;
