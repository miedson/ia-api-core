import { Jwt } from '@/app/common/interfaces/jwt'

export class FastifyJwtAdapter implements Jwt {
    sign(payload: object, expiresIn: string | number): string {
        throw new Error('Method not implemented.')
    }
    verify(token: string): object | null {
        throw new Error('Method not implemented.')
    }
}