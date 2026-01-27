import { z } from 'zod'
import { organizationResponseSchema } from '@/app/organization/schemas/organization.schema'

export const passwordSchema = z
  .string()
  .min(8, { error: 'Senha deve ter no mínimo 8 caracteres' })
  .max(128, { error: 'Senha deve ter no máximo 128 caracteres' })
  .regex(/[a-z]/, { error: 'Precisa de letra minúscula' })
  .regex(/[A-Z]/, { error: 'Precisa de letra maiúscula' })
  .regex(/[0-9]/, { error: 'Precisa de número' })
  .regex(/[^A-Za-z0-9]/, { error: 'Precisa de símbolo' })

export const userSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email().max(254),
  password: passwordSchema,
  organization: organizationResponseSchema,
})

export type UserDto = z.infer<typeof userSchema>

export const userResponseSchema = userSchema
  .omit({
    password: true,
  })
  .extend({
    uuid: z.string(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })

export type UserResponseDto = z.infer<typeof userResponseSchema>
