import z from 'zod'
import { errorSchema } from '@/app/common/schemas/error.schema'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { ListUsers } from '@/app/users/usecases/list-users.usecase'
import { prisma } from '@/lib/prisma'
import type { FastifyTypeInstance } from '@/types'
import { userResponseSchema } from './schemas/user.schema'

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
        const userRepository = new UserRepository(prisma)
        const listUsers = new ListUsers(userRepository)
        const users = await listUsers.execute()
        reply.status(200).send(users)
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
}
