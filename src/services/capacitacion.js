import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = 'capacitaciones';

const postCapacitaciones = (data) => {
  return baseApi(stepApi)
    .post("/", data)
    .catch();
};

const patchCapacitaciones = (id, data) => {
  return baseApi(stepApi)
    .patch(`/${id}`, data)
    .catch(objErrorApi);
};

const patchEstadoCapacitacion = (data) => {
  const { id, habilitado: estado } = data;
  return baseApi(stepApi)
    .patch(`/${id}`, { habilitado: !estado })
    .catch(objErrorApi);
};

const getCapacitaciones = () => {
  return baseApi(stepApi)
    .get("/")
    .catch(objErrorApi);
};

const getCapacitacion = (id) => {
  return baseApi(stepApi)
    .get(`/${id}`)
    .catch(objErrorApi);
};

const getCapacitacionUser = (id) => {
  return baseApi(stepApi)
    .get(`/capacitador/${id}`)
    .catch(objErrorApi);
};

const getPreguntas = (id) => {
  return baseApi(stepApi)
    .get(`/${id}`)
    .catch(objErrorApi);
};

const getFirmaCertificado = (id) => {
  return baseApi(stepApi)
    .get(`/${id}/certificado`, {
      responseType: "blob",
    })
    .catch(objErrorApi);
};

const deleteCapacitaciones = (id) => {
  return baseApi(stepApi)
    .delete(`/${id}`)
    .catch(objErrorApi);
};

export {
  getCapacitaciones,
  getCapacitacion,
  getCapacitacionUser,
  postCapacitaciones,
  getPreguntas,
  patchCapacitaciones,
  patchEstadoCapacitacion,
  deleteCapacitaciones,
  getFirmaCertificado,
};
