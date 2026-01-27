import type { Prisma, PrismaClient } from '@/generated/prisma/client'

export abstract class Repository {
  constructor(
    protected readonly dataSource: PrismaClient | Prisma.TransactionClient,
  ) {}
}
