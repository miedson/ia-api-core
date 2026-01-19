import type { UseCase } from '../common/interfaces/usecase'
import type { OrganizationRepository } from '../organization/repositories/organization.repository'
import type { UserRepository } from './repositories/user.repository'
import type { AuthRequestDto } from './schemas/auth-request.schema'
import type { AuthResponseDto } from './schemas/auth-response.schema'

export class Auth implements UseCase<AuthRequestDto, AuthResponseDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(input: AuthRequestDto): Promise<AuthResponseDto> {
    return {} as Promise<AuthResponseDto>
  }
}
