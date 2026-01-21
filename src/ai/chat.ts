import { embed } from './embedding'
import { ensureCollection, qdrant } from './qdrant'

export async function chat(tenant: string, question: string) {
  const collection = `tenant_${tenant}`

  await ensureCollection(collection)

  const vector = await embed(question)

  const result = await qdrant.search(collection, {
    vector,
    limit: 5,
    with_payload: true,
  })

  if (result.length === 0) {
    return { answer: 'Não encontrei nada sobre isso.' }
  }

  const context = result.map((r) => r.payload?.text).join('\n')

  return {
    answer: `Pergunta: ${question}\n\n${context}`,
  }
}
