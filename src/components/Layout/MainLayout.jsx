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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';

const DRAWER_WIDTH = 240;

const menuItems = [
  {
    key: ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
    label: 'Dashboard',
  },
  {
    key: ROUTES.ALUMNOS,
    icon: <PeopleIcon />,
    label: 'Alumnos',
  },
  {
    key: ROUTES.MEMBRESIAS,
    icon: <CreditCardIcon />,
    label: 'Membresías',
  },
  {
    key: ROUTES.PAGOS,
    icon: <AttachMoneyIcon />,
    label: 'Pagos',
  },
  {
    key: ROUTES.CLASES,
    icon: <BookIcon />,
    label: 'Clases',
  },
  {
    key: ROUTES.GRUPOS,
    icon: <GroupIcon />,
    label: 'Grupos',
  },
  {
    key: ROUTES.EMPLEADOS,
    icon: <BadgeIcon />,
    label: 'Empleados',
  },
];

const configuracionSubItems = [
  {
    key: ROUTES.CONFIGURACION_CATEGORIAS,
    icon: <CategoryIcon />,
    label: 'Categorías',
  },
  {
    key: ROUTES.CONFIGURACION_DISCIPLINAS,
    icon: <SportsIcon />,
    label: 'Disciplinas',
  },
  {
    key: ROUTES.CONFIGURACION_CONDICIONES,
    icon: <MedicalServicesIcon />,
    label: 'Condiciones',
  },
];

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
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
          backgroundColor: 'primary.main',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px !important',
        }}
      >
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
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
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.key ? 'white' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Menú de Configuración con submenús */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleConfigToggle}
            selected={isConfigRoute}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.main',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isConfigRoute ? 'white' : 'inherit',
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
            {configuracionSubItems.map((item) => (
              <ListItem key={item.key} disablePadding>
                <ListItemButton
                  selected={isConfigSelected(item.key)}
                  onClick={() => handleMenuClick(item.key)}
                  sx={{
                    pl: 4,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isConfigSelected(item.key) ? 'white' : 'inherit',
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
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Natatorio
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user.usuario || user.nombre || 'Usuario'}
            </Typography>
          )}
          <IconButton color="inherit" onClick={handleLogout} title="Cerrar sesión">
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
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
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
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default MainLayout;

