import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from '../currencies/currencies.service';
import { ExchangeService } from './exchange.service';

const currenciesServiceMock = {
  getCurrency: jest.fn(),
};

describe('ExchangeService', () => {
  let service: ExchangeService;
  let currenciesService: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        { provide: CurrenciesService, useFactory: () => currenciesServiceMock },
      ],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    currenciesService = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should be throw if called with invalid params', async () => {
      await expect(service.convertAmount({ from: '', to: '', amount: 0 })).rejects.toThrow();
    });

    it('should be not throw if convertAmount is called with valid params', async () => {
      await expect(
        service.convertAmount({ from: 'BRL', to: 'USD', amount: 2 }),
      ).resolves.not.toThrow();
    });

    it('should be called getCurrency twice', async () => {
      currenciesService.getCurrency = jest.fn().mockReturnValue({ value: 1 });
      await service.convertAmount({ from: 'USD', to: 'BRL', amount: 1 });
      expect(currenciesService.getCurrency).toBeCalledTimes(2);
    });

    it('should be called getCurrency with correct params', async () => {
      currenciesService.getCurrency = jest.fn().mockReturnValue({ value: 1 });
      await service.convertAmount({ from: 'BRL', to: 'USD', amount: 2 });
      await expect(currenciesService.getCurrency).toBeCalledWith('BRL');
      await expect(currenciesService.getCurrency).toBeCalledWith('USD');
    });

    it('should be throw if currency does not exist', async () => {
      (currenciesService.getCurrency as jest.Mock).mockRejectedValue(new Error());
      await expect(
        service.convertAmount({ from: 'INVALID', to: 'USD', amount: 2 }),
      ).rejects.toThrow();
      await expect(
        service.convertAmount({ from: 'BRL', to: 'INVALID', amount: 2 }),
      ).rejects.toThrow();
    });
  });
});
