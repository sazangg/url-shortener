import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL ?? "/api/v1",
  withCredentials: true,
});

let onLogin: ((token: string) => void) | null = null;
let onLogout: (() => void) | null = null;

export const registerAuthHandlers = (handlers: {
  setToken: (token: string) => void;
  clearToken: () => void;
}) => {
  onLogin = handlers.setToken;
  onLogout = handlers.clearToken;
}

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (err?.response?.status !== 401 || err.config?.__isRetry) {
      return Promise.reject(err);
    }
    try {
      const refreshClient = axios.create({ baseURL: api.defaults.baseURL, withCredentials: true });
      const { data } = await refreshClient.post("/v1/auth/refresh");
      const newToken = data.access_token;
      if (onLogin) onLogin(newToken);

      err.config.__isRetry = true;
      err.config.headers = {
        ...(err.config.headers ?? {}),
        Authorization: `Bearer ${newToken}`,
      };
      return api(err.config);
    } catch {
      if (onLogout) onLogout();
      return Promise.reject(err);
    }
  }
)
