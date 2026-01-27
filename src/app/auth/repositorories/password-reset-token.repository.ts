import { addMinutes } from 'date-fns'
import { Repository } from '@/app/common/interfaces/repository'

export class PasswordResetTokenRepository extends Repository {
  async create({
    userId,
    tokenHash,
  }: {
    userId: number
    tokenHash: string
  }): Promise<void> {
    await this.dataSource.passwordResetToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt: addMinutes(new Date(), 30),
      },
    })
  }

  async findFirstTokenHash(tokenHash: string) {
    return await this.dataSource.passwordResetToken.findFirst({
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
