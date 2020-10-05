import { Test, TestingModule } from '@nestjs/testing';
import { ConvertAmountDto } from './dto/convert-amount.dto';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [{ provide: ExchangeService, useFactory: () => ({ convertAmount: jest.fn() }) }],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('convertAmount()', () => {
    it('should be throws if service throw', async () => {
      (service.convertAmount as jest.Mock) = jest.fn().mockRejectedValue(new Error());
      await expect(controller.convertAmount).rejects.toThrow();
    });

    it('should be called service.convertAmount with correct params', async () => {
      const mockData = { from: 'USD' } as ConvertAmountDto;
      await controller.convertAmount(mockData);
      expect(service.convertAmount).toBeCalledWith(mockData);
    });

    it('should be returns service.convertAmount value', async () => {
      const mockData = { from: 'USD' } as ConvertAmountDto;
      (service.convertAmount as jest.Mock).mockReturnValue(mockData);
      expect(await controller.convertAmount({ from: 'USD' } as ConvertAmountDto)).toEqual(mockData);
    });
  });
});
