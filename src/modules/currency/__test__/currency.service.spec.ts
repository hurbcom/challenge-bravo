import { Test, TestingModule } from '@nestjs/testing';

import { CurrencyQuoteDto } from '../../_common/dto/currency-quote.dto';
import { CurrencyRepository } from '../repositories/currency.repository';
import { CurrencyService } from '../services/currency.service';

import { currencyDataMock, newCurrencyMock } from './mocks/data/currency.data.mock';
import { currencyRepositoryMock } from './mocks/repositories/currencyRepositoryMock';

describe('CurrencyService', () => {
    let currencyService: CurrencyService;
    let currencyRepository: CurrencyRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CurrencyService,
                {
                    provide: CurrencyRepository,
                    useValue: currencyRepositoryMock,
                },
            ],
        }).compile();

        currencyService = module.get<CurrencyService>(CurrencyService);
        currencyRepository = module.get<CurrencyRepository>(CurrencyRepository);
    });

    it('should be defined', () => {
        expect(currencyService).toBeDefined();
        expect(currencyRepository).toBeDefined();
    });

    it('should list all currencies', async () => {
        const result = await currencyService.getCurrency();
        expect(currencyRepository.getCurrencies).toBeCalledTimes(1);
        expect(result).toBe(currencyDataMock);
    });

    it('should list a currency by id', async () => {
        const result = await currencyService.getCurrencyById(currencyDataMock[0].id);
        expect(currencyRepository.findOneBy).toBeCalled();
        expect(result).toBe(currencyDataMock[0]);
    });

    it('should list a currency by code', async () => {
        const result = await currencyService.getCurrencyByCode(currencyDataMock[3].code);
        expect(currencyRepository.findOneBy).toBeCalled();
        expect(result).toBe(currencyDataMock[3]);
    });

    it('should create a currency', async () => {
        const currencyMock = newCurrencyMock();
        await currencyService.createCurrency(currencyMock);
        expect(currencyRepository.addCurrency).toBeCalledTimes(1);
        expect(currencyDataMock[currencyDataMock.length - 1]).toBe(currencyMock);
    });

    it('should update a currency', async () => {
        await currencyService.updateCurrency(currencyDataMock[0].id, { name: 'updated' });
        expect(currencyRepository.updateCurrency).toBeCalledTimes(1);
        expect(currencyDataMock[0].name).toBe('updated');
    });

    it('should delete a currency', async () => {
        await currencyService.deleteCurrency(currencyDataMock[0].id);
        expect(currencyRepository.softDeleteById).toBeCalled();
        expect(currencyDataMock[0].isActive).toBe(false);
    });

    it('should update quote data', async () => {
        const quotes: CurrencyQuoteDto[] = [
            { code: 'USD', ratio: 1 },
            { code: 'BRL', ratio: 0.2 },
        ];
        await currencyService.updateQuotes(quotes);
        expect(currencyRepository.updateCurrencyQuotes).toBeCalled();
    });
});
