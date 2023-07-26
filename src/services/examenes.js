import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = "examenes";

const getExamen = (id) => {
  return baseApi(stepApi).get(`/${id}`).catch(objErrorApi);
};
const getExamenCapacitacion = (id) => {
  return baseApi(stepApi).get(`data/${id}`).catch(objErrorApi);
};

export { getExamen, getExamenCapacitacion };
