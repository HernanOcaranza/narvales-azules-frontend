import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  Book as BookIcon,
  Group as GroupIcon,
  Badge as BadgeIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
  Sports as SportsIcon,
  MedicalServices as MedicalServicesIcon,
  Logout as LogoutIcon,
  CardMembership as CardMembershipIcon,
  PriceCheck as PriceCheckIcon,
  Pool as PoolIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { usePermission } from '../../hooks/usePermission';

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
  [ROUTES.CONFIGURACION_PRECIO_MEMBRESIAS]: 'Precios de Membresía',
};

const allMenuItems = [
  {
    key: ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
    label: 'Estadisticas',
    roles: ['admin'],
  },
  {
    key: ROUTES.ALUMNOS,
    icon: <PeopleIcon />,
    label: 'Alumnos',
    roles: ['admin', 'recepcionista', 'profesor'],
  },
  {
    key: ROUTES.MEMBRESIAS,
    icon: <CreditCardIcon />,
    label: 'Membresías',
    roles: ['admin', 'recepcionista'],
  },
  {
    key: ROUTES.PAGOS,
    icon: <AttachMoneyIcon />,
    label: 'Pagos',
    roles: ['admin', 'recepcionista'],
  },
  {
    key: ROUTES.CLASES,
    icon: <BookIcon />,
    label: 'Clases',
    roles: ['admin', 'recepcionista', 'profesor'],
  },
  {
    key: ROUTES.GRUPOS,
    icon: <GroupIcon />,
    label: 'Grupos',
    roles: ['admin', 'recepcionista', 'profesor'],
  },
  {
    key: ROUTES.EMPLEADOS,
    icon: <BadgeIcon />,
    label: 'Empleados',
    roles: ['admin'],
  },
];

const configuracionSubItems = [
  {
    key: ROUTES.CONFIGURACION_CATEGORIAS,
    icon: <CategoryIcon />,
    label: 'Categorías',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_DISCIPLINAS,
    icon: <SportsIcon />,
    label: 'Disciplinas',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_CONDICIONES,
    icon: <MedicalServicesIcon />,
    label: 'Condiciones',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_TIPO_MEMBRESIAS,
    icon: <CardMembershipIcon />,
    label: 'Tipos de Membresía',
    roles: ['admin'],
  },
  {
    key: ROUTES.CONFIGURACION_PRECIO_MEMBRESIAS,
    icon: <PriceCheckIcon />,
    label: 'Precios de Membresía',
    roles: ['admin'],
  },
];

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, user, userRole } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = allMenuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  const filteredConfigItems = configuracionSubItems.filter(item =>
    userRole && item.roles.includes(userRole)
  );

  const showConfig = userRole === 'admin';
  const [configOpen, setConfigOpen] = React.useState(
    location.pathname.startsWith(ROUTES.CONFIGURACION)
  );

  // Mantener el menú de configuración abierto cuando se navega entre submenús
  React.useEffect(() => {
    if (location.pathname.startsWith(ROUTES.CONFIGURACION)) {
      setConfigOpen(true);
    }
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleConfigToggle = () => {
    setConfigOpen(!configOpen);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isConfigRoute = location.pathname.startsWith(ROUTES.CONFIGURACION);
  const isConfigSelected = (route) => location.pathname === route;

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, #0D7CAD 0%, #3AA8D0 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px !important',
        }}
      >
        <PoolIcon sx={{ mr: 1, fontSize: 24 }} />
        <Typography variant="h6" noWrap component="div" fontWeight="bold" sx={{ color: '#FFFFFF' }}>
          Natatorio
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={location.pathname === item.key}
              onClick={() => handleMenuClick(item.key)}
              sx={{
                color: '#0D3244',
                '& .MuiListItemIcon-root': {
                  color: 'text.secondary',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(13, 124, 173, 0.1)',
                  color: '#0D7CAD',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(13, 124, 173, 0.15)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#0D7CAD',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.key ? '#0D7CAD' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Menú de Configuración con submenús - solo admin */}
        {showConfig && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleConfigToggle}
                selected={isConfigRoute}
                sx={{
                  color: '#0D3244',
                  '& .MuiListItemIcon-root': {
                    color: 'text.secondary',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(13, 124, 173, 0.1)',
                    color: '#0D7CAD',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(13, 124, 173, 0.15)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#0D7CAD',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isConfigRoute ? '#0D7CAD' : 'text.secondary',
                  }}
                >
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configuración" />
                {configOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={configOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {filteredConfigItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  selected={isConfigSelected(item.key)}
                  onClick={() => handleMenuClick(item.key)}
                  sx={{
                    pl: 4,
                    color: '#0D3244',
                    '& .MuiListItemIcon-root': {
                      color: 'text.secondary',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(13, 124, 173, 0.1)',
                      color: '#0D7CAD',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(13, 124, 173, 0.15)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: '#0D7CAD',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isConfigSelected(item.key) ? '#0D7CAD' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          ml: { md: 0 },
          background: 'linear-gradient(135deg, #0D7CAD 0%, #3AA8D0 100%)',
          color: '#FFFFFF',
          boxShadow: '0 2px 12px rgba(13, 124, 173, 0.25)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: '#FFFFFF' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#FFFFFF' }}>
            {ROUTES_TITLES[location.pathname] || 'Sistema de Gestión de Natatorio'}
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' }, color: 'rgba(255, 255, 255, 0.9)' }}>
              {user.usuario || user.nombre || 'Usuario'}
            </Typography>
          )}
          <IconButton color="inherit" onClick={handleLogout} title="Cerrar sesión" sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' } }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': {
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '2px 0 12px rgba(13, 124, 173, 0.08)',
              borderRight: '1px solid rgba(13, 124, 173, 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'block', md: 'block' },
            '& .MuiDrawer-paper': {
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '2px 0 12px rgba(13, 124, 173, 0.08)',
              borderRight: '1px solid rgba(13, 124, 173, 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: '100%',
          maxWidth: '100%',
          mt: '64px',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;

