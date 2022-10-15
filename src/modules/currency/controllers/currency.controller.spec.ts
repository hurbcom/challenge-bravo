import { Test, TestingModule } from '@nestjs/testing';

import { CurrencyController } from './currency.controller';

describe('CurrencyController', () => {
    let controller: CurrencyController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CurrencyController],
        }).compile();

        controller = module.get<CurrencyController>(CurrencyController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
