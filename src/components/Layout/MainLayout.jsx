import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  BookOpen,
  Group,
  Badge as BadgeIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Tag,
  Dumbbell,
  HeartPulse,
  Waves,
  LogOut,
  Menu,
  X,
  Folder,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 240;

const ROUTES_TITLES = {
  [ROUTES.DASHBOARD]: 'Estadísticas',
  [ROUTES.ALUMNOS]: 'Alumnos',
  [ROUTES.MEMBRESIAS]: 'Membresías',
  [ROUTES.PAGOS]: 'Pagos',
  [ROUTES.CLASES]: 'Clases',
  [ROUTES.GRUPOS]: 'Grupos',
  [ROUTES.EMPLEADOS]: 'Empleados',
  [ROUTES.CONFIGURACION_DISCIPLINAS]: 'Disciplinas',
  [ROUTES.CONFIGURACION_CATEGORIAS]: 'Categorías',
  [ROUTES.CONFIGURACION_CONDICIONES]: 'Condiciones',
  [ROUTES.CONFIGURACION_TIPO_MEMBRESIAS]: 'Tipos de Membresía',
};

const allMenuItems = [
  {
    key: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    label: 'Estadísticas',
    roles: ['admin'],
  },
  {
    key: ROUTES.ALUMNOS,
    icon: Users,
    label: 'Alumnos',
    roles: ['admin', 'recepcionista', 'profesor'],
  },
  {
    key: ROUTES.MEMBRESIAS,
    icon: CreditCard,
    label: 'Membresías',
    roles: ['admin', 'recepcionista'],
  },
  {
    key: ROUTES.PAGOS,
    icon: DollarSign,
    label: 'Pagos',
    roles: ['admin', 'recepcionista'],
  },
  {
    key: ROUTES.CLASES,
    icon: BookOpen,
    label: 'Clases',
    roles: ['admin', 'recepcionista', 'profesor'],
  },
  {
    key: ROUTES.GRUPOS,
    icon: Group,
    label: 'Grupos',
    roles: ['admin', 'recepcionista', 'profesor'],
  },
  {
    key: ROUTES.EMPLEADOS,
    icon: BadgeIcon,
    label: 'Empleados',
    roles: ['admin'],
  },
];

const configuracionSubItems = [
  {
    key: ROUTES.CONFIGURACION_CATEGORIAS,
    icon: Folder,
    label: 'Categorías',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_DISCIPLINAS,
    icon: Dumbbell,
    label: 'Disciplinas',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_CONDICIONES,
    icon: HeartPulse,
    label: 'Condiciones',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_TIPO_MEMBRESIAS,
    icon: CreditCard,
    label: 'Tipos de Membresía',
    roles: ['admin'],
  },
];

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, userRole } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [configOpen, setConfigOpen] = React.useState(false);

  React.useEffect(() => {
    if (location.pathname.startsWith(ROUTES.CONFIGURACION)) {
      setConfigOpen(true);
    }
  }, [location.pathname]);

  const menuItems = allMenuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  const filteredConfigItems = configuracionSubItems.filter(item =>
    userRole && item.roles.includes(userRole)
  );

  const showConfig = userRole === 'admin';
  const isConfigRoute = location.pathname.startsWith(ROUTES.CONFIGURACION);
  const isConfigSelected = (route) => location.pathname === route;

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const MenuItem = ({ item, isSelected }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={() => handleMenuClick(item.key)}
        className={`
          w-full flex items-center gap-3 px-4 py-2.5 text-left
          transition-colors duration-200
          ${isSelected 
            ? 'bg-primary-main/10 text-primary-main font-semibold' 
            : 'text-text-primary hover:bg-gray-50'}
        `}
      >
        <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-main' : 'text-text-secondary'}`} />
        <span>{item.label}</span>
      </button>
    );
  };

  const DrawerContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-primary-main to-primary-light text-white">
        <Waves className="w-6 h-6 mr-2" />
        <span className="text-lg font-bold">Natatorio</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isSelected={location.pathname === item.key}
          />
        ))}

        {showConfig && (
          <div className="mt-2">
            <button
              onClick={() => setConfigOpen(!configOpen)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 text-left
                transition-colors duration-200
                ${isConfigRoute 
                  ? 'bg-primary-main/10 text-primary-main font-semibold' 
                  : 'text-text-primary hover:bg-gray-50'}
              `}
            >
              <Settings className={`w-5 h-5 ${isConfigRoute ? 'text-primary-main' : 'text-text-secondary'}`} />
              <span className="flex-1">Configuración</span>
              {configOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {configOpen && (
              <div className="bg-gray-50/50">
                {filteredConfigItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleMenuClick(item.key)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 pl-10 text-left
                      transition-colors duration-200
                      ${isConfigSelected(item.key)
                        ? 'bg-primary-main/10 text-primary-main font-semibold'
                        : 'text-text-primary hover:bg-gray-50'}
                    `}
                  >
                    <item.icon className={`w-4 h-4 ${isConfigSelected(item.key) ? 'text-primary-main' : 'text-text-secondary'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-primary-main/90 to-primary-light/90 backdrop-blur-sm text-white shadow-lg z-50 flex items-center px-4">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="ml-3 text-lg font-semibold">
          {ROUTES_TITLES[location.pathname] || 'Sistema de Gestión de Natatorio'}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm hidden">{user?.usuario || user?.nombre || 'Usuario'}</span>
          <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-lg" title="Cerrar sesión">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white/98 backdrop-blur-sm border-r border-primary-light/20">
          <DrawerContent />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-white/70 backdrop-blur-md border-r border-primary-light/20 flex-col">
        <DrawerContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-16 md:ml-60 p-4 min-h-screen overflow-x-auto">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 right-0 left-60 h-16 bg-gradient-to-r from-primary-main/90 to-primary-light/90 backdrop-blur-sm text-white shadow-lg z-40 items-center px-6">
        <h1 className="text-lg font-semibold flex-1">
          {ROUTES_TITLES[location.pathname] || 'Sistema de Gestión de Natatorio'}
        </h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm opacity-90">
              {user.usuario || user.nombre || 'Usuario'}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>
    </div>
  );
}

export default MainLayout;