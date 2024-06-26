import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = "reporte";

const getReporte = (page, limit, empresa, capacitacion, mes,all) => {
  console.log(page,limit,empresa,capacitacion,mes, all);
  let url = `${stepApi}?page=${page}&limit=${limit}`;

  if (empresa) {
    url += `&nombreEmpresa=${empresa}`;
  }

  if (capacitacion) {
    url += `&capacitacion=${capacitacion}`;
  }
  if (mes) {
    url += `&mes=${mes}`;
  }
  if (all) {
    url += `&all=${all}`;
  }

  return baseApi(url).get().catch(objErrorApi);
};

const getReportCreate = (id) => {
  return baseApi(stepApi)
    .get(`/generar`)
    .catch(objErrorApi);
};

const getReportStatus = (id) => {
  return baseApi(stepApi)
    .get(`/progreso`)
    .catch(objErrorApi);
};

const patchDarExamen = (idCapacitacion, idTrabajador, idExamen, preguntas) => {
  return baseApi(stepApi)
    .patch(
      `/darexamen/${idCapacitacion}/${idTrabajador}/${idExamen}`,
      preguntas
    )
    .catch(objErrorApi);
};

export { getReporte, patchDarExamen, getReportCreate, getReportStatus };
