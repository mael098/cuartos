import { defineConfig } from "prisma/config";
import { DB_URL } from "./src/constants.ts";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
    seed: "node src/prisma/seed.ts",
  },
  datasource: {
    url: DB_URL,
  },
});
