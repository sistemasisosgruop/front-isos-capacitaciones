import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = "trabajadores";

const postTrabajador = (data) => {
  return baseApi(stepApi)
    .post("/", data)
    .catch(objErrorApi);
};
const postImportar = (id, data) => {
  return baseApi(stepApi)
    .post(`/cargaexcel/${id}`, data)
    .catch(objErrorApi);
};


const patchTrabajador = (data) => {
  const { id, habilitado, reporte, nombreEmpresa, ...dataFormat } = data;
  return baseApi(stepApi)
    .patch(`/${id}`, dataFormat)
    .catch(objErrorApi);
};

const patchEstado = (data) => {
  const { id, habilitado: estado } = data;
  return baseApi(stepApi)
    .patch(`/${id}`, { habilitado: !estado })
    .catch(objErrorApi);
};

const getTrabajadores = () => {
  return baseApi(stepApi)
    .get("/")
    .catch(objErrorApi);
};

const getTrabajador = (id) => {
  return baseApi(stepApi)
    .get(`/${id}`)
    .catch(objErrorApi);
};

const deleteTrabajador = (id) => {
  return baseApi(stepApi)
    .delete(`/${id}`)
    .catch(objErrorApi);
};

export {
  getTrabajadores,
  postTrabajador,
  postImportar,
  patchTrabajador,
  deleteTrabajador,
  patchEstado,
  getTrabajador,
};
