import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { schema } from "./schema";

export const db = drizzle("postgres://postgres:password@localhost:5432/postgres", {
    schema,
});
