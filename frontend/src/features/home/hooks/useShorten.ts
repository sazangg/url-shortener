import { useMutation } from "@tanstack/react-query";
import { urlCreateSchema, urlReadSchema, type UrlRead } from "../model";
import { api } from "@/app/api";

const shortenUrl = async (url: string) => {
  urlCreateSchema.parse({ original_url: url });
  const { data } = await api.post<UrlRead>("/v1/urls", { original_url: url });
  return urlReadSchema.parse(data);
};

export const useShorten = () =>
  useMutation({
    mutationFn: shortenUrl,
  });
