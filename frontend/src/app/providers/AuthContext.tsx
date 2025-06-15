import type { UserRead } from "@/features/auth/model";
import { createContext } from "react";

export type AuthContextType = {
  user: UserRead | null;
  accessToken: string | null;
  bootstrapped: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null)
