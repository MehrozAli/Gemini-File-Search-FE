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
  // Create a custom axios instance without timeout for store creation
  const axios = require('axios');
  const createClient = axios.create({
    baseURL: apiClient.defaults.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 0, // No timeout for store creation operations
  });
  
  const response = await createClient.post('/api/stores', data);
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
 * Sync a specific store
 * @param {string} storeName - Store name (using store.name field)
 * @param {string} displayName - Display name for the store
 * @param {string} documentName - Document name (optional)
 * @returns {Promise} Sync result
 */
export const syncStore = async (storeName, displayName = '', documentName = '') => {
  // Create a custom axios instance without timeout for sync operations
  const axios = require('axios');
  const syncClient = axios.create({
    baseURL: apiClient.defaults.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 0, // No timeout for sync operations
  });
  
  // Send required body fields
  const response = await syncClient.post(`/api/stores/${storeName}/sync`, {
    document_name: documentName,
    display_name: displayName,
  });
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
