import { Test, TestingModule } from '@nestjs/testing';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repository: CurrenciesRepository;
  let mockData;

  beforeEach(async () => {
    const mockRepository = {
      getCurrency: jest.fn(),
      createCurrency: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
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
    mockData = { currency: 'USD', value: 1 } as Currencies;
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

    it('should be not throw if repository return value', async () => {
      await expect(service.createCurrency(mockData)).resolves.not.toThrow();
    });

    it('should be throw if validate throw', async () => {
      mockData.currency = 'INVALID';
      await expect(service.createCurrency(mockData)).rejects.toThrow();
    });

    it('should be calls repository with correct param', async () => {
      await service.createCurrency(mockData);
      expect(repository.createCurrency).toBeCalledWith(mockData);
    });

    it('should be return value with repository return value', async () => {
      (repository.createCurrency as jest.Mock).mockReturnValue(mockData);
      expect(await service.createCurrency(mockData)).toEqual(mockData);
    });
  });

  describe('deleteCurrency()', () => {
    it('should be throw if currency not exists', async () => {
      await expect(service.deleteCurrency('INVALID')).rejects.toThrow();
    });

    it('should be called repository.delete with correct params if currency exists', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      await service.deleteCurrency('VALID');
      expect(repository.delete).toBeCalledWith({ currency: 'VALID' });
    });
  });

  describe('updateCurrency()', () => {
    it('should be throw if currency not exists', async () => {
      await expect(service.updateCurrency(mockData)).rejects.toThrow();
    });

    it('should be throw if currency value <= 0', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      mockData.value = 0;
      await expect(service.updateCurrency(mockData)).rejects.toThrow();
    });

    it('should be called repository.save with correct params if currency exists', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      await service.updateCurrency(mockData);
      expect(repository.save).toBeCalledWith(mockData);
    });

    it('should be returns updated currency', async () => {
      (repository.findOne as jest.Mock).mockReturnValue(mockData);
      const mockDataUpdated = mockData;
      mockDataUpdated.value = 2;
      expect(await service.updateCurrency(mockDataUpdated)).toEqual(mockDataUpdated);
    });
  });
});
