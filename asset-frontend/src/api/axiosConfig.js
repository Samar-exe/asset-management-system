import axios from "axios";

// 1. Create a customized Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api", // Your Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add an "Interceptor" (The Middleman)
// Before any request is sent, this code runs.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // If we have a token, attach it!
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
