import axios from 'axios';

// Create one central Axios instance
const apiClient = axios.create({
  // The key MUST be "baseURL" (lowercase 'b')
  baseURL: import.meta.env.VITE_BASE_URL,
  // ❌ The problematic 'Content-Type' header has been removed.
  // Everything else is exactly as you had it.
});

// This interceptor will attach the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {
        console.error("Failed to parse userInfo from localStorage.", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
