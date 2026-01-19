import { z } from 'zod'
import { organizationSchema } from '@/app/organization/schemas/organization.schema'

export const userSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().optional(),
  organization: organizationSchema
})

export type UserDto = z.infer<typeof userSchema>
