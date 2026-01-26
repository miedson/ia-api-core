import { PrismaClient } from '@/generated/prisma/client'
import { addMinutes } from 'date-fns'

export class PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    userId,
    tokenHash,
  }: {
    userId: number
    tokenHash: string
  }): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: addMinutes(new Date(), 30),
      },
    })
  }

  async findFirstTokenHash(tokenHash: string) {
    return await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expiresAt: {
          gt: new Date(),
        },
        useAt: null,
      },
      include: { user: true },
    })
  }
}
