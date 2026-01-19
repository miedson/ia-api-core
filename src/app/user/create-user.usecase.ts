import type { UseCase } from '../common/interfaces/usecase'
import type { OrganizationRepository } from '../organization/repositories/organization.repository'
import type { UserRepository } from './repositories/user.repository'
import type { UserDto } from './schemas/user.schema'

export class CreateUser implements UseCase<UserDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(input: UserDto): Promise<void> {}
}
