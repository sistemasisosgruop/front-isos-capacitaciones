import axios from "axios";
import getEnvVaribles from "../config/getEnvVariables";

const baseApiTest = () => {
  const { VITE_API_URL } = getEnvVaribles();

  const TrabajadoresAPi = axios.create({
    baseURL: `${VITE_API_URL}/test`,
  });
  return TrabajadoresAPi;
};

const postTest = (data) => {
  return baseApiTest()
    .post("/", data)
    .catch((error) => {
      console.log("error", error);
      if (error.response)
        return {
          status: error.response.status,
          data: null,
          msg: error.response.data.message,
        };
    });
};
const postImportar = (id, data) => {
  return baseApiTest()
    .post(`/cargaexcel/${id}`, data)
    .catch((error) => {
      if (error.response)
        return {
          status: error.response.status,
          data: null,
          msg: error.response.msg,
        };
    });
};

const patchTest = (id, data) => {
  return baseApiTest()
    .patch(`/${id}`, data)
    .catch((error) => {
      if (error.response)
        return {
          status: error.response.status,
          data: null,
          msg: error.response.msg,
        };
    });
};

const patchEstado = (data) => {
  const { id, habilitado: estado } = data;
  return baseApiTest()
    .patch(`/${id}`, { habilitado: !estado })
    .catch((error) => {
      if (error.response)
        return {
          status: error.response.status,
          data: null,
          msg: error.response.msg,
        };
    });
};

const getTest = () => {
  return baseApiTest()
    .get("/")
    .catch((error) => {
      if (error.response)
        return {
          status: error.response.status,
          data: null,
          msg: error.response.msg,
        };
    });
};

const deleteTest = (id) => {
  return baseApiTest()
    .delete(`/${id}`)
    .catch((error) => {
      if (error.response)
        return {
          status: error.response.status,
          data: null,
          msg: error.response.msg,
        };
    });
};

export { getTest, postTest, patchTest, deleteTest };
