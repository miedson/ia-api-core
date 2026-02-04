import { Repository } from '@/app/common/interfaces/repository'
import type { Prisma, PrismaClient } from '@/generated/prisma/client'
import {
  type CreateOrganizationDto,
  createOrganizationSchema,
} from '../schemas/organization.schema'

type CreateOrganizationWithChatwoodIdDto = CreateOrganizationDto & {
  chatwootAccountId: number
}

export class OrganizationRepository extends Repository<
  PrismaClient | Prisma.TransactionClient
> {
  async create({
    name,
    document,
    domain,
    status,
    supportEmail,
    chatwootAccountId,
  }: CreateOrganizationWithChatwoodIdDto) {
    const data = createOrganizationSchema.parse({ name, document })

    return await this.dataSource.organization.create({
      data: {
        name: data.name,
        document: data.document,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        domain,
        status: status ?? 'active',
        supportEmail,
        chatwootAccountId,
      },
    })
  }

  async findByDocument(document: string) {
    return await this.dataSource.organization.findFirst({
      where: { document },
    })
  }

  async findByUserUUID(uuid: string) {
    return await this.dataSource.organization.findFirst({
      where: {
        users: {
          some: { public_id: uuid },
        },
      },
    })
  }
}
