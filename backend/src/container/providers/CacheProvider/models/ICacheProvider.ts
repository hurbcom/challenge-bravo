export interface ICacheProvider {
  save(key: string, value: unknown, expiresIn?: Date): Promise<void>;

  recover<T>(key: string): Promise<{ data: T; expiresIn?: Date } | null>;

  invalidate(key: string): Promise<void>;

  invalidatePrefix(prefix: string, fullPattern?: string): Promise<void>;
}
