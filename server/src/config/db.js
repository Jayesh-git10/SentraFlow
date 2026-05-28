import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Setup the PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Setup the Prisma PostgreSQL driver adapter
const adapter = new PrismaPg(pool);

// Instantiate and export the Prisma Client
export const prisma = new PrismaClient({ adapter });
  
export default prisma;
