import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../database/schema";
import { environments } from "../env";

export const client = postgres(environments.DATABASE_URL);
export const db = drizzle(client, { schema, logger: true });
