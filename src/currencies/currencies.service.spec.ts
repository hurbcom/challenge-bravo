import { Test, TestingModule } from '@nestjs/testing';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repository: CurrenciesRepository;

  beforeEach(async () => {
    const mockRepository = {
      getCurrency: jest.fn(),
      createCurrency: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: CurrenciesRepository,
          useFactory: () => mockRepository,
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('should be throw if repository throw', async () => {
      (repository.getCurrency as jest.Mock).mockRejectedValue(new Error());
      await expect(service.getCurrency('INVALID')).rejects.toThrow();
    });

    it('should be not throw if repository return value', async () => {
      await expect(service.getCurrency('USD')).resolves.not.toThrow();
    });

    it('should be calls repository with correct param', async () => {
      await service.getCurrency('USD');
      expect(repository.getCurrency).toBeCalledWith('USD');
    });

    it('should be return value with repository return value', async () => {
      (repository.getCurrency as jest.Mock).mockReturnValue({ value: 1 });
      expect(await service.getCurrency('USD')).toEqual({ value: 1 });
    });
  });

  describe('createCurrency()', () => {
    it('should be throw if repository throw', async () => {
      (repository.createCurrency as jest.Mock).mockRejectedValue(new Error());
      await expect(service.createCurrency(new Currencies())).rejects.toThrow();
    });
  });
});
