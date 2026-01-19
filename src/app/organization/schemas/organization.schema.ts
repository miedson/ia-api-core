import {z} from 'zod'

export const organizationSchema = z.object({
    name: z.string(),
    document: z.string()
})

export type OrganizationDto = z.infer<typeof organizationSchema>