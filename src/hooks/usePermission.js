import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const ROLE_PERMISSIONS = {
  admin: [
    ROUTES.DASHBOARD,
    ROUTES.ALUMNOS,
    ROUTES.MEMBRESIAS,
    ROUTES.PAGOS,
    ROUTES.CLASES,
    ROUTES.GRUPOS,
    ROUTES.EMPLEADOS,
    ROUTES.CONFIGURACION_CATEGORIAS,
    ROUTES.CONFIGURACION_DISCIPLINAS,
    ROUTES.CONFIGURACION_CONDICIONES,
    ROUTES.CONFIGURACION_TIPO_MEMBRESIAS,
    ROUTES.CONFIGURACION_PRECIO_MEMBRESIAS,
  ],
  recepcionista: [
    ROUTES.ALUMNOS,
    ROUTES.MEMBRESIAS,
    ROUTES.PAGOS,
    ROUTES.CLASES,
    ROUTES.GRUPOS,
  ],
  profesor: [
    ROUTES.CLASES,
    ROUTES.GRUPOS,
    ROUTES.ALUMNOS,
  ],
};

export function usePermission() {
  const { user, userRole } = useAuth();

  const hasPermission = (route) => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return false;
    }
    return ROLE_PERMISSIONS[userRole].includes(route);
  };

  const getAllowedRoutes = () => {
    if (!userRole || !ROLE_PERMISSIONS[userRole]) {
      return [];
    }
    return ROLE_PERMISSIONS[userRole];
  };

  const canAccessRoute = (route) => {
    return hasPermission(route);
  };

  return {
    hasPermission,
    getAllowedRoutes,
    canAccessRoute,
    userRole,
  };
}