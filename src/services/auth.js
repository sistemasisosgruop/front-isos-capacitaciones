import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = 'auth'

const postAuth = (data) => {
  return baseApi(stepApi)
    .post("/login", data)
    .catch(objErrorApi);
};

const validToken = () => {
  return baseApi(stepApi)
    .get("/verify-token")
    .catch(objErrorApi);
};


export {
  postAuth,
  validToken
}