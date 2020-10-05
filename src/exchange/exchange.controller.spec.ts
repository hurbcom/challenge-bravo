import { Test, TestingModule } from '@nestjs/testing';
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
  });
});
