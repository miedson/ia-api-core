import { BcryptPasswordHasher } from '@/app/auth/adapters/bcrypt-password-hasher.adapter'
import { errorSchema } from '@/app/common/schemas/error.schema'
import { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import { ListUsers } from '@/app/users/usecases/list-users.usecase'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { userRequestSchema } from '@/app/users/schemas/user-request.schema'
import { userResponseSchema } from '@/app/users/schemas/user-response.schema'
import { prisma } from '@/lib/prisma'
import { FastifyTypeInstance } from '@/types'
import z from 'zod'
import { CreateUser } from './usecases/create-user.usecase'

const userRepository = new UserRepository(prisma)
const organizationRepository = new OrganizationRepository(prisma)
const hasher = new BcryptPasswordHasher()

export async function usersRoutes(app: FastifyTypeInstance) {
  app.post(
    '/register',
    {
      config: { public: true },
      schema: {
        tags: ['users'],
        summary: 'Registrar usuário',
        body: userRequestSchema,
        response: {
          201: z.undefined().describe('User created'),
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const createUser = new CreateUser(
          userRepository,
          organizationRepository,
          hasher,
        )
        await createUser.execute(request.body)
        reply.status(201).send()
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )

  app.get(
    '/users',
    {
      schema: {
        tags: ['users'],
        summary: 'Listar usuários',
        response: {
          200: z.array(userResponseSchema).describe('List of users'),
          500: errorSchema,
        },
      },
    },
    async (_, reply) => {
      try {
        const listUsers = new ListUsers(userRepository)
        const users = await listUsers.execute()
        reply.status(200).send(users)
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
}
