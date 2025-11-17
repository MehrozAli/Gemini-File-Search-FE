const SIZE_UNITS = ['Bytes', 'KB', 'MB', 'GB'];

export function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), SIZE_UNITS.length - 1);
  const value = Math.round((bytes / 1024 ** exponent) * 100) / 100;
  return `${value} ${SIZE_UNITS[exponent]}`;
}

export function formatDate(value, options) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString('en-US', options);
}
