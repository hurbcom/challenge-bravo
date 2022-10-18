import { Test, TestingModule } from '@nestjs/testing';

import { CurrencyController } from '../controllers/currency.controller';
import { CurrencyService } from '../services/currency.service';

import { currencyDataMock, newCurrencyMock } from './mocks/data/currency.data.mock';
import { currencyServiceMock } from './mocks/services/currency.service.mock';

describe('CurrencyController', () => {
    let controller: CurrencyController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CurrencyController],
            providers: [
                {
                    provide: CurrencyService,
                    useValue: currencyServiceMock,
                },
            ],
        }).compile();

        controller = module.get<CurrencyController>(CurrencyController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should list all currencies', async () => {
        const result = await controller.getCurrency();
        expect(result).toBe(currencyDataMock);
    });

    it('should list a currency by id', async () => {
        const result = await controller.getCurrencyById(currencyDataMock[2].id);
        expect(result).toBe(currencyDataMock[2]);
    });

    it('should create a currency', async () => {
        const currencyMock = newCurrencyMock();
        await controller.createCurrency(currencyMock);
        expect(currencyDataMock[currencyDataMock.length - 1]).toBe(currencyMock);
    });

    it('should update a currency', async () => {
        const data = { ...currencyDataMock[0], name: 'updated' };
        await controller.updateCurrency(currencyDataMock[0].id, data);
        expect(currencyDataMock[0].name).toBe('updated');
    });

    it('should delete a currency', async () => {
        await controller.deleteCurrency(currencyDataMock[0].id);
        expect(currencyDataMock[0].isActive).toBe(false);
    });
});
