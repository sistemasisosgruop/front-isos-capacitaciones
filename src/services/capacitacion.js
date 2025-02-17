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

const getCapacitacionesSupervisor = (empresaId) => {
  return baseApi(stepApi)
    .get("/empresa", {
      params: {
        empresaId
      }
    })
    .catch(objErrorApi);
};

const getCapacitacionesTrabajador = (dni) => {
  return baseApi(stepApi)
    .get("/trabajador", {
      params: {
        dni
      }
    })
    .catch(objErrorApi);
};


const getCapacitacionesReport = () => {
  return baseApi(stepApi)
    .get("/report")
    .catch(objErrorApi);
};

const getCapacitacion = (id) => {
  return baseApi(stepApi)
    .get(`/${id}`)
    .catch(objErrorApi);
};

const getCapacitacionCodigo = (codigo) => {
  return baseApi(stepApi)
    .get(`/codigo/${codigo}`)
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

const patchEstadoRecuperacion = (id, recuperacion) => {
  return baseApi(stepApi)
    .patch(`/${id}`, { recuperacion })  // Asumiendo que 'recuperacion' es el nombre del campo para actualizar el estado.
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
  getCapacitacionesSupervisor,
  patchEstadoCapacitacion,
  deleteCapacitaciones,
  getFirmaCertificado,
  getCapacitacionesReport,
  patchEstadoRecuperacion,
  getCapacitacionCodigo,
  getCapacitacionesTrabajador
};
