
import FakeCurrencyRepository from '../repositories/fakes/FakeCurrencyRepository'

import ConvertCurrencyService from './ConvertCurrencyService';

let fakeCurrencyRepository: FakeCurrencyRepository;
let convertCurrency: ConvertCurrencyService;


describe('ConvertCurrency', () => {
    beforeEach(() => {
        fakeCurrencyRepository = new FakeCurrencyRepository();
        convertCurrency = new ConvertCurrencyService(
            fakeCurrencyRepository
        )
    })

    it('should be able to compare currencies', async () => {
        const result = await convertCurrency.execute('BRL','USD', 100);
        expect(result).toBe(18.3621);
    });
})

