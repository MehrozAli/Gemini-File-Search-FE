// API Configuration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  timeout: 30000,
};

export const QUERY_KEYS = {
  stores: ['stores'],
  store: (id) => ['store', id],
  files: (storeId) => ['files', storeId],
  health: ['health'],
};
