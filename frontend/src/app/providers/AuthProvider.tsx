import type { UserRead } from "@/features/auth/model";
import { useCallback, useLayoutEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../api";
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
      if(!bootstrapped) setBootstrapped(true);
      return;
    }

    api
      .get<UserRead>("/v1/users/me")
      .then((response) => {
        setUser(response.data);

        toast.success("Welcome back!");
      })
      .catch(() => {
        setAccessToken(null);
        setUser(null);

        toast.error("Login failed, please try again");
      })
      .finally(() => setBootstrapped(true));
  }, [accessToken, bootstrapped]);

  const login = useCallback(async (token: string) => {
    setBootstrapped(false);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setAccessToken(token);
  }, []);

  const logout = useCallback(() => {
    delete api.defaults.headers.common.Authorization;
    setAccessToken(null);
    setUser(null);
    toast("Logged out successfully");
  }, []);

  return (
    <AuthContext value={{ user, accessToken, bootstrapped, login, logout }}>
      {children}
    </AuthContext>
  );
};
