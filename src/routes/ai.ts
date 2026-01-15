import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { chat } from '@/ai/chat'
import { embed } from '@/ai/embedding'
import { ensureCollection, qdrant } from '@/ai/qdrant'

export default async function (app: FastifyInstance) {
  function collection(tenant: string) {
    return `tenant_${tenant.toLowerCase()}`
  }

  app.post('/embed', async (req, reply) => {
    const tenant = String(req.headers['x-tenant-id'] || '')
    if (!tenant) return reply.code(400).send({ error: 'Missing X-Tenant-Id' })

    const body = z.object({ id: z.number(), text: z.string() }).parse(req.body)

    const col = collection(tenant)
    await ensureCollection(col)

    const vector = await embed(body.text)

    await qdrant.upsert(col, {
      points: [{ id: body.id, vector, payload: { text: body.text } }],
    })

    return { status: 'ok' }
  })

  app.post('/search', async (req, reply) => {
    const tenant = String(req.headers['x-tenant-id'] || '')
    if (!tenant) return reply.code(400).send({ error: 'Missing X-Tenant-Id' })

    const body = z.object({ text: z.string() }).parse(req.body)

    const col = collection(tenant)
    await ensureCollection(col)

    const vector = await embed(body.text)

    return await qdrant.search(col, {
      vector,
      limit: 5,
      with_payload: true,
    })
  })

  app.post('/chat', async (req, reply) => {
    const tenant = String(req.headers['x-tenant-id'] || '')
    if (!tenant) return reply.code(400).send({ error: 'Missing X-Tenant-Id' })

    const body = z.object({ question: z.string() }).parse(req.body)

    return await chat(tenant, body.question)
  })
}
