import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // free API
});

export default axiosClient;