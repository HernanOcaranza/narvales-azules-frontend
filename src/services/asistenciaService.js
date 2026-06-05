import api from './api';

const ENDPOINT = '/clases';

export const getAsistenciaAlumnos = async (idClase) => {
  const response = await api.get(`${ENDPOINT}/${idClase}/asistencia-alumnos`);
  return response?.data || response;
};

export const registrarAsistenciaAlumnos = async (idClase, alumnos) => {
  return await api.post(`${ENDPOINT}/${idClase}/asistencia-alumnos`, alumnos);
};

const asistenciaService = {
  getAsistenciaAlumnos,
  registrarAsistenciaAlumnos,
};

export default asistenciaService;
