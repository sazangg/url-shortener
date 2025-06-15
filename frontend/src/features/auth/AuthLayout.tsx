import { Outlet } from "react-router";
import { NotLoggedInGuard } from "./components/Guards";

export default function AuthLayout() {
  return (
    <NotLoggedInGuard>
      <Outlet />
    </NotLoggedInGuard>
  );
}
