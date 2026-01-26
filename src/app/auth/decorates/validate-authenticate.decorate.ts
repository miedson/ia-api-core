import { FastifyJWT } from '@fastify/jwt'
import { FastifyReply, FastifyRequest } from 'fastify'
import { unauthorizedSchema } from '../auth.route.ts'

export const validateAuthenticateDecorate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const idPublic = request.routeOptions.config?.public
  if (idPublic) return

  const token = request.cookies.access_token

  if (!token) {
    reply.status(401).send(unauthorizedSchema)
    return
  }

  const decoded = request.jwt.verify<FastifyJWT['user']>(token)
  request.user = decoded
}
