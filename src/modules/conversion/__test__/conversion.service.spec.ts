import { CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CoinbaseApiService } from '../../../libraries/quote/quote-services/coinbase-api.service';
import { currencyServiceMock } from '../../currency/__test__/mocks/services/currency.service.mock';
import { CurrencyService } from '../../currency/services/currency.service';
import { ConversionService } from '../services/conversion.service';

import { conversionDataMock } from './mocks/data/conversion.data.mock';
import { quotesDataMock } from './mocks/data/quotes.data.mock';
import { conversionServiceMock } from './mocks/services/conversionServiceMock';

describe('ConversionService', () => {
    let service: ConversionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConversionService,
                {
                    provide: CurrencyService,
                    useValue: currencyServiceMock,
                },
                {
                    provide: CoinbaseApiService,
                    useValue: {
                        getQuotes: jest.fn().mockImplementation(() => {
                            return Promise.resolve(quotesDataMock);
                        }),
                    },
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: {
                        get: () => null,
                        set: () => jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ConversionService>(ConversionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should convert from USD to BRL', async () => {
        const params = {
            from: 'USD',
            to: 'BRL',
            amount: 1,
        };
        const conversionCalc = conversionDataMock[1].ratio / conversionDataMock[0].ratio;
        const response = await service.convert(params);
        if (!(response instanceof NotFoundException)) {
            expect(service.convert).toBeCalled();
            expect(response.amount).toEqual(conversionCalc);
        }
    });
});
