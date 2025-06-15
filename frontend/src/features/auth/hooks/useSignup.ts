import { useMutation } from "@tanstack/react-query";
import type { TokenRead, UserIn } from "../model";
import { api } from "@/app/api";

const createUser = (data: UserIn) =>
  api.post<TokenRead>("/v1/auth/register", data);

export const useSignup = () =>
  useMutation({
    mutationFn: (data: UserIn) =>
      createUser(data).then((response) => response.data),
  });
