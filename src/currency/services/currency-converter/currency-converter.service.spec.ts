import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyConverterService } from './currency-converter.service';

describe('CurrencyConverterService', () => {
  let service: CurrencyConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyConverterService],
    }).compile();

    service = module.get<CurrencyConverterService>(CurrencyConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
