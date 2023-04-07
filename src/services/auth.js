import axios from 'axios';
import getEnvVaribles from '../config/getEnvVariables';

const baseApiAuth = () => {

  const { VITE_API_URL } = getEnvVaribles();

   const authAPi = axios.create({
    baseURL: `${ VITE_API_URL }/auth`,
  })
  return authAPi;

}
export default baseApiAuth