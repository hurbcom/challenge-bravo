import { createMock } from "ts-auto-mock";
import CurrencyRepository from "../../repositories/currency.repository";
import ShowCurrencyUseCase from "../show-currency.use-case";
import { CurrencyResponseDto } from "../../entities/dto/currency-response.dto";


describe('Update Currency', () => {
    it('should show a currency', async () => {
        // arrange
        const currencyResponseDtoMock: CurrencyResponseDto = {
            name: "USD",
            code: "USD",
            codein: "USD",
            bid: 1,
            _id: "uuid",
            isFictitious: false,
            timestamp: "",
            created_at: ""
        };

        const currencyRepositoryMock = createMock<CurrencyRepository>();
        const showCurrencyUseCase = new ShowCurrencyUseCase(currencyRepositoryMock);

        // act
        await showCurrencyUseCase.execute(currencyResponseDtoMock)
        expect(currencyRepositoryMock.findBy).toHaveBeenCalledTimes(1)
    });
})