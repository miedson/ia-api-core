import { PrismaClient, User } from "@/generated/prisma/client";
import { UserDto, userSchema } from "../schemas/user.schema";

type CreateUserDto = UserDto & {passwordHash: string}

export class UserRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async create({ name, email, password, organization, passwordHash}: CreateUserDto) {
        const data = userSchema.parse({ name, email, password, organization})
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: passwordHash,
                organizationId: organization.id!
            }
        })
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })
        
        if (!user) {
            return null;
        }

        return user;
    }
}