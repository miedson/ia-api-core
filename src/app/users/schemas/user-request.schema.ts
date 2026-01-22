import { z } from 'zod'
import { organizationSchema } from '@/app/organization/schemas/organization.schema'

export const userRequestSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email().max(254),
  password: z
    .string()
    .min(8, { error: 'Senha deve ter no mínimo 8 caracteres' })
    .max(128, { error: 'Senha deve ter no máximo 128 caracteres' })
    .regex(/[a-z]/, { error: 'Precisa de letra minúscula' })
    .regex(/[A-Z]/, { error: 'Precisa de letra maiúscula' })
    .regex(/[0-9]/, { error: 'Precisa de número' })
    .regex(/[^A-Za-z0-9]/, { error: 'Precisa de símbolo' }),
  organization: organizationSchema,
})

export type UserRequestDto = z.infer<typeof userRequestSchema>
