import type { FastifyTypeInstance } from '@/types'
import { QdrantClient } from '@qdrant/js-client-rest'
import z from 'zod'
import { FetchHttpClientAdapter } from '../common/adapters/fetch-httpclient.adapter'
import { errorSchema } from '../common/schemas/error.schema'
import { CollectionRepository } from './repositories/collection.repository'
import { EmbedRepository } from './repositories/embed.repository'
import {
  createEmbedSchema,
  searchEmbeddingsRequestSchema,
  searchEmbeddingsResponseSchema,
} from './schemas/embed.schema'
import { CreateEmbed } from './usecase/create-embed.usecase'
import { SearchEmbeddings } from './usecase/search-embed.usecase'

const httpClient = new FetchHttpClientAdapter()
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
})
const embedRepository = new EmbedRepository(qdrant)
const collectionRepository = new CollectionRepository(qdrant)

export function iaRoutes(app: FastifyTypeInstance) {
  app.post(
    '/embed',
    {
      schema: {
        tags: ['ia'],
        summary: 'Embedding de dados',
        body: createEmbedSchema,
        response: {
          201: z.undefined().describe('Dados adicionados'),
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const createEmbed = new CreateEmbed(
          embedRepository,
          collectionRepository,
          httpClient,
        )
        await createEmbed.execute({ ...request.body, uuid: request.user.sub })
        reply.status(201).send()
      } catch (error) {
        reply.status(500).send({ message: error } as Error)
      }
    },
  )
  app.get(
    '/search',
    {
      schema: {
        tags: ['ia'],
        summary: 'Busca embeddings salvos',
        querystring: searchEmbeddingsRequestSchema,
        response: {
          200: z.array(searchEmbeddingsResponseSchema),
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const searchEmbeddings = new SearchEmbeddings(
        collectionRepository,
        embedRepository,
        httpClient,
      )
      const list = await searchEmbeddings.execute({
        ...request.query,
        uuid: request.user.sub,
      })
      reply.status(200).send(list)
    },
  )
}
