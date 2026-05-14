import React from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Container,
  useTheme,
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login, user, isAuthenticated } = useAuth();

  const [formData, setFormData] = React.useState({
    usuario: '',
    contrasenia: '',
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.ALUMNOS, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.usuario.trim() || !formData.contrasenia.trim()) {
      setError('Usuario y contraseña son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await login(formData.usuario, formData.contrasenia);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(
        error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Stack spacing={3} alignItems="center">
            <LockIcon
              sx={{
                fontSize: 48,
                color: theme.palette.primary.main,
              }}
            />
            <Typography variant="h4" component="h1" align="center">
              Iniciar Sesión
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Usuario"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />

                <TextField
                  label="Contraseña"
                  name="contrasenia"
                  type="password"
                  value={formData.contrasenia}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="current-password"
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;

