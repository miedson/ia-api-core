import z from 'zod'

export const embedSchema = z.object({
  text: z.string(),
})

export type EmbedDto = z.infer<typeof embedSchema>

export const searchEmbeddingsResponseSchema = z.object({
  id: z.union([z.number(), z.string()]),
  vector: z.any().optional(),
  payload: z.any().optional(),
})

export type SearchEmbeddingsResponseDto = z.infer<
  typeof searchEmbeddingsResponseSchema
>
