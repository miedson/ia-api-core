import type { PasswordHasher } from '@/app/common/interfaces/password-hasher'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import type { UserRepository } from '../repositories/user.repository'
import type { CreateUserDto } from '../schemas/user.schema'
import type { ChatwootService } from './services/chatwood.service'
import type { FastifyBaseLogger } from 'fastify/types/logger'

export class CreateAccount implements UseCase<CreateUserDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly chatwootService: ChatwootService,
    private readonly logger: FastifyBaseLogger,
  ) {}

  async execute({
    name,
    displayName,
    email,
    password,
    organization,
  }: CreateUserDto): Promise<void> {
    this.logger.info(
      `start create user account: ${JSON.stringify({ name, displayName, email, password, organization })}`,
    )
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

    this.logger.info(`call chatwoot service`)
    const { accountId, userId, role } =
      await this.chatwootService.provisionAccountWithUser(
        {
          name,
          displayName,
          email,
          password,
          organization,
        },
        'agent',
      )

    this.logger.info(
      `account and user created in chatwoot: ${JSON.stringify({ accountId, userId, role })}`,
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

    this.logger.info(`finished create user account`)
  }
}
