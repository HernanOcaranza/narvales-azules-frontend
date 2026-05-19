import React from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { Button, Input, Spinner } from '../../components/ui';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="p-3 bg-primary-main/10 rounded-full">
            <Lock className="w-12 h-12 text-primary-main" />
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary">
            Iniciar Sesión
          </h1>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button 
                    type="button" 
                    onClick={() => setError('')}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              <Input
                label="Usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
                autoComplete="username"
                autoFocus
                disabled={loading}
              />

              <Input
                label="Contraseña"
                name="contrasenia"
                type="password"
                value={formData.contrasenia}
                onChange={handleChange}
                required
                autoComplete="current-password"
                disabled={loading}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;