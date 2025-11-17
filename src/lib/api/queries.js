import apiClient from './client';

/**
 * @param {string} storeName
 * @param {{ prompt: string, system_prompt?: string, model?: string,
 *           conversation_history?: { role: 'user' | 'model', content: string }[] }} data
 * @returns {Promise<{ text: string, sources?: { title?: string, uri?: string }[] }>}
 */
export const queryStore = async (storeName, data) => {
  const response = await apiClient.post(`/api/stores/${storeName}/query`, data);
  return response.data;
};
