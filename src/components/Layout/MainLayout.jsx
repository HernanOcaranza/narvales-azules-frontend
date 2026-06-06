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
  User,
  Key,
  FileText,
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
  [ROUTES.REPORTES]: 'Reportes',
  [ROUTES.REPORTES_ASISTENCIA_ALUMNOS]: 'Asistencia de Alumnos',
  [ROUTES.REPORTES_ASISTENCIA_EMPLEADOS]: 'Asistencia de Empleados',
  [ROUTES.REPORTES_MEMBRESIAS]: 'Membresías',
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
    roles: ['admin', 'recepcionista', 'profesor', 'guardavidas'],
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
    roles: ['admin', 'recepcionista', 'profesor', 'guardavidas'],
  },
  {
    key: ROUTES.GRUPOS,
    icon: Group,
    label: 'Grupos',
    roles: ['admin', 'recepcionista', 'profesor', 'guardavidas'],
  },
  {
    key: ROUTES.EMPLEADOS,
    icon: BadgeIcon,
    label: 'Empleados',
    roles: ['admin'],
  },
  {
    key: ROUTES.REPORTES,
    icon: FileText,
    label: 'Reportes',
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
  const overlayClickRef = React.useRef(false);
  const [configOpen, setConfigOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const desktopMenuRef = React.useRef(null);
  const mobileMenuRef = React.useRef(null);

  React.useEffect(() => {
    if (location.pathname.startsWith(ROUTES.CONFIGURACION)) {
      setConfigOpen(true);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    function handleClickOutside(e) {
      const desktop = desktopMenuRef.current;
      const mobile = mobileMenuRef.current;
      const inDesktop = desktop && desktop.contains(e.target);
      const inMobile = mobile && mobile.contains(e.target);
      if (!inDesktop && !inMobile) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-primary-main to-primary-light text-white gap-3">
        <img src="/logo-narvales-azules.png" alt="Narvales Azules" className="h-10" />
        <span className="text-2xl font-bold">Natatorio</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isSelected={item.key === ROUTES.REPORTES
              ? location.pathname.startsWith(ROUTES.REPORTES)
              : location.pathname === item.key}
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
    <div className="min-h-screen flex flex-col">
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
        <div className="ml-auto relative" ref={mobileMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-1.5 p-2 hover:bg-white/10 rounded-lg"
          >
            <User className="w-5 h-5" />
            <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.nombre} {user?.apellido}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.tipo}</p>
              </div>
              <button
                onClick={() => { navigate(ROUTES.CAMBIAR_CONTRASENIA); setMobileOpen(false); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Key className="w-4 h-4" />
                Cambiar contraseña
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black/50" onMouseDown={(e) => { overlayClickRef.current = (e.target === e.currentTarget); }} onMouseUp={(e) => { if (e.target === e.currentTarget && overlayClickRef.current) setMobileOpen(false); }} />
        <aside className="absolute left-0 top-0 bottom-0 w-60 bg-white/98 backdrop-blur-sm border-r border-primary-light/20">
          <DrawerContent />
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-white/70 backdrop-blur-md border-r border-primary-light/20 flex-col">
        <DrawerContent />
      </aside>

      {/* Logo de fondo */}
      <div className="hidden md:flex fixed inset-0 items-center justify-center pointer-events-none z-0 md:ml-60">
        <img
          src="/logo-narvales-azules.png"
          alt=""
          className="w-11/12 max-w-[70rem] opacity-15"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 mt-16 md:mt-16 md:ml-60 p-4 overflow-x-auto relative z-10">
        <div className="max-w-7xl mx-auto w-full h-full">
          {children}
        </div>
      </main>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 right-0 left-60 h-16 bg-gradient-to-r from-primary-main/90 to-primary-light/90 backdrop-blur-sm text-white shadow-lg z-40 items-center px-6">
        <h1 className="text-lg font-semibold flex-1">
          {ROUTES_TITLES[location.pathname] || 'Sistema de Gestión de Natatorio'}
        </h1>
        <div className="relative flex items-center" ref={desktopMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-sm">
              {user?.usuario || user?.nombre || 'Usuario'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.nombre} {user?.apellido}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.tipo}</p>
              </div>

              <button
                onClick={() => { navigate(ROUTES.CAMBIAR_CONTRASENIA); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Key className="w-4 h-4" />
                Cambiar contraseña
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default MainLayout;