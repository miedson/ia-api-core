import {z} from 'zod'

export const organizationSchema = z.object({
    id: z.number().optional().nullable(),
    name: z.string(),
    document: z.string()
})

export type OrganizationDto = z.infer<typeof organizationSchema>