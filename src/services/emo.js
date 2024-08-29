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

const postSendEmail = (data ) => {
  return baseApi(stepApi)
    .post(`/send-email`, data)
    .catch(objErrorApi);
};

const postSendWhatsapp = (data ) => {
  return baseApi(stepApi)
    .post(`/send-whatsapp`, data)
    .catch(objErrorApi);
};

const getReporteEmo = (page,limit, empresa, search,all) => {
  let url = `${stepApi}/reporte?page=${page}&limit=${limit}`;

  if (empresa) {
    url += `&nombreEmpresa=${empresa}`;
  }
  if (search) {
    url += `&search=${search}`;
  }
  if (all) {
    url += `&all=${all}`;
  }
  return baseApi(url).get("").catch(objErrorApi);
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

export { getTrabajadorEmo, postSendEmail, postSendWhatsapp, postImportarExcel, updateTrabajadorEmo, postEmo, getReporteEmo, getDescargaEmo };
