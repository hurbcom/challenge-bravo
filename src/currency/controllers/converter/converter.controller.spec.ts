import { Test, TestingModule } from '@nestjs/testing';
import { ConverterController } from './converter.controller';

describe('Converter Controller', () => {
  let controller: ConverterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConverterController],
    }).compile();

    controller = module.get<ConverterController>(ConverterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
