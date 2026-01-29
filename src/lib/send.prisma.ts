import type { FastifyReply } from 'fastify'
import type z from 'zod'

export const send = <T extends z.ZodTypeAny>(
  reply: FastifyReply,
  schema: T,
  data: unknown,
  status = 200,
) => {
  reply.status(status).send(schema.parse(data))
}
