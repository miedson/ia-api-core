import { BcryptPasswordHasher } from '@/app/auth/adapters/bcrypt-password-hasher.adapter'
import { AuthenticateUser } from '@/app/auth/authenticate-user'
import { authRequestSchema } from '@/app/auth/schemas/auth-request.schema'
import { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import { CreateUser } from '@/app/user/create-user.usecase'
import { UserRepository } from '@/app/user/repositories/user.repository'
import { userSchema } from '@/app/user/schemas/user.schema'
import { prisma } from '@/lib/prisma'
import { FastifyTypeInstance } from '@/types'
import { z } from 'zod'

const errorSchema = z.object({
  message: z.string()
}).describe('Internal server error')

const hasher = new BcryptPasswordHasher()

export async function apiRoutes(app: FastifyTypeInstance) {
  app.post('/auth', {
    schema: {
      tags: ['auth'],
      summary: 'Autenticar usuário',
      body: authRequestSchema,
      response: {
        201: z.undefined().describe('Authenticated successfully'),
        500: errorSchema,
        401: z.object({ message: z.string().describe('Unauthorized') }).describe('Unauthorized')
      }
    }
  }, async (request, reply) => {
      try {
        const { email, password } = request.body
        const userRepository = new UserRepository(prisma)
        const authenticateUser = new AuthenticateUser(userRepository, hasher);
        const result = await authenticateUser.execute({ email, password })
        reply.setCookie('session', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        .code(201).send()
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
  })

  app.post('/user', {
    schema: {
      tags: ['users'],
      summary: 'Criar usuário',
      body: userSchema,
      response: {
        201: z.undefined().describe('User created'),
        500: errorSchema
      }
    }
  }, async (request, reply) => {
      try {
        const userRepository = new UserRepository(prisma)
        const organizationRepository = new OrganizationRepository(prisma)
        const createUser = new CreateUser(
          userRepository,
          organizationRepository,
          hasher
        )
        await createUser.execute(request.body)
        reply.status(201).send()
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
  })
}