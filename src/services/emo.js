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

const getTrabajadorEmo = (page, limit) => {
  let url = `${stepApi}?page=${page}&limit=${limit}`;
  return baseApi(url)
    .get()
    .catch(objErrorApi);
};

const getEmoTrabajador = (dni) => {
  return baseApi(stepApi)
    .get(`/emo/${dni}`)
    .catch(objErrorApi);
};

const getEnvioWhatsapp = (id) => {
  // var tId = data.trabajador_id ? data.trabajador_id : 1;
  return baseApi(stepApi)
    .get(`/registro-whatsapp/${id}`)
    .catch(objErrorApi);
};

const getDescargaEmo = (id, ) => {
  return baseApi(stepApi)
    .get(`/descargar/${id}`)
    .catch(objErrorApi);
};

const getDescargaConstancia = (id, ) => {
  return baseApi(stepApi)
    .get(`/descargar/constancia/${id}`)
    .catch(objErrorApi);
};

const postSendEmail = (data ) => {
  return baseApi(stepApi)
    .post(`/send-email`, data)
    .catch(objErrorApi);
};
const postSendEmoEmail = (data ) => {
  return baseApi(stepApi)
    .post(`/send-emo-email`, data)
    .catch(objErrorApi);
};

const postCrearConstancia = (data ) => {
  return baseApi(stepApi)
    .post(`/constancia`, data)
    .catch(objErrorApi);
};

const postSendWhatsapp = (data ) => {
  return baseApi(stepApi)
    .post(`/send-whatsapp`, data)
    .catch(objErrorApi);
};

const postSendEmoWhatsapp = (data ) => {
  return baseApi(stepApi)
    .post(`/send-emo-whatsapp`, data)
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

export { getTrabajadorEmo, postSendEmoWhatsapp, getEnvioWhatsapp, postSendEmail, postSendEmoEmail, postSendWhatsapp, postImportarExcel, updateTrabajadorEmo, postEmo, getReporteEmo, getDescargaEmo, getDescargaConstancia, postCrearConstancia,getEmoTrabajador};
