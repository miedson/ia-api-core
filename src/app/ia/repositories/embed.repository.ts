import type { QdrantClient } from '@qdrant/js-client-rest'
import { Repository } from '@/app/common/interfaces/repository'
import { randomUUID } from 'node:crypto'
import { COLLECTION_DEFAULT_NAME } from './collection.repository'

export class EmbedRepository extends Repository<QdrantClient> {
  async create(
    text: string,
    organizationUUID: string,
    vector: number[],
    collectionName?: string,
  ) {
    await this.dataSource.upsert(collectionName ?? COLLECTION_DEFAULT_NAME, {
      points: [
        {
          id: randomUUID(),
          vector,
          payload: {
            text,
            organization: organizationUUID,
          },
        },
      ],
    })
  }

  async findByVector(
    organizationUUID: string,
    vector: number[],
    limit?: number,
    collectionName?: string,
  ) {
    return await this.dataSource.search(
      collectionName ?? COLLECTION_DEFAULT_NAME,
      {
        vector,
        limit: limit ?? 5,
        score_threshold: 0.6,
        filter: {
          must: [
            {
              key: 'organization',
              match: { value: organizationUUID },
            },
          ],
        },
        with_payload: true,
      },
    )
  }
}
