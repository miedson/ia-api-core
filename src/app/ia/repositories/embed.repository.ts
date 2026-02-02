import type { QdrantClient } from '@qdrant/js-client-rest'
import { Repository } from '@/app/common/interfaces/repository'

export class EmbedRepository extends Repository<QdrantClient> {
  async create(id: number, text: string, uuid: string, vector: number[]) {
    await this.dataSource.upsert(uuid, {
      points: [
        {
          id,
          vector,
          payload: {
            text,
          },
        },
      ],
    })
  }
}
