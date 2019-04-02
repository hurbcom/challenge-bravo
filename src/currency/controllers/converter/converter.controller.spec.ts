import { CurrencyDto } from '../../dto/currency.dto';
import { CurrencyConverterService } from '../../services/currency-converter/currency-converter.service';
import { CurrencyRatesServiceMock } from '../../services/currency-rates/currency-rates.mock';
import { ConverterController } from './converter.controller';

describe('Converter Controller', () => {
    let converterController: ConverterController;
    let currencyConverterService: CurrencyConverterService;
    let currencyRatesServiceMock: CurrencyRatesServiceMock;

    beforeEach(async () => {
        currencyRatesServiceMock = new CurrencyRatesServiceMock();
        currencyConverterService = new CurrencyConverterService(
            currencyRatesServiceMock as any,
        );
        converterController = new ConverterController(currencyConverterService);
    });

    it('should call and return expected value', () => {
        const query = {
            from: 'USD',
            to: 'BRL',
            amount: 100,
        } as CurrencyDto;

        const convertedAmount = 387;

        const expectedResponse = {
            from: query.from,
            to: query.to,
            convertedAmount,
        };

        jest.spyOn(currencyConverterService, 'convert').mockImplementation(
            () => new Promise(resolve => resolve(convertedAmount)),
        );

        expect(converterController.convert(query)).resolves.toEqual(
            expectedResponse,
        );
        expect(currencyConverterService.convert).toHaveBeenCalledWith(
            query.from,
            query.to,
            query.amount,
        );
    });
});
