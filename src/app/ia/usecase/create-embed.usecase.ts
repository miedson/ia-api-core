import type { HttpClient } from '@/app/common/interfaces/http-client'
import type { UseCase } from '@/app/common/interfaces/usecase'
import type { CollectionRepository } from '../repositories/collection.repository'
import type { EmbedRepository } from '../repositories/embed.repository'
import { type EmbedDto, embedSchema } from '../schemas/embed.schema'

type CreateEmbedWithUserUuid = EmbedDto & { uuid: string }

export class CreateEmbed implements UseCase<EmbedDto, void> {
  private embeddingServiceUrl: string = process.env?.EMBEDDING_URL ?? ''

  constructor(
    private readonly embedRepository: EmbedRepository,
    private readonly collectionRepository: CollectionRepository,
    private readonly httpClient: HttpClient,
  ) {}

  async execute({ uuid, ...input }: CreateEmbedWithUserUuid): Promise<void> {
    const { text } = embedSchema.parse({
      text: input.text,
    })

    const {
      data: { vector },
    } = await this.httpClient.post<{ vector: number[] }>(
      this.embeddingServiceUrl,
      { text },
    )

    if (vector) {
      await this.collectionRepository.create()
      await this.embedRepository.create(text, uuid, vector)
    }
  }
}
