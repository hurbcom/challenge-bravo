export interface ICache {
 
    save(key: string, value: any, expiryTimeInSeconds: number): Promise<void> ;

    recover<T>(key: string): Promise<T | null> ;

    delete(key: string): Promise<void> ;

    disconect():any
}