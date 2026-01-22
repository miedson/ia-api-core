import { PasswordHasher } from '@/app/common/interfaces/password-hasher'
import { UseCase } from '@/app/common/interfaces/usecase'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { FastifyRequest } from 'fastify/types/request'
import { AuthRequestDto } from '../schemas/auth-request.schema'
import { AuthResponseDto } from '../schemas/auth-response.schema'

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
