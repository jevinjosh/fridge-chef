import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import * as chatSchema from "@shared/models/chat";

const { Pool } = pg;

// Mock DB for local run
export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy" });
export const db = drizzle(pool, { schema: { ...schema, ...chatSchema } });
