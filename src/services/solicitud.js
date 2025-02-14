import baseApi from "./baseApi";
import objErrorApi from "./objError";
const stepApi = "solicitud";

const postSolicitud = (data) => {
    return baseApi(stepApi)
      .post("/sendSolicitud", data)
      .catch(objErrorApi);
  };
  
export {postSolicitud};