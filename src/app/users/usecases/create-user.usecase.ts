import type { PasswordHasher } from '@/app/common/interfaces/password-hasher'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import type { UserRepository } from '../repositories/user.repository'
import type { CreateUserDto } from '../schemas/user.schema'

export class CreateUser implements UseCase<CreateUserDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserDto): Promise<void> {
    const userExists = await this.userRepository.findByEmail(input.email)
    if (userExists) {
      throw new Error('email already used')
    }
    const organizationCreated = await this.organizationRepository.create(
      input.organization,
    )
    if (!organizationCreated) {
      throw new Error('error when creating organization')
    }
    const passwordHash = await this.passwordHasher.hash(input.password)
    await this.userRepository.create({
      ...input,
      organization: {
        ...organizationCreated,
        uuid: organizationCreated.publicId,
      },
      passwordHash,
    })
  }
}
