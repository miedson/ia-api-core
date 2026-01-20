export interface Jwt {
    sign(payload: object, expiresIn: string | number): string;
    verify(token: string): object | null;
}