import { defineConfig } from "prisma/config";
import { envVar } from "./src/utils/env-variables.js";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: envVar.DATABASE_URL,
  },
});
