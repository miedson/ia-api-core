import type { PrismaClient } from '@/generated/prisma/client'
import {
  type CrateOrganizationDto,
  createOrganizationSchema,
} from '../schemas/organization.schema'

export class OrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({ name, document }: CrateOrganizationDto) {
    const data = createOrganizationSchema.parse({ name, document })
    return await this.prisma.organization.create({
      data: {
        name: data.name,
        document: data.document,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }
}
