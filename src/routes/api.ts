import { Auth } from '@/app/auth'
import { UserRepository } from '@/app/auth/repositories/user.repository'
import { authRequestSchema } from '@/app/auth/schemas/auth-request.schema'
import { authResponseSchema } from '@/app/auth/schemas/auth-response.schema'
import { FastifyTypeInstance } from '@/types'

export async function apiRoutes(app: FastifyTypeInstance) {
  app.get('/health', async () => {
    return { status: 'ok' }
  })

  app.post('/auth', {
    schema: {
      tags: ['auth'],
      summary: 'Autenticação de usuários',
      body: authRequestSchema,
      response: {
        200: authResponseSchema.describe('User authenticated')
      }
    }
  }, async (request) => {
    try {
      const { user, password } = request.body
      const auth = new Auth( new UserRepository());
      await auth.execute({ user, password })
    } catch (error) {
      console.error(error)
    }
  })
}