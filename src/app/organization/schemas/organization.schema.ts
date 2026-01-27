import z from 'zod'
import { validateCNPJ, validateCPF } from '@/app/common/helpers'

export const organizationSchema = z.object({
  name: z.string(),
  document: z
    .string()
    .refine((value) => validateCPF(value) || validateCNPJ(value), {
      message: 'Documento inválido (CPF ou CNPJ)',
    }),
})

export type OrganizationDto = z.infer<typeof organizationSchema>

export const organizationResponseSchema = organizationSchema.extend({
  id: z.number(),
  uuid: z.string(),
  slug: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type OrganizationResponseDto = z.infer<typeof organizationResponseSchema>
