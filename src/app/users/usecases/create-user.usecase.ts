import type { PasswordHasher } from '@/app/common/interfaces/password-hasher'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import type { UserRepository } from '../repositories/user.repository'
import { createUserSchema, type CreateUserDto } from '../schemas/user.schema'
import type { ChatwootService } from '../services/chatwood.service'

export class CreateUser implements UseCase<CreateUserDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly chatwootService: ChatwootService,
    private readonly passwordHasher: PasswordHasher,
  ) {}
  async execute(input: CreateUserDto): Promise<void> {
    const { name, displayName, email, password, organizationId, role } =
      createUserSchema.parse(input)

    const userExists = await this.userRepository.findByEmail(input.email)

    if (userExists) {
      throw new Error('email already used')
    }
    const organization =
      await this.organizationRepository.findById(organizationId)

    if (!organization) {
      throw new Error('Organization not found')
    }

    const { userId } = await this.chatwootService.createUser({
      name,
      displayName,
      email,
      password,
    })

    await this.chatwootService.attachUserAccount({
      userId,
      accountId: organization.chatwootAccountId!,
      role,
    })

    const passwordHash = await this.passwordHasher.hash(password)
    await this.userRepository.create({
      name,
      displayName,
      email,
      password,
      chatwootUserId: userId,
      passwordHash,
      organization: { ...organization, uuid: organization.publicId },
      role,
    })
  }
}
