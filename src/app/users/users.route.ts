import z from 'zod'
import { errorSchema } from '@/app/common/schemas/error.schema'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { ListUsers } from '@/app/users/usecases/list-users.usecase'
import { prisma } from '@/lib/prisma'
import type { FastifyTypeInstance } from '@/types'
import { createUserSchema, userResponseSchema } from './schemas/user.schema'
import { CreateUser } from './usecases/create-user.usecase'
import { OrganizationRepository } from '../organization/repositories/organization.repository'
import { ChatwootService } from './services/chatwood.service'
import { FetchHttpClientAdapter } from '../common/adapters/fetch-httpclient.adapter'
import { BcryptPasswordHasher } from '../auth/adapters/bcrypt-password-hasher.adapter'

const userRepository = new UserRepository(prisma)
const fetchHttpClient = new FetchHttpClientAdapter()
const chatwootService = new ChatwootService(fetchHttpClient)
const passwordHasher = new BcryptPasswordHasher()

export async function usersRoutes(app: FastifyTypeInstance) {
  app.get(
    '',
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
  app.post(
    '',
    {
      schema: {
        tags: ['users'],
        summary: 'Registrar usuário',
        body: createUserSchema,
        response: {
          201: z.undefined().describe('User created'),
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        prisma.$transaction(async (transaction) => {
          const userRepository = new UserRepository(transaction)
          const organizationRepository = new OrganizationRepository(transaction)
          const createUser = new CreateUser(
            userRepository,
            organizationRepository,
            chatwootService,
            passwordHasher,
          )
          await createUser.execute(request.body)
        })
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
}
