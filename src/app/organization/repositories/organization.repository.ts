import { Repository } from '@/app/common/interfaces/repository'
import {
  type CrateOrganizationDto,
  createOrganizationSchema,
} from '../schemas/organization.schema'

export class OrganizationRepository extends Repository {
  async create({ name, document }: CrateOrganizationDto) {
    const data = createOrganizationSchema.parse({ name, document })
    return await this.dataSource.organization.create({
      data: {
        name: data.name,
        document: data.document,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      },
    })
  }

  async findByDocument(document: string) {
    return await this.dataSource.organization.findFirst({
      where: { document },
    })
  }
}
