export interface BaseRepository<T> {
  create(entity: T): Promise<void>;
  find(id: string): Promise<T>;
}