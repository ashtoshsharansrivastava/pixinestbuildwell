import axios from 'axios';

const api = axios.create({
  BASE_URL: import.meta.env.VITE_BASE_URL,  // adjust if needed
  withCredentials: true,               // for cookies/session auth
});

export default api;
