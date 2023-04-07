import axios from "axios";
import getEnvVaribles from "../config/getEnvVariables";

const baseApiEmpresas = () => {
  const { VITE_API_URL } = getEnvVaribles();

  const empresasAPi = axios.create({
    baseURL: `${VITE_API_URL}/empresas`,
  });
  return empresasAPi;
};

const postEmpresas = (data) => {
  return baseApiEmpresas()
    .post("/", data)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const patchEmpresas = ( data ) => {
  const { id, ...dataFormat } = data;
  return baseApiEmpresas()
    .patch(`/${ id }`, dataFormat)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const getEmpresas = () => {
  return baseApiEmpresas()
    .get("/")
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

const deleteEmpresa = (id) => {
  return baseApiEmpresas()
    .delete(`/${id}`)
    .catch((error) => {
      if (error.response) return { status: error.response.status, data: null };
    });
};

export { getEmpresas, deleteEmpresa, postEmpresas, patchEmpresas };
