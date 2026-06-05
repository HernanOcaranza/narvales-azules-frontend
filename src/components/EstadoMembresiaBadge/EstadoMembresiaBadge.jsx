import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Chip } from '../../components/ui';

function EstadoMembresiaBadge({ alumno, size = 'md' }) {
  const getEstado = () => {
    if (!alumno?.membresias || alumno?.membresias?.length === 0) {
      return { label: 'Sin membresía', variant: 'default', icon: AlertCircle };
    }
    
    const membresiaActiva = alumno?.membresias?.find(m => m.estado === 'activa');
    if (membresiaActiva) {
      const hoy = new Date();
      const fin = new Date(membresiaActiva.fecha_fin);
      const diasRestantes = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
      
      if (diasRestantes <= 7) {
        return { label: `Por vencer (${diasRestantes}d)`, variant: 'warning', icon: Clock };
      }
      return { label: 'Activa', variant: 'success', icon: CheckCircle };
    }
    
    const membresiaVencida = alumno?.membresias?.find(m => m.estado === 'vencida');
    if (membresiaVencida) {
      return { label: 'Vencida', variant: 'error', icon: AlertCircle };
    }
    
    return { label: 'Sin membresía', variant: 'default', icon: AlertCircle };
  };

  const estado = getEstado();
  const Icon = estado.icon;

  return (
    <Chip 
      label={estado.label} 
      variant={estado.variant} 
      size={size}
      icon={<Icon className={`w-3 h-3 ${estado.variant === 'success' ? 'text-green-600' : estado.variant === 'warning' ? 'text-amber-600' : 'text-red-600'}`} />}
    />
  );
}

export default EstadoMembresiaBadge;