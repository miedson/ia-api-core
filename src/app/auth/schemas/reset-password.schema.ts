import { passwordSchema } from '@/app/users/schemas/user-request.schema'
import z from 'zod'

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
})

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
