import z from "zod";

export const authResponseSchema = z.object({
    token: z.string()
});

export type AuthResponseDto = z.infer<typeof authResponseSchema>