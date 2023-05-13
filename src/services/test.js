import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = 'test';

const postTest = (data) => {
  return baseApi(stepApi)
    .post("/", data)
    .catch(objErrorApi);
};

const patchTest = (id, data) => {
  return baseApi(stepApi)
    .patch(`/${id}`, data)
    .catch(objErrorApi);
};

const getTests = () => {
  return baseApi(stepApi)
    .get("/")
    .catch(objErrorApi);
};

const getTest = ( id ) => {
  return baseApi(stepApi)
    .get(`${ id }`)
    .catch(objErrorApi);
};

const deleteTest = (id) => {
  return baseApi(stepApi)
    .delete(`/${id}`)
    .catch(objErrorApi);
};

export { getTest, getTests, postTest, patchTest, deleteTest };
