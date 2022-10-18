import { BadRequestException, CACHE_MANAGER, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CoinbaseApiService } from '../../../libraries/quote/quote-services/coinbase-api.service';
import { currencyRepositoryMock } from '../../currency/__test__/mocks/repositories/currencyRepositoryMock';
import { currencyServiceMock } from '../../currency/__test__/mocks/services/currency.service.mock';
import { CurrencyRepository } from '../../currency/repositories/currency.repository';
import { CurrencyService } from '../../currency/services/currency.service';
import { ConversionController } from '../controllers/conversion.controller';
import { ConversionService } from '../services/conversion.service';

import { conversionDataMock } from './mocks/data/conversion.data.mock';

describe('ConversionController', () => {
    let controller: ConversionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConversionController],
            providers: [
                ConversionService,
                {
                    provide: CurrencyService,
                    useValue: currencyServiceMock,
                },
                {
                    provide: CurrencyRepository,
                    useValue: currencyRepositoryMock,
                },
                {
                    provide: CoinbaseApiService,
                    useValue: {
                        getQuotes: jest.fn().mockImplementation(() => {
                            return Promise.resolve(conversionDataMock);
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

        controller = module.get<ConversionController>(ConversionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should throw not found with invalid currency', async () => {
        const params = {
            from: 'invalid',
            to: 'BRL',
            amount: 1,
        };
        expect(await controller.convert(params)).toEqual(new NotFoundException());
    });
});
