import apiClient from './client';

export const getStores = async () => {
  const response = await apiClient.get('/api/stores');
  return response.data.stores || [];
};

// Store creation and sync wait on Gemini, so they opt out of the
// client-wide timeout.
export const createStore = async (data) => {
  const response = await apiClient.post('/api/stores', data, { timeout: 0 });
  return response.data;
};

export const deleteAllStores = async () => {
  const response = await apiClient.delete('/api/stores');
  return response.data;
};

export const deleteStore = async (storeName) => {
  const response = await apiClient.delete(`/api/stores/${storeName}`);
  return response.data;
};

export const syncStore = async (storeName, displayName = '', documentName = '') => {
  const response = await apiClient.post(
    `/api/stores/${storeName}/sync`,
    { document_name: documentName, display_name: displayName },
    { timeout: 0 }
  );
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};
