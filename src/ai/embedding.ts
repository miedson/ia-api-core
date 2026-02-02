export async function embed(text: string): Promise<number[]> {
  const embeddingService = process.env.EMBEDDING_URL ?? ''

  const res = await fetch(embeddingService, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  const json: any = await res.json()
  return json.vector
}
