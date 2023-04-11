import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { HttpModule } from '@nestjs/axios';
import {
    ResponseQuotationDtoStub,
    ResponseCurrencyDtoStub,
} from '../../../test/stubs';

import { CreateFictitiumDto } from './dto';

const responseCurrencyList = [
    ResponseCurrencyDtoStub(),
    ResponseCurrencyDtoStub(),
    ResponseCurrencyDtoStub(),
];

describe('CurrencyController', () => {
    let currencyController: CurrencyController;
    let currencyService: CurrencyService;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [CurrencyController],
            providers: [
                {
                    provide: CurrencyService,
                    useValue: {
                        quotation: jest
                            .fn()
                            .mockResolvedValue(ResponseQuotationDtoStub()),
                        create: jest
                            .fn()
                            .mockResolvedValue(ResponseCurrencyDtoStub()),
                        disable: jest.fn().mockResolvedValue(undefined),
                        list: jest.fn().mockRejectedValue(responseCurrencyList),
                    },
                },
            ],
        }).compile();

        currencyController = app.get<CurrencyController>(CurrencyController);
        currencyService = app.get<CurrencyService>(CurrencyService);
    });

    it('should be defined', () => {
        expect(currencyController).toBeDefined();
    });

    describe('quotation', () => {
        it('should return a calculated quotation', async () => {
            const quotation = await currencyController.quotation(
                'USD',
                'BRL',
                '100',
            );

            expect(quotation).toEqual(ResponseQuotationDtoStub());
            expect(typeof quotation.result).toEqual('number');
            expect(currencyService.quotation).toHaveBeenCalledWith(
                'USD',
                'BRL',
                100,
            );
        });

        it('should throw an bad request exception', () => {
            jest.spyOn(currencyService, 'quotation').mockRejectedValueOnce(
                new Error(),
            );

            expect(
                currencyController.quotation('USD', 'BRL', '100'),
            ).rejects.toThrowError();
        });
    });

    describe('create', () => {
        it('should create a new currency using amount and baseAmount', async () => {
            const body: CreateFictitiumDto = {
                name: 'PSN Coin',
                code: 'PSN',
                baseCode: 'USD',
                amount: 1250000,
                baseAmount: 84.5,
            };
            const exhangeRate = body.amount / body.baseAmount;

            const create = await currencyController.create(body);

            expect(create).toEqual(ResponseCurrencyDtoStub());
            expect(create.exchangeRate.toFixed(4)).toEqual(
                exhangeRate.toFixed(4),
            );
            expect(currencyService.create).toHaveBeenCalledWith(body);
        });

        it('should create a new currency using quotation', async () => {
            const body = {
                name: 'PSN Coin',
                code: 'PSN',
                baseCode: 'USD',
                quotation: 14792.899408284,
            };

            const create = await currencyController.create(body);

            expect(create).toEqual(ResponseCurrencyDtoStub());
            expect(currencyService.create).toHaveBeenCalledWith(body);
        });

        it('should throw an bad request exception when same required field was not found', () => {
            jest.spyOn(currencyService, 'create').mockRejectedValueOnce(
                new Error(),
            );

            expect(
                currencyController.create({
                    name: 'PSN Coin',
                    code: 'PSN',
                    baseCode: 'USD',
                }),
            ).rejects.toThrowError();
        });
    });

    describe('delete', () => {
        it('should delete a currency if it exists', async () => {
            const result = await currencyController.delete('PSN');

            expect(result).toBeUndefined();
            expect(currencyService.disable).toHaveBeenCalledWith('PSN');
        });

        it('should throw an bad request exception when currency code not found', () => {
            jest.spyOn(currencyService, 'disable').mockRejectedValueOnce(
                new Error(),
            );

            expect(currencyController.delete('PSN')).rejects.toThrowError();
        });
    });
});
