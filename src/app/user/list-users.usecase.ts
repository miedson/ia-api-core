import { UseCase } from '../common/interfaces/usecase'
import { OrganizationDto } from '../organization/schemas/organization.schema'
import { UserRepository } from './repositories/user.repository'
import { UserResponseDto } from './schemas/user-response.schema'

export class ListUsers implements UseCase<void, UserResponseDto[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll()

    return users.map((user) => ({
      uuid: user.public_id,
      name: user.name,
      email: user.email,
      organization: user.organization,
      createdAt: user.created_at?.toISOString(),
      updatedAt: user.updated_at?.toISOString(),
    }))
  }
}
