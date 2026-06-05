import api from './api';

const ENDPOINT = '/grupo-empleados';

export const getAll = async () => {
  const response = await api.get(ENDPOINT);
  return response?.data || response;
};

export const getById = async (id) => {
  return await api.get(`${ENDPOINT}/${id}`);
};

export const getByGrupo = async (idGrupo) => {
  const response = await api.get(`${ENDPOINT}/grupo/${idGrupo}`);
  return response?.data || response;
};

export const getByEmpleado = async (idEmpleado) => {
  const response = await api.get(`${ENDPOINT}/empleado/${idEmpleado}`);
  return response?.data || response;
};

export const create = async (data) => {
  return await api.post(ENDPOINT, data);
};

export const asignarEmpleados = async (idGrupo, empleados) => {
  return await api.post(`${ENDPOINT}/grupo/${idGrupo}`, { empleados });
};

export const update = async (id, data) => {
  return await api.put(`${ENDPOINT}/${id}`, data);
};

export const deleteById = async (id) => {
  return await api.delete(`${ENDPOINT}/${id}`);
};

const grupoEmpleadoService = {
  getAll,
  getById,
  getByGrupo,
  getByEmpleado,
  create,
  asignarEmpleados,
  update,
  deleteById,
};

export default grupoEmpleadoService;
