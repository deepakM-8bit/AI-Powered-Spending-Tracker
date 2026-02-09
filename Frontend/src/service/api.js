import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; //backend URL

if (!BASE_URL) {
  throw new Error("VITE_API_URL missing. Add it in Vercel env variables.");
}

const api = axios.create({
  baseURL: BASE_URL.replace(/\/$/, ""), // remove trailing slash
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); //  matches your AuthContext

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
