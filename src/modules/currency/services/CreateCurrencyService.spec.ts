
import FakeCurrencyRepository from '../repositories/fakes/FakeCurrencyRepository'

import CreateCurrencyService from './CreateCurrencyService';

let fakeCurrencyRepository: FakeCurrencyRepository;
let createCurrency: CreateCurrencyService;


describe('CreateCurrency', () => {
    beforeEach(() => {
        fakeCurrencyRepository = new FakeCurrencyRepository();
        createCurrency = new CreateCurrencyService(
            fakeCurrencyRepository
        )
    })

    it('should be able to create a new currency', async () => {
        const currency = await createCurrency.execute('HCN', 10);
        expect(currency).toHaveProperty('name');
    });

    it('should be able to remove a currency', async () => {
        await fakeCurrencyRepository.invalidate('BRL');
        const currency = fakeCurrencyRepository.recover('BRL');
        expect(currency).toBeUndefined;
    });


})

