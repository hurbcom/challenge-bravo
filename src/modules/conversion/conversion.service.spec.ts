import { Test, TestingModule } from '@nestjs/testing';

import { ConversionService } from './conversion.service';

describe('ConversionService', () => {
    let service: ConversionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConversionService],
        }).compile();

        service = module.get<ConversionService>(ConversionService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
