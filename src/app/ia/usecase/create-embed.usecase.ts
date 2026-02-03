import type { UseCase } from '@/app/common/interfaces/usecase'
import type { OrganizationRepository } from '@/app/organization/repositories/organization.repository'
import type { CollectionRepository } from '../repositories/collection.repository'
import type { EmbedRepository } from '../repositories/embed.repository'
import { type EmbedDto, embedSchema } from '../schemas/embed.schema'
import type { EmbeddingService } from '../services/embedding.service'

type CreateEmbedWithUserUuid = EmbedDto & { uuid: string }

export class CreateEmbed implements UseCase<EmbedDto, void> {
  constructor(
    private readonly embedRepository: EmbedRepository,
    private readonly collectionRepository: CollectionRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async execute({ uuid, ...input }: CreateEmbedWithUserUuid): Promise<void> {
    const { text } = embedSchema.parse({
      text: input.text,
    })

    const vector = await this.embeddingService.text(text)
    const organization = await this.organizationRepository.findByUserUUID(uuid)

    if (!organization) {
      throw new Error('User orgnization not found')
    }

    await this.collectionRepository.create()
    await this.embedRepository.create(text, organization.publicId, vector)
  }
}
