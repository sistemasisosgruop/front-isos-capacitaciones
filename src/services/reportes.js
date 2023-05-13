import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = "reporte";

const getReporte = () => {
  return baseApi(stepApi).get("/").catch(objErrorApi);
};

const patchDarExamen = (idCapacitacion, idTrabajador, idExamen, preguntas) => {
  return baseApi(stepApi)
    .patch(
      `/darexamen/${idCapacitacion}/${idTrabajador}/${idExamen}`,
      preguntas
    )
    .catch(objErrorApi);
};

export { getReporte, patchDarExamen };
