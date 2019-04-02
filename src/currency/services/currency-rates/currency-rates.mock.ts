export class CurrencyRatesServiceMock {
    readonly externalApiRatesUrl = '';

    async getRates() {
        return [];
    }
}
