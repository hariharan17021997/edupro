// Converts axios/network errors into a clean readable message
export const handleApiError = (error) => {
  if (error.response) {
    // Server returned error response
    return error.response.data?.message || `Server Error: ${error.response.status}`;
  } 
  
  if (error.request) {
    // Request made but no response received
    return "No response from server. Please check your connection.";
  }

  // Something else happened
  return error.message || "Unexpected error occurred.";
};
