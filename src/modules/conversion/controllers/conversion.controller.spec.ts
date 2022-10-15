import { Test, TestingModule } from '@nestjs/testing';

import { ConversionController } from './conversion.controller';

describe('ConversionController', () => {
    let controller: ConversionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ConversionController],
        }).compile();

        controller = module.get<ConversionController>(ConversionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
