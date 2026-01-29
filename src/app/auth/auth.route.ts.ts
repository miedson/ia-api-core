import { z } from 'zod'
import { BcryptPasswordHasher } from '@/app/auth/adapters/bcrypt-password-hasher.adapter'
import { authRequestSchema } from '@/app/auth/schemas/auth-request.schema'
import { authResponseSchema } from '@/app/auth/schemas/auth-response.schema'
import { errorSchema } from '@/app/common/schemas/error.schema'
import { UserRepository } from '@/app/users/repositories/user.repository'
import { prisma } from '@/lib/prisma'
import type { FastifyTypeInstance } from '@/types'
import { MailerSendMailSenderAdapter } from '../common/adapters/mailersend-mail-sender.adapter'
import { OrganizationRepository } from '../organization/repositories/organization.repository'
import { createUserSchema } from '../users/schemas/user.schema'
import { CreateUser } from '../users/usecases/create-user.usecase'
import { Sha256TokenHasherAdapater } from './adapters/sha256-token-hasher.adapter'
import { PasswordResetTokenRepository } from './repositorories/password-reset-token.repository'
import { forgotPasswordSchema } from './schemas/forgot-password.schema'
import { resetPasswordSchema } from './schemas/reset-password.schema'
import { AuthenticateUser } from './usecases/authenticate-user.usecase'
import { ForgotUserPassword } from './usecases/forgot-user-password.usecase'
import { ResetPassword } from './usecases/reset-password.usecase'

const userRepository = new UserRepository(prisma)
const passwordResetTokenRepository = new PasswordResetTokenRepository(prisma)
const hasher = new BcryptPasswordHasher()
const mailSender = new MailerSendMailSenderAdapter()
const tokenHasher = new Sha256TokenHasherAdapater()

export async function authRoutes(app: FastifyTypeInstance) {
  app.post(
    '/register',
    {
      config: { public: true },
      schema: {
        tags: ['auth'],
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
        await prisma.$transaction(async (transaction) => {
          const userRepository = new UserRepository(transaction)
          const organizationRepository = new OrganizationRepository(transaction)
          const createUser = new CreateUser(
            userRepository,
            organizationRepository,
            hasher,
          )
          await createUser.execute(request.body)
        })
        reply.status(201).send()
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
  app.post(
    '/login',
    {
      config: { public: true },
      schema: {
        tags: ['auth'],
        summary: 'Autenticar usuário',
        body: authRequestSchema,
        response: {
          201: authResponseSchema.describe('Authenticated successfully'),
          500: errorSchema,
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
  app.post(
    '/forgot-password',
    {
      config: { public: true },
      schema: {
        tags: ['auth'],
        summary: 'Recuperar senha',
        body: forgotPasswordSchema,
        response: {
          204: z.undefined(),
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body
        const forgotUserPassword = new ForgotUserPassword(
          userRepository,
          mailSender,
          tokenHasher,
          passwordResetTokenRepository,
        )
        await forgotUserPassword.execute({ email })
        reply.code(204).send()
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
  app.post(
    '/reset-password',
    {
      config: { public: true },
      schema: {
        tags: ['auth'],
        summary: 'Criar nova senha',
        body: resetPasswordSchema,
        response: {
          201: z.undefined(),
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { token, password } = request.body
        await prisma.$transaction(async (transaction) => {
          const userRepository = new UserRepository(transaction)
          const passwordResetTokenRepository = new PasswordResetTokenRepository(
            transaction,
          )
          const resetPassword = new ResetPassword(
            tokenHasher,
            passwordResetTokenRepository,
            userRepository,
            hasher,
          )
          await resetPassword.execute({ token, password })
        })
        reply.code(201).send()
      } catch (error) {
        reply.status(500).send({ message: (error as Error).message })
      }
    },
  )
}
