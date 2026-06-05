import api from './api';

const ENDPOINT = '/reportes';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function buildParams(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
}

function descargarPDF(url, filename) {
  const token = localStorage.getItem('token');

  fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al descargar PDF');
      return res.blob();
    })
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch(err => {
      console.error('Error descargando PDF:', err);
      alert('Error al descargar el PDF: ' + err.message);
    });
}

export const getAsistenciaAlumnos = async (params = {}) => {
  const response = await api.get(ENDPOINT + '/asistencia-alumnos', { params });
  return response?.data || response;
};

export const descargarPDFAsistenciaAlumnos = (params = {}) => {
  const qs = buildParams(params);
  descargarPDF(`${API_BASE_URL}${ENDPOINT}/asistencia-alumnos/pdf?${qs}`, 'asistencia-alumnos.pdf');
};

export const getAsistenciaEmpleados = async (params = {}) => {
  const response = await api.get(ENDPOINT + '/asistencia-empleados', { params });
  return response?.data || response;
};

export const descargarPDFAsistenciaEmpleados = (params = {}) => {
  const qs = buildParams(params);
  descargarPDF(`${API_BASE_URL}${ENDPOINT}/asistencia-empleados/pdf?${qs}`, 'asistencia-empleados.pdf');
};

export const getMembresias = async (params = {}) => {
  const response = await api.get(ENDPOINT + '/membresias', { params });
  return response?.data || response;
};

export const descargarPDFMembresias = (params = {}) => {
  const qs = buildParams(params);
  descargarPDF(`${API_BASE_URL}${ENDPOINT}/membresias/pdf?${qs}`, 'membresias.pdf');
};

const reporteService = {
  getAsistenciaAlumnos,
  descargarPDFAsistenciaAlumnos,
  getAsistenciaEmpleados,
  descargarPDFAsistenciaEmpleados,
  getMembresias,
  descargarPDFMembresias,
};

export default reporteService;
