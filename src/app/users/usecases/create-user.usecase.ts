import type { PasswordHasher } from '@/app/common/interfaces/password-hasher'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import type { UserRepository } from '../repositories/user.repository'
import type { CreateUserDto } from '../schemas/user.schema'
import type { ChatwootService } from './services/chatwood.service'

export class CreateUser implements UseCase<CreateUserDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly chatwootService: ChatwootService,
  ) {}

  async execute({
    name,
    displayName,
    email,
    password,
    organization,
  }: CreateUserDto): Promise<void> {
    const userExists = await this.userRepository.findByEmail(email)
    const organizationExists = await this.organizationRepository.findByDocument(
      organization.document,
    )
    if (userExists) {
      throw new Error('email already used')
    }
    if (organizationExists) {
      throw new Error('document alredy used')
    }

    const { accountId, userId, role } =
      await this.chatwootService.provisionAccountWithUser(
        {
          name,
          displayName,
          email,
          password,
          organization,
        },
        'administrator',
      )

    const organizationCreated = await this.organizationRepository.create({
      ...organization,
      chatwootAccountId: accountId,
    })

    const passwordHash = await this.passwordHasher.hash(password)

    await this.userRepository.create({
      name,
      displayName,
      email,
      password,
      chatwootUserId: userId,
      role,
      organization: {
        ...organizationCreated,
        uuid: organizationCreated.publicId,
      },
      passwordHash,
    })
  }
}
