// frontend/src/api/enquiries.js

import apiClient from './apiClient';
import api from './apiClient'; // Assuming your configured axios instance is here

// Create a new enquiry for a property
export const createEnquiry = async (propertyId) => {
  const { data } = await apiClient.post('/enquiries', { propertyId });
  return data;
};

// Get all enquiries (for admin dashboard)
export const getEnquiries = async () => {
  const { data } = await api.get('/enquiries');
  return data;
};