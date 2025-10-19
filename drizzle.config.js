import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./components/db/schema.user.js",
  out: "./drizzle",
});
