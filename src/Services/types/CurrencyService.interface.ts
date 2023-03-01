export interface ICurrencyService {
    getConversion: (
        originCurrencyId: string,
        outCurrencyId: string,
        amount: number
    ) => Promise<{ total: number }>;
}
