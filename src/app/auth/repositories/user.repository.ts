import { type UserDto, userSchema } from '@/app/user/schemas/user.schema'
import type { PrismaClient } from '@/generated/prisma/client'

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({ name, email, organization }: UserDto): any {
    const data = userSchema.parse({ name, email, organization })
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        organization: data.organization,
        password: 'test',
      },
    })
  }
}
