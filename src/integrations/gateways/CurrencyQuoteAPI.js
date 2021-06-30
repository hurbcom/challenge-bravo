import Fetch from '../../libs/Fetch';

export default class CurrencyQuoteAPI {
    constructor (CurrencyMapper) {
        this.CurrencyMapper = CurrencyMapper;
        this.baseURL = 'https://economia.awesomeapi.com.br/json/last/';
    }

    _generateUrl (backingCurrencyCode, currenciesCodes) {
        return currenciesCodes.reduce((acc, value) => acc += `${value}-${backingCurrencyCode},`, this.baseURL).slice(0, -1);
    }

    async listCurrenciesQuoteByCode (backingCurrencyCode, currenciesCodes) {
        const fetchURL = this._generateUrl(backingCurrencyCode, currenciesCodes);

        try {
            const resObj = await Fetch.get(fetchURL);
            const currenciesList = Object.values(resObj);

            return currenciesList.map(currency => this.CurrencyMapper.toDTO(currency));
        } catch (err) {
            throw err;
        }
    }
}