import { z } from "zod";

export const urlCreateSchema = z.object({
  original_url: z.string().url(),
});

export const urlReadSchema = z.object({
  slug: z.string(),
  short_url: z.string(),
  original_url: z.string(),
  expires_at: z.string().nullable(),
  clicks: z.number(),
});

export type UrlRead = z.infer<typeof urlReadSchema>;
