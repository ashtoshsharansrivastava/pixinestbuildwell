// frontend/src/api/brokers.js
import apiClient from './apiClient.js';

export const getBrokerDashboardData = async (brokerId) => {
  // ✅ ADD THIS LINE to check the URL
  console.log('API Call: Getting broker dashboard data from URL:', `/brokers/${brokerId}/dashboard`);

  const { data } = await apiClient.get(`/brokers/${brokerId}/dashboard`);
  return data;
};