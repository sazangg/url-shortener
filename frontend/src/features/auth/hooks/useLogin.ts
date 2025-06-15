import { useMutation } from "@tanstack/react-query";
import type { TokenRead, UserIn } from "../model";
import { api } from "@/app/api";

const loginUser = (data: UserIn) =>
  api.post<TokenRead>(
    "/v1/auth/login",
    new URLSearchParams({
      username: data.email,
      password: data.password,
      grant_type: "password",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

export const useLogin = () =>
  useMutation({
    mutationFn: (data: UserIn) =>
      loginUser(data).then((response) => response.data),
  });
