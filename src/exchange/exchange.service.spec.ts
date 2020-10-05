import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExchangeService } from './exchange.service';

const serviceCurrenciesMock = {
  getCurrency: jest.fn(),
};

describe('ExchangeService', () => {
  let service: ExchangeService;
  let serviceCurrencies: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => serviceCurrenciesMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    serviceCurrencies = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should be throw if called with invalid params', async () => {
      await expect(service.convertAmount({ from: '', to: '', amount: 0 })).rejects.toThrow();
    });

    it('should be called getCurrency twice', async () => {
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      expect(serviceCurrencies.getCurrency).toBeCalledTimes(2);
    });
  });
});
