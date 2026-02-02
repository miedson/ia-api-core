import type { QdrantClient } from '@qdrant/js-client-rest'
import { Repository } from '@/app/common/interfaces/repository'

export class CollectionRepository extends Repository<QdrantClient> {
  async create(name: string) {
    const { collections } = await this.dataSource.getCollections()
    const collection = collections.find((item) => item.name === name)
    if (!collection) {
      await this.dataSource.createCollection(name, {
        vectors: { size: 384, distance: 'Cosine' },
      })
    }
  }
}
