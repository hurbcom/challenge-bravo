import { when } from "jest-when";
import { createMock } from "ts-auto-mock";
import CurrencyEntity, { CurrencyEntityProps } from "../../entities/currency.entity";
import CurrencyRepository from "../../repositories/currency.repository";
import UpdateCurrencyUseCase from "../update-currency.use-case";


describe('Update Currency', () => {
    it('should update currency', async () => {
        // arrange
        const currencyEntityProps: CurrencyEntityProps = {
            name: "USD",
            code: "USD",
            codein: "USD",
            bid: 1,
            isFictitious: false
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

        const updateCurrencyUseCase = new UpdateCurrencyUseCase(currencyRepositoryMock);

        // act
        await updateCurrencyUseCase.execute(currencyEntityProps);
    });
})