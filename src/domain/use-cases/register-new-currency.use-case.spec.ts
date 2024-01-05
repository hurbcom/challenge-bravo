import { when } from 'jest-when';
import { createMock } from 'ts-auto-mock';
import CurrencyEntity, { CurrencyEntityProps } from '../entities/currency.entity';
import CurrencyRepository from '../repositories/currency.repository';
import RegisterNewCurrencyCase from './register-new-currency.use-case';

describe('register new currency use case', () => {
    it('should register currency', async () => {
        // arrange
        const currencyEntityProps: CurrencyEntityProps = {
            name: 'Test',
            code: 'TES',
            codein: 'TES',
            bid: 1,
            isFictitious: true
        };

        const currencyRepositoryMock = createMock<CurrencyRepository>();
        const fn = jest.fn();
        when(fn)
            .calledWith(currencyEntityProps)
            .mockReturnValue(Promise.resolve(null))
        jest.spyOn(currencyRepositoryMock, 'findBy').mockImplementation(fn);

        jest.spyOn(currencyRepositoryMock, 'insert').mockImplementation(async () =>
            Promise.resolve(new CurrencyEntity({ _id: 'uuid', ...currencyEntityProps }))
        );

        const registerNewCurrencyUseCase = new RegisterNewCurrencyCase(currencyRepositoryMock);

        // act
        const newCurrency = await registerNewCurrencyUseCase.execute(currencyEntityProps);
        expect(newCurrency).toEqual({
            _id: 'uuid',
            name: 'Test',
            code: 'TES',
            codein: 'TES',
            bid: 1,
            isFictitious: true
        });
    });
});