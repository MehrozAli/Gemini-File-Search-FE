import apiClient from './client';

/**
 * Query a store
 * @param {string} storeName - Store name
 * @param {Object} data - Query data
 * @param {string} data.prompt - Search prompt
 * @param {string} [data.system_prompt] - Optional system prompt
 * @param {string} [data.model] - Optional model selection
 * @returns {Promise} Query results
 */
export const queryStore = async (storeName, data) => {
  const response = await apiClient.post(`/api/stores/${storeName}/query`, data);
  return response.data;
};
