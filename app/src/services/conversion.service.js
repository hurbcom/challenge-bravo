import { getRatesFromApi as getRates } from './external/exchangeRateApi';

export default class ConversionService { 
    
    constructor(exchangeRatesApi) {
        this._getRates = exchangeRatesApi || getRates;
    }

    async calculateExchangeRate({ from, to, amount, reference }) {
        const conversion = await this._getRates({ from, to, reference });
        
        const rate = (conversion[to] / conversion[from]);
        
        return {
            [from]: amount,
            [to]: amount * rate,
            [reference]: (1 / conversion[from]) * amount
        };
    }
}