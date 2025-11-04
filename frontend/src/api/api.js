import axios from "axios";

// 👉 importante: usa 'export const API = ...' (no 'default')
export const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});
