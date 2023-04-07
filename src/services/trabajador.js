import axios from "axios";
import getEnvVaribles from "../config/getEnvVariables";

const baseApiTrabajador = () => {
  const { VITE_API_URL } = getEnvVaribles();

  const TrabajadoresAPi = axios.create({
    baseURL: `${VITE_API_URL}/trabajadores`,
  });
  return TrabajadoresAPi;
};

const postTrabajador = (data) => {
  return baseApiTrabajador()
    .post("/", data)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const patchEmpresas = ( data ) => {
  const { id, ...dataFormat } = data;
  return baseApiTrabajador()
    .patch(`/${ id }`, dataFormat)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const getTrabajadores = () => {
  return baseApiTrabajador()
    .get("/")
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const deleteEmpresa = (id) => {
  return baseApiTrabajador()
    .delete(`/${id}`)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

export { getTrabajadores, postTrabajador };
