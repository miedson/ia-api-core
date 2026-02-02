import z from 'zod'

export const createEmbedSchema = z.object({
  id: z.number(),
  text: z.string(),
})

export type CreateEmbedDto = z.infer<typeof createEmbedSchema>
