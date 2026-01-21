import type { PrismaClient } from '@/generated/prisma/client'
import {
  type OrganizationDto,
  organizationSchema,
} from '../schemas/organization.schema'

export class OrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    name,
    document,
  }: OrganizationDto): Promise<{ organizationId: number }> {
    const data = organizationSchema.parse({ name, document })
    const organization = await this.prisma.organization.create({
      data: {
        name: data.name,
        document: data.document,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })

    return { organizationId: organization.id }
  }
}
