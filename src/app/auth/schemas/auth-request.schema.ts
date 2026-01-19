import {z} from 'zod'

export const authRequestSchema = z.object({
    user: z.string(),
    password: z.string()
});


export type AuthRequestDto = z.infer<typeof authRequestSchema>