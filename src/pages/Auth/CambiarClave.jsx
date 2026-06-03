import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { validarOtp, cambiarContrasenia, cambiarConAutenticacion } from '../../services/recuperacionService';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';

function CambiarClave() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loginDirect } = useAuth();

  const otp = searchParams.get('otp');
  const isOtpFlow = !!otp;

  const [validando, setValidando] = React.useState(isOtpFlow);
  const [errorOtp, setErrorOtp] = React.useState('');

  const [contraseniaActual, setContraseniaActual] = React.useState('');
  const [nuevaContrasenia, setNuevaContrasenia] = React.useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [exito, setExito] = React.useState(false);

  React.useEffect(() => {
    if (isOtpFlow) {
      validarOtp(otp)
        .then((res) => {
          const t = res?.token || res?.data?.token;
          if (t) {
            sessionStorage.setItem('password_reset_token', t);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setErrorOtp('Error al validar el código');
          }
        })
        .catch(() => {
          setErrorOtp('Este enlace ya no es válido o ha expirado');
        })
        .finally(() => setValidando(false));
    }
  }, [otp, isOtpFlow]);

  if (!isOtpFlow && !user) {
    navigate(ROUTES.LOGIN, { replace: true });
    return null;
  }

  if (validando) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-main border-t-transparent mx-auto" />
          <p className="mt-4 text-text-secondary">Validando enlace...</p>
        </div>
      </div>
    );
  }

  if (errorOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Enlace no válido</h1>
            <p className="text-text-secondary text-sm">{errorOtp}</p>
            <Link
              to={ROUTES.OLVIDE_CLAVE}
              className="text-primary-main hover:text-primary-dark text-sm font-medium"
            >
              Solicitar un nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (exito) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">Contraseña actualizada</h1>
            <p className="text-text-secondary text-sm">
              Tu contraseña se actualizó correctamente.
            </p>
            <Link
              to={ROUTES.ALUMNOS}
              className="text-primary-main hover:text-primary-dark text-sm font-medium"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nuevaContrasenia || nuevaContrasenia.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      if (isOtpFlow) {
        const res = await cambiarContrasenia(nuevaContrasenia);
        const data = res?.data || res;
        if (data?.token && data?.empleado) {
          loginDirect(data.token, data.empleado);
        }
      } else {
        await cambiarConAutenticacion(contraseniaActual, nuevaContrasenia);
      }
      setExito(true);
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
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

          <h1 className="text-2xl font-bold text-text-primary">Cambiar contraseña</h1>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {!isOtpFlow && (
                <Input
                  label="Contraseña actual"
                  name="contrasenia_actual"
                  type="password"
                  value={contraseniaActual}
                  onChange={(e) => setContraseniaActual(e.target.value)}
                  required
                  disabled={loading}
                />
              )}

              <Input
                label="Nueva contraseña"
                name="nueva_contrasenia"
                type="password"
                value={nuevaContrasenia}
                onChange={(e) => setNuevaContrasenia(e.target.value)}
                required
                disabled={loading}
                placeholder="Mínimo 6 caracteres"
              />

              <Input
                label="Confirmar nueva contraseña"
                name="confirmar_contrasenia"
                type="password"
                value={confirmarContrasenia}
                onChange={(e) => setConfirmarContrasenia(e.target.value)}
                required
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
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </Button>
            </div>
          </form>

          {isOtpFlow && (
            <Link
              to={ROUTES.LOGIN}
              className="text-primary-main hover:text-primary-dark text-sm font-medium"
            >
              Volver al inicio de sesión
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default CambiarClave;
