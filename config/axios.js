import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const backendUrl = process.env.BACKEND_URL;
console.log(backendUrl);

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      console.log("Error🚀 401: ");
    } else {
      console.log("Error🚀: ", error);
    }
    return Promise.reject(error);
  }
);

export default api;
