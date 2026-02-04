import type { HttpClient } from '@/app/common/interfaces/http-client'
import type { CreateOrganizationDto } from '@/app/organization/schemas/organization.schema'
import type { Roles } from '@/generated/prisma/enums'
import type { CreateUserDto } from '../../schemas/user.schema'

type AttachUserAccountDto = {
  accountId: number
  userId: number
  role: Roles
}

export class ChatwootService {
  private apiUrl = process.env.CHATWOOT_API_URL ?? ''
  private apiKey = process.env.CHATWOOT_API_TOKEN ?? ''
  private headers = {
    'Content-Type': 'application/json',
    api_access_token: this.apiKey,
  }

  constructor(private readonly httpClient: HttpClient) {}

  async createAccount({
    name,
    domain,
    supportEmail,
    status,
  }: CreateOrganizationDto) {
    const { data } = await this.httpClient.post<{ id: number }>(
      `${this.apiUrl}/accounts`,
      {
        name,
        domain,
        support_email: supportEmail,
        locale: 'pt_BR',
        status,
        limits: {},
        custom_attributes: {},
      },
      {
        headers: this.headers,
      },
    )

    return { accountId: data.id }
  }

  async createUser({
    name,
    displayName,
    email,
    password,
  }: Omit<CreateUserDto, 'organization'>) {
    const { data } = await this.httpClient.post<{ id: number }>(
      `${this.apiUrl}/users`,
      {
        name,
        display_name: displayName,
        email,
        password,
        custom_attributes: {},
      },
      {
        headers: {
          'Content-Type': 'application/json',
          api_access_token: this.apiKey,
        },
      },
    )

    return { userId: data.id }
  }

  async attachUserAccount({ userId, accountId, role }: AttachUserAccountDto) {
    await this.httpClient.post(
      `${this.apiUrl}/accounts/${accountId}/account_users`,
      { user_id: userId, role },
      {
        headers: this.headers,
      },
    )
  }

  async provisionAccountWithUser(user: CreateUserDto, role: Roles) {
    const { accountId } = await this.createAccount(user.organization)
    const { userId } = await this.createUser(user)

    await this.attachUserAccount({
      accountId,
      userId,
      role,
    })

    return {
      accountId,
      userId,
      role,
    }
  }
}
