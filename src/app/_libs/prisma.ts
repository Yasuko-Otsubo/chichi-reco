import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString/*: process.env.DATABASE_URL*/
})

export const prisma = new PrismaClient({ adapter })