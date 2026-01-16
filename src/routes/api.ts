import type { FastifyInstance } from 'fastify'

export async function apiRoutes(app: FastifyInstance) {
  app.get('/health', async () => {
    return { status: 'ok' }
  })
}