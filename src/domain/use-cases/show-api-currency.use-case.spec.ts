import { createMock } from "ts-auto-mock";
import CurrencyRepository from "../repositories/currency.repository";
import { CurrencyApiResponseDto } from "../entities/dto/currency-api-response.dto";
import ShowApiCurrencyUseCase from "./show-api-currency.use-case";


describe('Update Currency', () => {
    it('should show a currency', async () => {
        // arrange
        const currencyResponseDtoMock: CurrencyApiResponseDto = {
            _id: "",
            code: "",
            codein: "",
            name: "",
            high: "",
            low: "",
            varBid: "",
            pctChange: "",
            bid: "",
            ask: "",
            timestamp: "",
            created_at: ""
        };

        const currencyRepositoryMock = createMock<CurrencyRepository>();
        const showCurrencyUseCase = new ShowApiCurrencyUseCase(currencyRepositoryMock);

        // act
        await showCurrencyUseCase.execute('USD')
    });
})