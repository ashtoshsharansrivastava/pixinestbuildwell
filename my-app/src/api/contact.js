// frontend/src/api/contact.js
import apiClient from './apiClient';

export const sendContactMessage = (formData) => {
  return apiClient.post('/contact', formData);
};