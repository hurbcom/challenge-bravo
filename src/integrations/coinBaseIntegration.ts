import Axios from "axios";

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

    constructor() {
        const { EXCHANGE_API_BASEURL = 'https://api.coinbase.com/v2/exchange-rates' } = process.env;

        this.baseURL = EXCHANGE_API_BASEURL;
    }

    public async exchange(baseCurrency: string) : Promise<ExchangeRate> {
        const params : CurrencyExchangeRateParams = {
            currency: baseCurrency
        };

        const res = await Axios.get<CurrencyExchangeRateResponse>(this.baseURL, { params: params }).then((res) => {
            if(!res.data.data) {
                throw new Error('The API responded with an unexpected value.');
            }

            return Promise.resolve(res);
        }).catch(err => {
            console.error(`An error occured while trying to fetch the exchange rate. [${err}].`);
            throw err;
        });

        console.info(`The exchange API responded with: ${JSON.stringify(res.data)}`);

        return Promise.resolve(res.data.data);
    }
}

export default new CoinbaseIntegration();
