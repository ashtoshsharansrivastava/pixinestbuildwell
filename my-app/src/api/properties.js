import apiClient from './apiClient.js'; // Import the new central client

// Get all properties
export const getProperties = async () => {
  const { data } = await apiClient.get('/properties');
  return data;
};

// Get a single property by its ID
export const getPropertyById = async (id) => {
  const { data } = await apiClient.get(`/properties/${id}`);
  return data;
};

// Create a new property (Admin only)
export const createProperty = async (formData) => {
  const { data } = await apiClient.post('/properties', formData);
  return data;
};

// Delete a property by its ID (Admin only)
export const deleteProperty = async (id) => {
  const { data } = await apiClient.delete(`/properties/${id}`);
  return data;
};

// Update a property (Admin only)
export const updateProperty = async (id, propertyData) => {
  const { data } = await apiClient.put(`/properties/${id}`, propertyData);
  return data;
};

// --- REVIEWS ---

/**
 * Get all reviews for a specific property.
 * @param {string} propertyId The ID of the property.
 * @returns {Promise<Array>} A promise that resolves to an array of reviews.
 */
export const getReviewsForProperty = async (propertyId) => {
  const { data } = await apiClient.get(`/properties/${propertyId}/reviews`);
  return data;
};

/**
 * Add a new review for a property (user or broker).
 * @param {string} propertyId The ID of the property.
 * @param {object} reviewData The review data (e.g., { rating, comment }).
 * @returns {Promise<object>} A promise that resolves to the created review.
 */
export const addReviewForProperty = async (propertyId, reviewData) => {
  const { data } = await apiClient.post(`/properties/${propertyId}/reviews`, reviewData);
  return data;
};
