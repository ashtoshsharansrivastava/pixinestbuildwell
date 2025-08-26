import axios from 'axios';

// Create a central Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// IMPORTANT: This interceptor will attach the token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // We will retrieve the token from localStorage here
    const userInfo = localStorage.getItem('userInfo');

    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          console.log("Axios Interceptor: Attaching token to request.");
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage.", e);
        localStorage.removeItem('userInfo');
      }
    } else {
      console.log("Axios Interceptor: No userInfo found, not attaching token.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;