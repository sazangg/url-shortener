import type { UserRead } from "@/features/auth/model";
import { useCallback, useLayoutEffect, useState } from "react";
import { api, registerAuthHandlers } from "../api";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserRead | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useLayoutEffect(() => {
    if (accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [accessToken]);

  useLayoutEffect(() => {
    if (!accessToken) {
      if (!bootstrapped) setBootstrapped(true);
      return;
    }

    api
      .get<UserRead>("/v1/users/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setBootstrapped(true));
  }, [accessToken, bootstrapped]);

  const login = useCallback(async (token: string) => {
    setBootstrapped(false);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setAccessToken(token);
  }, []);

  const logout = useCallback(async () => {
    await api.post("/v1/auth/logout").catch(() => {});

    delete api.defaults.headers.common.Authorization;
    setAccessToken(null);
    setUser(null);
  }, []);

  useLayoutEffect(() => {
    registerAuthHandlers({
      setToken: (token: string) => {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        setAccessToken(token);
      },
      clearToken: () => logout(),
    });
  }, [logout]);

  return (
    <AuthContext value={{ user, accessToken, bootstrapped, login, logout }}>
      {children}
    </AuthContext>
  );
};
