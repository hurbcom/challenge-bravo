import Big from "big.js";
import Axios from "axios";

type ExchangeRate = {
    originalCurrency: string;
    finalCurrency: string;
    rate: Big;
}

type CurrencyExchangeRateParams = {
    function: string;
    from_currency: string;
    to_currency: string;
    apikey: string;
};

const REALTIME_CURRENCY_EXCHANGE_RATE_KEY = 'Realtime Currency Exchange Rate';
const FROM_CURRENCY_CODE_KEY = '1. From_Currency Code';
const TO_CURRENCY_CODE_KEY = '3. To_Currency Code';
const EXCHANGE_RATE_KEY = '5. Exchange Rate';

type CurrencyExchangeRateResponse = {
    [REALTIME_CURRENCY_EXCHANGE_RATE_KEY]: {
        [FROM_CURRENCY_CODE_KEY]: string,
        [TO_CURRENCY_CODE_KEY]: string,
        [EXCHANGE_RATE_KEY]: string,
    }
};

class AlphaVantageApiIntegration {

    private static readonly EXCHANGE_RATE_QUERY_FUNCTION = 'CURRENCY_EXCHANGE_RATE';

    private readonly baseURL : string;
    private readonly apiKey : string;

    constructor() {
        const { EXCHANGE_API_BASEURL = 'https://www.alphavantage.co/query', EXCHANGE_API_KEY = 'demo' } = process.env;

        this.baseURL = EXCHANGE_API_BASEURL;
        this.apiKey = EXCHANGE_API_KEY;
    }

    async exchange(originalCurrency: string, finalCurrency: string) : Promise<ExchangeRate> {
        const params : CurrencyExchangeRateParams = {
            function: AlphaVantageApiIntegration.EXCHANGE_RATE_QUERY_FUNCTION,
            from_currency: originalCurrency,
            to_currency: finalCurrency,
            apikey: this.apiKey
        };

        const res = await Axios.get<CurrencyExchangeRateResponse>(this.baseURL, { params: params }).then((res) => {
            if(!res.data[REALTIME_CURRENCY_EXCHANGE_RATE_KEY]) {
                throw new Error('The API responded with an unexpected value.');
            }

            return Promise.resolve(res);
        }).catch(err => {
            console.error(`An error occured while trying to fetch the exchange rate. [${err}].`);
            throw err;
        });

        return Promise.resolve({
            originalCurrency,
            finalCurrency,
            rate: Big(res.data[REALTIME_CURRENCY_EXCHANGE_RATE_KEY][EXCHANGE_RATE_KEY])
        });
    }
}

export default AlphaVantageApiIntegration;
