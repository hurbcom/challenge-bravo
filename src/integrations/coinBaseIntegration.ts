import Axios from 'axios';

type CurrenciesResponse = {
    data: [
        {
            id: string;
            name: string;
            min_size: string;
        }
    ];
};

type ExchangeRate = {
    currency: string;
    rates: {
        [currency: string]: string;
    };
};

type CurrencyExchangeRateParams = {
    currency: string;
};

type CurrencyExchangeRateResponse = {
    data: ExchangeRate;
};

class CoinbaseIntegration {

    private static readonly EXCHANGE_RATE_ENDPOINT = 'exchange-rates';
    private static readonly CURRENCIES_ENDPOINT = 'currencies';

    constructor(private readonly baseUrl: string) {}

    public async getAvailableCurrencies(): Promise<string[]> {
        try {
            const { data } = await Axios.get<CurrenciesResponse>(
                `${this.baseUrl}/${CoinbaseIntegration.CURRENCIES_ENDPOINT}`
            );

            if (!data.data) {
                throw new Error('The API responded with an unexpected value.');
            }

            console.info(`The exchange API responded with: ${JSON.stringify(data)}`);

            const availableCurrencies: string[] = [];

            data.data.forEach((currency) => {
                availableCurrencies.push(currency.id);
            });

            return availableCurrencies;
        } catch (err) {
            console.error(`An error occured while trying to fetch the exchange rate. [${err}].`);
            throw err;
        }
    }

    public async exchange(baseCurrency: string): Promise<ExchangeRate> {
        const params: CurrencyExchangeRateParams = {
            currency: baseCurrency,
        };

        try {
            const { data } = await Axios.get<CurrencyExchangeRateResponse>(
                `${this.baseUrl}/${CoinbaseIntegration.EXCHANGE_RATE_ENDPOINT}`,
                {
                    params: params,
                }
            );

            console.info(`The exchange API responded with: ${JSON.stringify(data)}`);

            if (!data.data) {
                throw new Error('The API responded with an unexpected value.');
            }

            return data.data;
        } catch (err) {
            console.error(`An error occured while trying to fetch the exchange rate. [${err}].`);
            throw err;
        }
    }
}

export default CoinbaseIntegration;
