import axios from "axios";

// 👉 importante: usa 'export const API = ...' (no 'default')
export const API = axios.create({
  baseURL: "https://paella-manager.onrender.com",
});
