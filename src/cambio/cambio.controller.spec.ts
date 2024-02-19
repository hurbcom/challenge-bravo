import { Test, TestingModule } from '@nestjs/testing';
import { CambioController } from './cambio.controller';

describe('CambioController', () => {
  let controller: CambioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CambioController],
    }).compile();

    controller = module.get<CambioController>(CambioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
