import axios from "axios";
import getEnvVaribles from "../config/getEnvVariables";

const baseApi = ( stepApi ) => {
  const { VITE_API_URL } = getEnvVaribles();

  const baseApi = axios.create({
    baseURL: `${VITE_API_URL}/${ stepApi }`,
  });

  baseApi.interceptors.request.use((config) => {
    const { token } = JSON.parse(localStorage.getItem("userIsos") || '{}');
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });
  return baseApi;
};

export default baseApi;
