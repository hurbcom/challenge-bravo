export interface IExternalSourceType {
    getExternalDollarValue: (currencyId: string) => Promise<number | null>;
}
