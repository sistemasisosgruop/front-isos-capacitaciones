import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = "reporte";

const getReporte = (page, limit, empresa, capacitacion, mes,codigo,anio,all) => {
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
  if (codigo) {
    url += `&codigo=${codigo}`;
  }
  if (anio) {
    url += `&anio=${anio}`;
  }
  if (all) {
    url += `&all=${all}`;
  }

  return baseApi(url).get().catch(objErrorApi);
};

const getConstancias = (page, limit, empresa, mes,codigo,anio,all) => {
  let url = `${stepApi}/constancias?page=${page}&limit=${limit}`;

  if (empresa) {
    url += `&nombreEmpresa=${empresa}`;
  }
  if (mes) {
    url += `&mes=${mes}`;
  }
  if (codigo) {
    url += `&codigo=${codigo}`;
  }
  if (anio) {
    url += `&anio=${anio}`;
  }
  if (all) {
    url += `&all=${all}`;
  }

  return baseApi(url).get().catch(objErrorApi);
};

const getReporte2 = (page, limit, empresa, capacitacion, mes,codigo,anio,all) => {
  let url = `${stepApi}/reporte2?page=${page}&limit=${limit}`;

  if (empresa) {
    url += `&nombreEmpresa=${empresa}`;
  }

  if (capacitacion) {
    url += `&capacitacion=${capacitacion}`;
  }
  if (mes) {
    url += `&mes=${mes}`;
  }
  if (codigo) {
    url += `&codigo=${codigo}`;
  }
  if (anio) {
    url += `&anio=${anio}`;
  }
  if (all) {
    url += `&all=${all}`;
  }

  return baseApi(url).get().catch(objErrorApi);
};

const getCertificados = (page, limit, capacitacion, mes,anio, dni) => {
  let url = `${stepApi}/capacitaciones/${dni}?page=${page}&limit=${limit}`;
  if (capacitacion) {
    url += `&capacitacion=${capacitacion}`;
  }
  if (mes) {
    url += `&mes=${mes}`;
  }
  if (anio) {
    url += `&anio=${anio}`;
  }
  return baseApi(url).get().catch(objErrorApi);
};

const getReporteRecuperacion = (page, limit, empresa, capacitacion, mes,codigo,anio,all) => {
  console.log(page,limit,empresa,capacitacion,mes, all);
  let url = `${stepApi}/recuperacion?page=${page}&limit=${limit}`;

  if (empresa) {
    url += `&nombreEmpresa=${empresa}`;
  }

  if (capacitacion) {
    url += `&capacitacion=${capacitacion}`;
  }
  if (mes) {
    url += `&mes=${mes}`;
  }
  if (codigo) {
    url += `&codigo=${codigo}`;
  }
  if (anio) {
    url += `&anio=${anio}`;
  }
  if (all) {
    url += `&all=${all}`;
  }

  console.log(url)


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

export { getReporte,getReporte2, patchDarExamen, getReportCreate, getReportStatus, getReporteRecuperacion, getCertificados,getConstancias};
