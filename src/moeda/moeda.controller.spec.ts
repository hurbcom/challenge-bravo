import { Test, TestingModule } from '@nestjs/testing';
import { MoedaController } from './moeda.controller';

describe('MoedaController', () => {
  let controller: MoedaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoedaController],
    }).compile();

    controller = module.get<MoedaController>(MoedaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
