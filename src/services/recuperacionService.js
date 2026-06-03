import api from './api';

const ENDPOINT = '/auth';

export const solicitarRecuperacion = async (email) => {
  const response = await api.post(`${ENDPOINT}/recuperar`, { email });
  return response?.data || response;
};

export const validarOtp = async (otp) => {
  const response = await api.post(`${ENDPOINT}/recuperar/validar`, { otp });
  return response?.data || response;
};

export const cambiarContrasenia = async (nuevaContrasenia) => {
  const token = sessionStorage.getItem('password_reset_token');
  const response = await api.post(
    `${ENDPOINT}/recuperar/cambiar`,
    { nueva_contrasenia: nuevaContrasenia },
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  sessionStorage.removeItem('password_reset_token');
  return response?.data || response;
};

export const cambiarConAutenticacion = async (contraseniaActual, nuevaContrasenia) => {
  const response = await api.post(`${ENDPOINT}/cambiar-contrasenia`, {
    contrasenia_actual: contraseniaActual,
    nueva_contrasenia: nuevaContrasenia,
  });
  return response?.data || response;
};

const recuperacionService = {
  solicitarRecuperacion,
  validarOtp,
  cambiarContrasenia,
  cambiarConAutenticacion,
};

export default recuperacionService;
