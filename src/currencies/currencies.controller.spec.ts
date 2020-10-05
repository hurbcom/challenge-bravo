import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from './currencies.controller';
import { Currencies } from './currencies.entity';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: CurrenciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CurrenciesService,
          useFactory: () => ({
            createCurrency: jest.fn(),
            deleteCurrency: jest.fn(),
          }),
        },
      ],
      controllers: [CurrenciesController],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get<CurrenciesService>(CurrenciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCurrency', () => {
    it('should be throws if service throw', async () => {
      (service.createCurrency as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.createCurrency(new Currencies())).rejects.toThrow(
        new BadRequestException(),
      );
    });

    it('should be call service with correct params', async () => {
      const mockData = { currency: 'USD' } as Currencies;
      await controller.createCurrency(mockData);
      expect(service.createCurrency).toBeCalledWith(mockData);
    });

    it('should be returns service value', async () => {
      const mockData = { currency: 'USD' } as Currencies;
      (service.createCurrency as jest.Mock) = jest.fn().mockResolvedValue(mockData);
      expect(await controller.createCurrency(mockData)).toEqual(mockData);
    });
  });

  describe('deleteCurrency', () => {
    it('should be throws if service throw', async () => {
      (service.deleteCurrency as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.deleteCurrency('INVALID')).rejects.toThrow(new BadRequestException());
    });

    it('should be call service with correct params', async () => {
      await controller.deleteCurrency('VALID');
      expect(service.deleteCurrency).toBeCalledWith('VALID');
    });
  });

  describe('updateCurrency', () => {
    it('should be throws if service throw', async () => {
      (service.updateCurrency as jest.Mock) = jest
        .fn()
        .mockRejectedValue(new BadRequestException());
      await expect(controller.updateCurrency('INVALID', 1)).rejects.toThrow(
        new BadRequestException(),
      );
    });
  });
});
