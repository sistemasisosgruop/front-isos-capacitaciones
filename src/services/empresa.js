import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = 'empresas' 

const postEmpresas = (data) => {
  return baseApi(stepApi)
    .post("/", data)
    .catch(objErrorApi);
};

const patchEmpresas = ( data, id ) => {
  return baseApi(stepApi)
    .patch(`/${ id }`, data)
    .catch(objErrorApi);
};

const getEmpresas = () => {
  return baseApi(stepApi)
    .get("/")
    .catch(objErrorApi);
};

const getEmpresa = ( id ) => {
  return baseApi(stepApi)
    .get(`/${ id }`)
    .catch(objErrorApi);
};
const getEmpresaCapacitador = ( id ) => {
  return baseApi(stepApi)
    .get(`/capacitador/${ id }`)
    .catch(objErrorApi);
};

const getImgs = ( id, typeImg ) => {
  return baseApi(stepApi)
    .get(`/${id}/${typeImg}`,{
      responseType: 'blob'
    })
    .catch(objErrorApi);
};

const deleteEmpresa = (id) => {
  return baseApi(stepApi)
    .delete(`/${id}`)
    .catch(objErrorApi);
};

export { 
  getEmpresas,
  getEmpresa,
  getEmpresaCapacitador,
  deleteEmpresa,
  postEmpresas, 
  patchEmpresas, 
  getImgs 
};
