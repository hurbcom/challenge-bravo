import got from 'got';
import { environment } from '../environment';
import { injectable } from 'inversify';

@injectable()
export class FreeCurrencyApiService {
    
    public async GetUpdatedExchangeRateByCurrencyId(currencyId: string): Promise<number> {
        const response = await got.get(`${environment.externalServices.currencyApiUrl}?q=USD_${currencyId}&compact=ultra&apiKey=${environment.externalServices.currencyApiKey}`);

        if (response.statusCode == 200) 
            return JSON.parse(response.body)[`USD_${currencyId}`];
        else 
            throw new Error('Currency not found');
    }
}