import apiClient from './client';

export function toPercent(loaded, total) {
  if (!total) return 0;
  return Math.min(100, Math.round((loaded * 100) / total));
}

export const uploadFile = async (storeName, file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  // Gemini indexes the file before the backend replies, which can take
  // longer than the default timeout for large documents.
  const response = await apiClient.post(`/api/stores/${storeName}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: ({ loaded, total }) => {
      onUploadProgress?.(toPercent(loaded, total));
    },
  });

  return response.data;
};
