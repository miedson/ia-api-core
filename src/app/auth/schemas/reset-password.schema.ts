import z from 'zod'
import { passwordSchema } from '@/app/users/schemas/user.schema'

export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
})

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
