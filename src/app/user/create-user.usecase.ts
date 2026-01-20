import { PasswordHasher } from '../common/interfaces/password-hasher'
import type { UseCase } from '../common/interfaces/usecase'
import type { OrganizationRepository } from '../organization/repositories/organization.repository'
import type { UserRepository } from './repositories/user.repository'
import type { UserDto } from './schemas/user.schema'

export class CreateUser implements UseCase<UserDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(input: UserDto): Promise<void> {
    const userExists = await this.userRepository.findByEmail(input.email)
    if(userExists) {
      throw new Error('email already used')
    }
    const { organizationId } = await this.organizationRepository.create(input.organization)
    const passwordHash = await this.passwordHasher.hash(input.password);
    await this.userRepository.create(
      {...input,
        organization: {...input.organization, id: organizationId},
        passwordHash
      })
  }
}
