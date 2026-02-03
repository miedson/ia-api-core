import type { HttpClient } from '@/app/common/interfaces/http-client'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { CollectionRepository } from '../repositories/collection.repository'
import type { EmbedRepository } from '../repositories/embed.repository'
import {
  type EmbedDto,
  embedSchema,
  type SearchEmbeddingsResponseDto,
} from '../schemas/embed.schema'

type EmbeddingsWithUserUUID = EmbedDto & {
  uuid: string
}

export class SearchEmbeddings
  implements UseCase<EmbeddingsWithUserUUID, SearchEmbeddingsResponseDto[]>
{
  private embeddingServiceUrl: string = process.env?.EMBEDDING_URL ?? ''

  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly embedRepository: EmbedRepository,
    private readonly httpClient: HttpClient,
  ) {}

  async execute({
    uuid,
    ...input
  }: EmbeddingsWithUserUUID): Promise<SearchEmbeddingsResponseDto[]> {
    const { text } = embedSchema.parse({
      text: input.text,
    })

    const collection = await this.collectionRepository.findByName('responses')
    if (!collection) {
      throw new Error('collection not found')
    }

    const {
      data: { vector },
    } = await this.httpClient.post<{ vector: number[] }>(
      this.embeddingServiceUrl,
      { text },
    )

    const list = await this.embedRepository.findByVector(uuid, vector)

    return list.map(({ id, vector, payload }) => ({
      id,
      vector,
      payload,
    }))
  }
}
