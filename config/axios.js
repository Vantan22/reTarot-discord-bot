import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const backendUrl = process.env.BACKEND_URL;

const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  timeout: 10000,
});

// api.interceptors.request.use(async (req) => {
//   const token = req.cookies["refreshToken"];
//   if (token) {
//     req.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return req;
// });

export default api;
