import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { solicitarRecuperacion } from '../../services/recuperacionService';
import { ROUTES } from '../../utils/constants';

function RecuperarClave() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El email es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await solicitarRecuperacion(email);
      setEnviado(true);
    } catch {
      setEnviado(true);
    } finally {
      setLoading(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Lock className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Revisá tu correo</h1>
            <p className="text-text-secondary text-sm leading-relaxed">
              Te enviamos un correo con las instrucciones para restablecer tu contraseña.
              Si no recibís el mensaje, verificá que el email ingresado sea correcto.
            </p>
            <Link
              to={ROUTES.LOGIN}
              className="text-primary-main hover:text-primary-dark text-sm font-medium"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="p-3 bg-primary-main/10 rounded-full">
            <Lock className="w-12 h-12 text-primary-main" />
          </div>

          <h1 className="text-2xl font-bold text-text-primary">Recuperar contraseña</h1>
          <p className="text-text-secondary text-sm text-center">
            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
                placeholder="tucorreo@ejemplo.com"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>

          <Link
            to={ROUTES.LOGIN}
            className="text-primary-main hover:text-primary-dark text-sm font-medium"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecuperarClave;
