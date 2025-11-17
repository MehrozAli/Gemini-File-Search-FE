import apiClient from './client';

/**
 * Upload a file to a store
 * @param {string} storeName - Store name
 * @param {File} file - File to upload
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload result
 */
export const uploadFile = async (storeName, file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(
    `/api/stores/${storeName}/files`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 0,
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    }
  );

  return response.data;
};
