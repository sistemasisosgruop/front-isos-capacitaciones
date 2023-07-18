import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = 'emo';

// const postTest = (data) => {
//   return baseApi(stepApi)
//     .post("/", data)
//     .catch(objErrorApi);
// };

// const patchTest = (id, data) => {
//   return baseApi(stepApi)
//     .patch(`/${id}`, data)
//     .catch(objErrorApi);
// };

const getTrabajadorEmo = () => {
  return baseApi(stepApi)
    .get("/")
    .catch(objErrorApi);
};

const getDescargaEmo = (id, ) => {
  return baseApi(stepApi)
    .get(`/descargar/${id}`)
    .catch(objErrorApi);
};

const getReporteEmo = () => {
  return baseApi(stepApi)
    .get("/reporte")
    .catch(objErrorApi);
};

const postImportarExcel = (data) => {
  return baseApi(stepApi)
    .post(`/excel`, data)
    .catch(objErrorApi);
};
const postEmo = (id, data) => {
  return baseApi(stepApi)
    .post(`/subir/${id}`, data)
    .catch(objErrorApi);
};
const updateTrabajadorEmo = (id, data) => {
  return baseApi(stepApi)
    .put(`/${id}`, data)
    .catch(objErrorApi);
};

// const getTest = ( id ) => {
//   return baseApi(stepApi)
//     .get(`${ id }`)
//     .catch(objErrorApi);
// };

// const deleteTest = (id) => {
//   return baseApi(stepApi)
//     .delete(`/${id}`)
//     .catch(objErrorApi);
// };

export { getTrabajadorEmo, postImportarExcel, updateTrabajadorEmo, postEmo, getReporteEmo, getDescargaEmo };
