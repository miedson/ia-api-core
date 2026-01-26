import { PasswordHasher } from '@/app/common/interfaces/password-hasher'
import { TokenHasher } from '@/app/common/interfaces/token-hasher'
import { UseCase } from '@/app/common/interfaces/usecase'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { PasswordResetTokenRepository } from '../repositorories/password-reset-token.repository'
import { ResetPasswordDto } from '../schemas/reset-password.schema'

export class ResetPassword implements UseCase<ResetPasswordDto, void> {
  constructor(
    private readonly tokenHasher: TokenHasher,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ token, password }: ResetPasswordDto): Promise<void> {
    const tokenHash = this.tokenHasher.hash(token)
    const resetToken =
      await this.passwordResetTokenRepository.findFirstTokenHash(tokenHash)

    if (!resetToken) {
      throw new Error('Invalid or expires token')
    }

    const newPasswordUserHash = await this.passwordHasher.hash(password)
    await this.userRepository.updatePasswordHash(
      resetToken.id,
      resetToken.userId,
      newPasswordUserHash,
    )
  }
}
