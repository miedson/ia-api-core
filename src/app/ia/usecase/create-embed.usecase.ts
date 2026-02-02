import type { HttpClient } from '@/app/common/interfaces/http-client'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { CollectionRepository } from '../repositories/collection.repository'
import type { EmbedRepository } from '../repositories/embed.repository'
import { createEmbedSchema, type CreateEmbedDto } from '../schemas/embed.schema'

type CreateEmbedWithUserUuid = CreateEmbedDto & { uuid: string }

export class CreateEmbed implements UseCase<CreateEmbedDto, void> {
  private embeddingServiceUrl: string = process.env?.EMBEDDING_URL ?? ''

  constructor(
    private readonly embedRepository: EmbedRepository,
    private readonly collectionRepository: CollectionRepository,
    private readonly httpClient: HttpClient,
  ) {}

  async execute({ uuid, ...input }: CreateEmbedWithUserUuid): Promise<void> {
    const { id, text } = createEmbedSchema.parse({
      id: input.id,
      text: input.text,
    })

    const {
      data: { vector },
    } = await this.httpClient.post<{ vector: number[] }>(
      this.embeddingServiceUrl,
      { text },
    )

    if (vector) {
      await this.collectionRepository.create(uuid)
      await this.embedRepository.create(id, text, uuid, vector)
    }
  }
}
