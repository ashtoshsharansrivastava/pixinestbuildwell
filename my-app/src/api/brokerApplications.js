// frontend/src/api/brokerApplications.js
import apiClient from './apiClient';

export const submitBrokerApplication = (formData) => {
  return apiClient.post('/broker-applications', formData);
};

export const getPendingApplications = () => {
  return apiClient.get('/broker-applications');
};

export const approveApplication = (id) => {
  return apiClient.post(`/broker-applications/${id}/approve`);
};

export const rejectApplication = (id) => {
  return apiClient.delete(`/broker-applications/${id}`);
};