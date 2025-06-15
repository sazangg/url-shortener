import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string(),
});

export type UserRead = Omit<z.infer<typeof userSchema>, "password">;

export type UserIn = Omit<z.infer<typeof userSchema>, "id">;

export const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export type TokenRead = z.infer<typeof tokenSchema>;
