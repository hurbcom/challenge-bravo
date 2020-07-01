
export default interface ICurrencyRepository {
    timestamp(): Promise<void>;
    save(name: string, value: number): Promise<void>;
    recover<T>(key: string): Promise<T | void>;
    invalidate(key: string): Promise<void>;
}