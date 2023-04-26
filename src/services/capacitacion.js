import axios from "axios";
import getEnvVaribles from "../config/getEnvVariables";

const baseApiCapacitaciones = () => {
  const { VITE_API_URL } = getEnvVaribles();

  const TrabajadoresAPi = axios.create({
    baseURL: `${VITE_API_URL}/capacitaciones`,
  });
  return TrabajadoresAPi;
};

const postCapacitaciones = (data) => {
  return baseApiCapacitaciones()
    .post("/", data)
    .catch((error) => {
      console.log('error', error)
      if (error.response) return { status: error.response.status, data: null,msg:error.response.data.message };
    });
};
const postImportar = (id, data) => {
  return baseApiTrabajador()
    .post(`/cargaexcel/${id}`, data)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null, msg:error.response.msg };
    });
};

const patchTrabajador = (data) => {
  const { id, ...dataFormat } = data;
  return baseApiTrabajador()
    .patch(`/${id}`, dataFormat)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null, msg:error.response.msg };
    });
};

const getCapacitaciones = () => {
  return baseApiCapacitaciones()
    .get("/")
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const getPreguntas = ( id ) => {
  return baseApiCapacitaciones()
    .get(`/${ id }`)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const deleteTrabajador = (id) => {
  return baseApiTrabajador()
    .delete(`/${id}`)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null, msg:error.response.msg };
    });
};

export {
  getCapacitaciones,
  postCapacitaciones,
  getPreguntas
};
