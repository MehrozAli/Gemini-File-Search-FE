/**
 * Extract error message from API error response
 * Handles various error response formats from the backend
 */
export const getErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error) {
    return defaultMessage;
  }

  // If error is already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // Check for error.response.data (axios format)
  if (!error.response?.data) {
    return error.message || defaultMessage;
  }

  const data = error.response.data;
  
  // Handle string detail
  if (typeof data.detail === 'string') {
    return data.detail;
  }
  
  // Handle validation errors array (FastAPI format)
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const firstError = data.detail[0];
    if (typeof firstError === 'object' && firstError.msg) {
      return firstError.msg;
    }
    if (typeof firstError === 'string') {
      return firstError;
    }
    // Fallback for complex error objects
    return 'Validation error occurred';
  }
  
  // Handle object error details
  if (typeof data.detail === 'object' && data.detail !== null) {
    if (data.detail.msg) {
      return data.detail.msg;
    }
    if (data.detail.message) {
      return data.detail.message;
    }
    // Don't stringify objects as they can't be rendered
    return defaultMessage;
  }
  
  // Check for message field
  if (data.message) {
    return data.message;
  }
  
  return defaultMessage;
};

