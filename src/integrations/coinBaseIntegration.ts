import Axios from "axios";

type CurrenciesResponse = {
    data: [
        {
            id: string,
            name: string,
            min_size: string
        }
    ]
};

type ExchangeRate = {
    currency: string,
    rates: {
        [currency: string]: string
    }
}

type CurrencyExchangeRateParams = {
    currency: string;
};

type CurrencyExchangeRateResponse = {
    data: ExchangeRate
};

class CoinbaseIntegration {

    private readonly baseURL : string;

    private static readonly EXCHANGE_RATE_ENDPOINT = 'exchange-rates';
    private static readonly CURRENCIES_ENDPOINT = 'currencies';

    constructor() {
        const { EXCHANGE_API_BASEURL = 'https://api.coinbase.com/v2' } = process.env;

        this.baseURL = EXCHANGE_API_BASEURL;
    }

    public async getAvailableCurrencies() : Promise<string[]> {
        try{
            const { data } = await Axios.get<CurrenciesResponse>(`${this.baseURL}/${CoinbaseIntegration.CURRENCIES_ENDPOINT}`);

            if(!data.data) {
                throw new Error('The API responded with an unexpected value.');
            }

            console.info(`The exchange API responded with: ${JSON.stringify(data)}`);

            const availableCurrencies: string[] = [];

            data.data.forEach((currency) => {
                availableCurrencies.push(currency.id);
            })

            return availableCurrencies;
        } catch(err) {
            console.error(`An error occured while trying to fetch the exchange rate. [${err}].`);
            throw err;
        }
    }

    public async exchange(baseCurrency: string) : Promise<ExchangeRate> {
        const params : CurrencyExchangeRateParams = {
            currency: baseCurrency
        };

        try{
            const { data } = await Axios.get<CurrencyExchangeRateResponse>(`${this.baseURL}/${CoinbaseIntegration.EXCHANGE_RATE_ENDPOINT}`, { params: params });

            if(!data.data) {
                throw new Error('The API responded with an unexpected value.');
            }

            console.info(`The exchange API responded with: ${JSON.stringify(data)}`);

            return data.data;
        } catch(err) {
            console.error(`An error occured while trying to fetch the exchange rate. [${err}].`);
            throw err;
        }
    }
}

export default new CoinbaseIntegration();
