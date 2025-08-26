import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pixienestbuildwell.onrender.com', // adjust if needed
  withCredentials: true,               // for cookies/session auth
});

export default api;
