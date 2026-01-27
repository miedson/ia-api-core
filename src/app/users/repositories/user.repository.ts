import { Repository } from '@/app/common/interfaces/repository'
import type { Prisma } from '@/generated/prisma/client'
import { type UserDto, userSchema } from '../schemas/user.schema'

type UserWithOrganization = Prisma.UserGetPayload<{
  include: { organization: true }
}>

export class UserRepository extends Repository {
  async create({ name, email, password, organization, passwordHash }: UserDto) {
    const data = userSchema.parse({
      name,
      email,
      password,
      organization,
      passwordHash,
    })
    const user = await this.dataSource.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: passwordHash,
        organizationId: organization.id,
      },
    })
    return user
  }

  async findByEmail(email: string): Promise<UserWithOrganization | null> {
    const user = await this.dataSource.user.findUnique({
      where: { email },
      include: { organization: true },
    })

    if (!user) {
      return null
    }

    return user
  }

  async findAll(): Promise<UserWithOrganization[]> {
    return await this.dataSource.user.findMany({
      include: { organization: true },
    })
  }

  async updatePasswordHash(
    tokenHashId: string,
    userId: number,
    passwordUserHash: string,
  ): Promise<void> {
    this.dataSource.user.update({
      where: { id: userId },
      data: {
        passwordHash: passwordUserHash,
      },
    })
    this.dataSource.passwordResetToken.update({
      where: { id: tokenHashId },
      data: { useAt: new Date() },
    })
  }
}
