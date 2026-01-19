export interface Repository<T> {
    findAll(data: T): Promise<T[]>
    findbyId(id: number): Promise<T>
    create(data: T): Promise<T>
    update(data: T): Promise<void>
    delete(id: number | string): Promise<void>
}