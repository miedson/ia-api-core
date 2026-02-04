import type { UseCase } from '../../common/interfaces/usecase'
import type { UserRepository } from '../repositories/user.repository'
import type { UserResponseDto } from '../schemas/user.schema'

export class ListUsers implements UseCase<void, UserResponseDto[]> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll()

    return users.map((user) => {
      const {
        id: Id,
        organization: org,
        organizationId,
        passwordHash,
        public_id,
        ...userData
      } = user
      const { id, ...organization } = user.organization
      return {
        ...userData,
        uuid: user.public_id,
        organization: { ...organization, uuid: organization.publicId },
      }
    })
  }
}
