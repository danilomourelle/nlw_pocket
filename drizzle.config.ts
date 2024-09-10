import { defineConfig } from "drizzle-kit";
import { environments } from "./src/env";

export default defineConfig({
  schema: "./schema.ts",
  out: "./.migration",
  dialect: "postgresql",
  dbCredentials: {
    url: environments.DATABASE_URL,
  },
});
