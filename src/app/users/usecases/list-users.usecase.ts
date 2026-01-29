import type { UseCase } from '../../common/interfaces/usecase'
import type { UserRepository } from '../repositories/user.repository'
import type { UserResponseDto } from '../schemas/user.schema'

export class ListUsers implements UseCase<void, UserResponseDto[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll()

    return users.map((user) => {
      const { id, ...organization } = user.organization
      return {
        uuid: user.public_id,
        name: user.name,
        email: user.email,
        organization: { ...organization, uuid: organization.publicId },
        createdAt: user.created_at?.toISOString(),
        updatedAt: user.updated_at?.toISOString(),
      }
    })
  }
}
