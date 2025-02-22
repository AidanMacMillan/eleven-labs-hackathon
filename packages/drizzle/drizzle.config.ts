import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: './drizzle',
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://postgres:password@localhost:5432/postgres",
  },
});