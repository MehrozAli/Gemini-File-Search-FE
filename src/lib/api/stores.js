import apiClient from './client';

/**
 * Get all stores
 * @returns {Promise} List of stores
 */
export const getStores = async () => {
  const response = await apiClient.get('/api/stores');
  // API returns { stores: [...] }, extract the array
  return response.data.stores || [];
};

/**
 * Create a new store
 * @param {Object} data - Store data
 * @param {string} data.display_name - Display name for the store
 * @returns {Promise} Created store
 */
export const createStore = async (data) => {
  const response = await apiClient.post('/api/stores', data);
  return response.data;
};

/**
 * Delete all stores
 * @returns {Promise} Deletion result
 */
export const deleteAllStores = async () => {
  const response = await apiClient.delete('/api/stores');
  return response.data;
};

/**
 * Delete a specific store (if endpoint exists)
 * @param {string} storeName - Store name
 * @returns {Promise} Deletion result
 */
export const deleteStore = async (storeName) => {
  const response = await apiClient.delete(`/api/stores/${storeName}`);
  return response.data;
};

/**
 * Check API health
 * @returns {Promise} Health status
 */
export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
