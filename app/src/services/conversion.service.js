import { getRatesFromApi as getRates } from './external/exchangeRateApi';
import { instance as redis } from '../databases/redis';

export default class ConversionService { 
    
    constructor(exchangeRatesApi) {
        this._getRates = exchangeRatesApi || getRates;
    }

    async calculateExchangeRate({ from, to, amount, reference }) {
        const cacheKey = `external-${from}-${to}`;
        
        const cached = await redis.client.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const conversion = await this._getRates({ from, to, reference });
        await redis.client.set(cacheKey, JSON.stringify(conversion), 'EX', 20);

        const rate = (conversion[to] / conversion[from]);
        
        return {
            [from]: amount,
            [to]: amount * rate,
            [reference]: (1 / conversion[from]) * amount
        };
    }
}