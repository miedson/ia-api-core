import { MailSender } from '@/app/common/interfaces/email-sender'
import { TokenHasher } from '@/app/common/interfaces/token-hasher'
import { UseCase } from '@/app/common/interfaces/usecase'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { randomBytes } from 'node:crypto'
import { PasswordResetTokenRepository } from '../repositorories/password-reset-token.repository'
import { ForgotPasswordDto } from '../schemas/forgot-password.schema'

export class ForgotUserPassword implements UseCase<ForgotPasswordDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailSender: MailSender,
    private readonly tokenHasher: TokenHasher,
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
  ) {}

  async execute(input?: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findByEmail(input?.email!)

    if (user) {
      const { id: userId, name, email } = user

      const rawToken = randomBytes(32).toString('hex')
      const tokenHash = this.tokenHasher.hash(rawToken)
      const link = `https://${process.env['DOMAIN']}/reset-password?token=${rawToken}`

      await this.passwordResetTokenRepository.create({ userId, tokenHash })

      await this.mailSender.send({
        from: 'no-reply',
        to: [{ name, email }],
        subject: 'Recuperação de senha',
        html: `<p>Clique no link: ${link}</p>`,
      })
    }
  }
}
