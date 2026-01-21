import { organizationSchema } from '@/app/organization/schemas/organization.schema'
import { z } from 'zod'

export const userResponseSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1).max(120),
  email: z.email().max(254),
  organization: organizationSchema,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type UserResponseDto = z.infer<typeof userResponseSchema>
