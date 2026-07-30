const DEFAULT_API_BASE_URL = "http://localhost:8002/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_BASE_URL ||
  API_BASE_URL.replace(/\/api\/?$/, "");
