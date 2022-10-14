export interface BaseRepository<T> {
  create(entity: T): Promise<void>;
}