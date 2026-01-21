import { FastifyRequest } from 'fastify/types/request'
import { PasswordHasher } from '../common/interfaces/password-hasher'
import type { UseCase } from '../common/interfaces/usecase'
import { UserRepository } from '../user/repositories/user.repository'
import type { AuthRequestDto } from './schemas/auth-request.schema'
import type { AuthResponseDto } from './schemas/auth-response.schema'

export class AuthenticateUser
  implements UseCase<AuthRequestDto, AuthResponseDto>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwt: FastifyRequest['jwt'],
  ) {}

  async execute(input: AuthRequestDto): Promise<AuthResponseDto> {
    const { email, password } = input
    const existingUser = await this.userRepository.findByEmail(email)

    const passwordValid = existingUser
      ? await this.passwordHasher.compare(password, existingUser.passwordHash)
      : false

    if (!existingUser || !passwordValid) {
      throw new Error('Invalid credentials')
    }

    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    }

    return {
      access_token: this.jwt.sign(payload),
    }
  }
}
