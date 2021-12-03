
export interface RemoveCurrency{
    delete (shortName:string): Promise<boolean>
}
