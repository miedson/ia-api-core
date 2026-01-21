import { BcryptPasswordHasher } from '@/app/auth/adapters/bcrypt-password-hasher.adapter'
import { AuthenticateUser } from '@/app/auth/authenticate-user.usecase'
import { authRequestSchema } from '@/app/auth/schemas/auth-request.schema'
import { authResponseSchema } from '@/app/auth/schemas/auth-response.schema'
import { errorSchema } from '@/app/common/schemas/error.schema'
import { UserRepository } from '@/app/user/repositories/user.repository'
import { prisma } from '@/lib/prisma'
import { FastifyTypeInstance } from '@/types'
import { z } from 'zod'

const userRepository = new UserRepository(prisma)
const hasher = new BcryptPasswordHasher()

export async function authRoutes(app: FastifyTypeInstance) {
  app.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        summary: 'Autenticar usuário',
        body: authRequestSchema,
        response: {
          201: authResponseSchema.describe('Authenticated successfully'),
          500: errorSchema,
          401: z
            .object({ message: z.string().describe('Unauthorized') })
            .describe('Unauthorized'),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body
        const { jwt } = request
        const authenticateUser = new AuthenticateUser(
          userRepository,
          hasher,
          jwt,
        )
        const result = await authenticateUser.execute({ email, password })
        reply
          .setCookie('access_token', result.access_token, {
            path: '/',
            httpOnly: true,
            secure: true,
          })
          .code(201)
          .send(result)
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
}
