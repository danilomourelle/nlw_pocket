import { defineConfig } from "drizzle-kit";
import { environments } from "./src/env";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/.migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: environments.DATABASE_URL,
  },
});
