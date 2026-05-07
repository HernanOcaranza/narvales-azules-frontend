import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  Event as EventIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
  });
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await dashboardService.getStats();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const stats = data?.resumen || {
    totalAlumnos: 0,
    membresiasActivas: 0,
    membresiasVencidas: 0,
    pagosPendientes: 0,
    pagosParciales: 0,
    clasesHoy: 0,
    ingresosMes: 0,
    egresosMes: 0,
    gananciaNeta: 0,
    gruposActivos: 0,
    tutoresRegistrados: 0,
    empleadosActivos: 0,
    membresiasPorVencer: 0,
  };

  const statCards = [
    {
      title: 'Total Alumnos',
      value: stats.totalAlumnos,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      subtitle: 'Activos',
    },
    {
      title: 'Membresías Activas',
      value: stats.membresiasActivas,
      icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      subtitle: stats.membresiasPorVencer > 0 ? `${stats.membresiasPorVencer} por vencer` : 'Vigentes',
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresosMes),
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      subtitle: stats.pagosPendientes > 0 ? `${stats.pagosPendientes} pendientes` : 'Completado',
    },
    {
      title: 'Clases Hoy',
      value: stats.clasesHoy,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      subtitle: 'Programadas',
    },
  ];

  const financieraCards = [
    {
      title: 'Ingresos',
      value: formatCurrency(stats.ingresosMes),
      color: '#2e7d32',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Egresos',
      value: formatCurrency(stats.egresosMes),
      color: '#d32f2f',
      icon: <AttachMoneyIcon />,
    },
    {
      title: 'Ganancia Neta',
      value: formatCurrency(stats.gananciaNeta),
      color: stats.gananciaNeta >= 0 ? '#1976d2' : '#d32f2f',
      icon: stats.gananciaNeta >= 0 ? <CheckCircleIcon /> : <WarningIcon />,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  {stat.title === 'Membresías Activas' && stats.membresiasPorVencer > 0 && (
                    <Chip
                      size="small"
                      icon={<WarningIcon sx={{ fontSize: 16 }} />}
                      label={`${stats.membresiasPorVencer} por vencer`}
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Typography variant="h4" component="div" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {financieraCards.map((card, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: `${card.color}20`, color: card.color }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Alumnos por Disciplina
              </Typography>
              {data?.disciplinas?.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {data.disciplinas.map((disc, index) => {
                    const total = stats.totalAlumnos || 1;
                    const porcentaje = Math.round((disc.totalAlumnos / total) * 100);
                    return (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{disc.nombre}</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {disc.totalAlumnos}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={porcentaje}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: ['#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2'][index % 4],
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No hay datos de disciplinas
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Miembros por Categoría
              </Typography>
              {data?.categorias?.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {data.categorias.map((cat, index) => {
                    const total = stats.totalAlumnos || 1;
                    const porcentaje = Math.round((cat.totalAlumnos / total) * 100);
                    return (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">
                            {cat.nombre} {cat.descripcion && `(${cat.descripcion})`}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {cat.totalAlumnos}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={porcentaje}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: ['#1976d2', '#2e7d32', '#d32f2f', '#7b1fa2'][index % 4],
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  No hay datos de categorías
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Últimas Membresías
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {data?.ultimasMembresias?.length > 0 ? (
                <List disablePadding>
                  {data.ultimasMembresias.slice(0, 5).map((m, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${m.alumno?.nombre} ${m.alumno?.apellido}`}
                        secondary={`${m.tipo_membrecia?.tipo_membrecia} - ${m.grupo?.nombre}`}
                      />
                      <Chip
                        size="small"
                        label={m.estado}
                        color={m.estado === 'activa' ? 'success' : m.estado === 'vencida' ? 'error' : 'default'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay membresías registradas
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Próximas Clases
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {data?.ultimasClases?.length > 0 ? (
                <List disablePadding>
                  {data.ultimasClases.slice(0, 5).map((clase, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#7b1fa2' }}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={clase.grupo?.nombre}
                        secondary={`${formatDate(clase.fecha_clase)} - ${clase.hora_inicio?.slice(0, 5)} a ${clase.hora_fin?.slice(0, 5)}`}
                      />
                      <Chip
                        size="small"
                        label={clase.estado}
                        color={
                          clase.estado === 'realizada'
                            ? 'success'
                            : clase.estado === 'suspendida'
                            ? 'error'
                            : 'warning'
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay clases programadas
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Asistencia (últimos 7 días)
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={data?.promedioAsistencia?.porcentaje || 0}
                  size={120}
                  thickness={4}
                  sx={{ color: '#2e7d32' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {data?.promedioAsistencia?.porcentaje || 0}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {data?.promedioAsistencia?.presentes || 0} presentes de {data?.promedioAsistencia?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Resumen General
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>Grupos Activos</TableCell>
                      <TableCell align="right">{stats.gruposActivos}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tutores Registrados</TableCell>
                      <TableCell align="right">{stats.tutoresRegistrados}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Empleados Activos</TableCell>
                      <TableCell align="right">{stats.empleadosActivos}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Membresías Vencidas</TableCell>
                      <TableCell align="right">{stats.membresiasVencidas}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Pagos Parciales</TableCell>
                      <TableCell align="right">{stats.pagosParciales}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Membresías por Tipo
              </Typography>
              {data?.membresiaPorTipo?.length > 0 ? (
                <List disablePadding>
                  {data.membresiaPorTipo.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={item.tipo_membrecia}
                        secondary={`${item.total} membresías`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No hay datos
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;