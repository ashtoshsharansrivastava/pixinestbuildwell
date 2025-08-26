import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // adjust if needed
  withCredentials: true,               // for cookies/session auth
});

export default api;
