import { FastifyJWT } from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

export const validateAuthenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const token = request.cookies.access_token
  if (!token) {
    reply.status(401).send({ message: 'Unauthorized' })
    return
  }

  const decoded = request.jwt.verify<FastifyJWT['user']>(token)
  request.user = decoded
}
