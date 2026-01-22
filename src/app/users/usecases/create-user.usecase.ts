import { PasswordHasher } from "@/app/common/interfaces/password-hasher"
import { UseCase } from "@/app/common/interfaces/usecase"
import { OrganizationRepository } from "@/app/organization/repositories/organization.repository"
import { UserRepository } from "../repositories/user.repository"
import { UserRequestDto } from "../schemas/user-request.schema"

export class CreateUser implements UseCase<UserRequestDto, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: UserRequestDto): Promise<void> {
    const userExists = await this.userRepository.findByEmail(input.email)
    if (userExists) {
      throw new Error('email already used')
    }
    const { organizationId } = await this.organizationRepository.create(
      input.organization,
    )
    const passwordHash = await this.passwordHasher.hash(input.password)
    await this.userRepository.create({
      ...input,
      organization: { ...input.organization, id: organizationId },
      passwordHash,
    })
  }
}
