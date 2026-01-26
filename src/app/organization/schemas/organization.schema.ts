import z from 'zod'
import { validateCNPJ, validateCPF } from '@/app/common/helpers'

export const organizationSchema = z.object({
  id: z.number().optional().nullable(),
  uuid: z.string().optional().nullable(),
  name: z.string(),
  document: z
    .string()
    .refine((value) => validateCPF(value) || validateCNPJ(value), {
      message: 'Documento inválido (CPF ou CNPJ)',
    }),
  slug: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type OrganizationDto = z.infer<typeof organizationSchema>
