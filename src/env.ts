import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
});

export const environments = envSchema.parse(process.env)