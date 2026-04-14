import apiClient from './apiClient';

// Public functions
export const login = async (email, password) => {
  const { data } = await apiClient.post('/users/login', { email, password });
  if (data.token) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  return data;
};

export const register = async (userData) => {
  const { data } = await apiClient.post('/users', userData);
   if (data.token) {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }
  return data;
};

// Admin functions
export const getUsers = async () => {
  const { data } = await apiClient.get('/users');
  return data;
};

export const createBroker = async (brokerData) => {
  const { data } = await apiClient.post('/users/broker', brokerData);
  return data;
};

export const deleteUser = async (userId) => {
  const { data } = await apiClient.delete(`/users/${userId}`);
  return data;
};