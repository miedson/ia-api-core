import { Prisma, PrismaClient, User } from '@/generated/prisma/client'
import {
  UserRequestDto,
  userRequestSchema,
} from '../schemas/user-request.schema'

type CreateUserDto = UserRequestDto & { passwordHash: string }
type UserWithOrganization = Prisma.UserGetPayload<{ include: { organization: true } }>

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    name,
    email,
    password,
    organization,
    passwordHash,
  }: CreateUserDto) {
    const data = userRequestSchema.parse({
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
}
