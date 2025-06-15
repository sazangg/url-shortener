import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL as string ?? "/api/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // TODO : add auth header
    return config;
  },
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      // TODO : attempt refresh token
      // If we get back an access token, we set it in memory
    }
    return Promise.reject(error);
  }
)
