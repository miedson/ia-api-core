import { z } from 'zod'

export const authRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export type AuthRequestDto = z.infer<typeof authRequestSchema>
