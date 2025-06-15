import HomePage from "@/features/home/pages/HomePage";
import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import NotFound from "@/features/common/pages/NotFound";
import AuthLayout from "@/features/auth/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "signup",
        Component: SignupPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
