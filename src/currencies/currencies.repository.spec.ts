import { Test, TestingModule } from '@nestjs/testing';
import { Currencies } from './currencies.entity';
import { CurrenciesRepository } from './currencies.repository';

describe('CurrenciesRepository', () => {
  let repository: CurrenciesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrenciesRepository],
    }).compile();

    repository = module.get<CurrenciesRepository>(CurrenciesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getCurrency()', () => {
    it('should be called findeOne with correct params', async () => {
      repository.findOne = jest.fn().mockReturnValue({});
      await repository.getCurrency('USD');
      expect(repository.findOne).toBeCalledWith({ currency: 'USD' });
    });

    it('should be throw if findOne returns empty', async () => {
      repository.findOne = jest.fn().mockReturnValue(undefined);
      await expect(repository.getCurrency('INVALID')).rejects.toThrow();
    });

    it('should be returns value with findOne returns', async () => {
      const mockData = { currency: 'USD', value: 1 } as Currencies;
      repository.findOne = jest.fn().mockReturnValue(mockData);
      expect(await repository.getCurrency('USD')).toEqual(mockData);
    });
  });

  describe('createCurrency()', () => {
    beforeEach(() => {
      repository.save = jest.fn();
    });

    it('should be throw when currency value and value <= 0', async () => {
      await expect(repository.createCurrency({ value: 0 } as Currencies)).rejects.toThrowError(
        'Currency value must be greater than 0.',
      );
    });
  });
});
