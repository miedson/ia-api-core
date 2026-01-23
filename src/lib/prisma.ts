import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export const prisma = new PrismaClient({
  adapter: new PrismaPg({
    url: process.env.DATABASE_URL
  }),
  log: ['query'],
})
