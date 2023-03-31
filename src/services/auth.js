import axios from 'axios';

export const authAPi = axios.create({
  baseURL: 'https://expressjs-postgres-production-9d5a.up.railway.app/api/v1/auth',
})