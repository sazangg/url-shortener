import type { ReactNode } from "react";
import { useAuth } from "../../../app/hooks/useAuth";
import { Navigate } from "react-router";

export function LoggedInGuard({ children }: { children: ReactNode }) {
  const { user, bootstrapped } = useAuth();

  if (!bootstrapped) return null;

  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  return children;
}

export function NotLoggedInGuard({ children }: { children: ReactNode }) {
  const { user, bootstrapped } = useAuth();

  if (!bootstrapped) return null;

  if (user) {
    return <Navigate to="/" />;
  }
  return children;
}

export const ShowIfLoggedIn = ({ children }: { children: React.ReactNode }) =>
  useAuth().user ? <>{children}</> : null;

export const ShowIfNotLoggedIn = ({ children }: { children: React.ReactNode }) =>
  useAuth().user ? null : <>{children}</>;
