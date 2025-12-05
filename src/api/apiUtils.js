import axios from "axios";
import { handleApiError } from "./errorHandler";

export const apiGet = async (url, params) => {
  try {
    const config = {};

    // Only attach params if they exist
    if (params && Object.keys(params).length > 0) {
      config.params = params;
    }

    const response = await axios.get(url, config);

    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: handleApiError(error) };
  }
};


// Response 1
// {
//   data: [...],
//   error: null
// }

// Response 2
// {
//   data: null,
//   error: "No response from server"
// }

// Reposne 3
// {
//   data: null,
//   error: "No response from server"
// }
