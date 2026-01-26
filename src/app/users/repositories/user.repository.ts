import type { Prisma, PrismaClient, User } from '@/generated/prisma/client'
import { type UserDto, userSchema } from '../schemas/user.schema'

type CreateUserDto = UserDto & { passwordHash: string }
type UserWithOrganization = Prisma.UserGetPayload<{
  include: { organization: true }
}>

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    name,
    email,
    password,
    organization,
    passwordHash,
  }: CreateUserDto) {
    const data = userSchema.parse({
      name,
      email,
      password,
      organization,
    })
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: passwordHash,
        organizationId: organization.id!,
      },
    })
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return user
  }

  async findAll(): Promise<UserWithOrganization[]> {
    return await this.prisma.user.findMany({
      include: { organization: true },
    })
  }

  async updatePasswordHash(
    tokenHashId: string,
    userId: number,
    passwordUserHash: string,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: passwordUserHash,
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: tokenHashId },
        data: { useAt: new Date() },
      }),
    ])
  }
}
