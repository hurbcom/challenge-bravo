
export default interface IRedisProvider {
    timestamp(key: string, value: number): Promise<void>;
    save(key: string, value: any): Promise<void>;
    recover<T>(key: string): Promise<T | void>;
    invalidate(key: string): Promise<void>;
}