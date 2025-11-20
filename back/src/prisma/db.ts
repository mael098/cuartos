import { PrismaClient } from "./generated/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function createPrismaClient() {
  const adapter =
    globalThis.adapterGlobal ??
    new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

declare const globalThis: {
  dbGlobal: ReturnType<typeof createPrismaClient>;
  adapterGlobal: PrismaBetterSqlite3;
} & typeof global;

const db = globalThis.dbGlobal ?? createPrismaClient();

globalThis.dbGlobal = db;

export { db };
