import z from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'E-mail obrigátorio' }),
})

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>
