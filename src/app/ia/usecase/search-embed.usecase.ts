import type { UseCase } from '@/app/common/interfaces/usecase'
import type { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import type { CollectionRepository } from '../repositories/collection.repository'
import type { EmbedRepository } from '../repositories/embed.repository'
import {
  type EmbedDto,
  embedSchema,
  type SearchEmbeddingsResponseDto,
} from '../schemas/embed.schema'
import type { EmbeddingService } from '../services/embedding.service'

type EmbeddingsWithUserUUID = EmbedDto & {
  uuid: string
}

export class SearchEmbeddings
  implements UseCase<EmbeddingsWithUserUUID, SearchEmbeddingsResponseDto[]>
{
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly embedRepository: EmbedRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly embeddingService: EmbeddingService,
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

    const vector = await this.embeddingService.text(text)
    const organization = await this.organizationRepository.findByUserUUID(uuid)

    if (!organization) {
      throw new Error('User orgnization not found')
    }

    const list = await this.embedRepository.findByVector(
      organization.publicId,
      vector,
    )

    return list.map(({ id, vector, payload }) => ({
      id,
      vector,
      payload,
    }))
  }
}
