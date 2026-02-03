import type { QdrantClient } from '@qdrant/js-client-rest'
import { Repository } from '@/app/common/interfaces/repository'

export const COLLECTION_DEFAULT_NAME = 'responses'

export class CollectionRepository extends Repository<QdrantClient> {
  async create(name?: string) {
    const collection = await this.findByName(name ?? COLLECTION_DEFAULT_NAME)
    if (!collection) {
      await this.dataSource.createCollection(name ?? COLLECTION_DEFAULT_NAME, {
        vectors: { size: 384, distance: 'Cosine' },
      })
    }
  }

  async findByName(name: string) {
    const { collections } = await this.dataSource.getCollections()
    return collections.find((item) => item.name === name)
  }
}
