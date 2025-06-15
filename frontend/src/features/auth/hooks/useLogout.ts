import { useMutation } from "@tanstack/react-query";

export const useLogout = (cb: () => Promise<void>) => useMutation({mutationFn: cb});
