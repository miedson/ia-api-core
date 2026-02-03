import type { HttpClient } from '@/app/common/interfaces/http-client'

export class EmbeddingService {
  private embeddingServiceUrl: string = process.env?.EMBEDDING_URL ?? ''

  constructor(private readonly httpClient: HttpClient) {}

  async text(value: string): Promise<number[]> {
    const {
      data: { vector },
    } = await this.httpClient.post<{ vector: number[] }>(
      this.embeddingServiceUrl,
      { text: value },
    )

    if (!vector) {
      throw new Error('Error generating vector')
    }

    return vector
  }
}
