import { defineConfig } from "prisma/config";
import { config as loadDotenv } from "dotenv";
import { resolve } from "path";

loadDotenv({ path: resolve(process.cwd(), ".env") });
loadDotenv({ path: resolve(process.cwd(), ".env.local") });

export default defineConfig({
  datasource: {
    // Direct connection for migrations (bypasses pgbouncer)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
