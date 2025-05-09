// A tiny axios wrapper so every call automatically uses the same base URL.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: false,                                               
});

export default api;