import axios from 'axios';

// The key used to store user data in localStorage
const LS_KEY = 'pnwb-user';

// Create a new axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Should be in .env for production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get user data from localStorage
    const userString = localStorage.getItem(LS_KEY);
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        // Add the token to the Authorization header
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
