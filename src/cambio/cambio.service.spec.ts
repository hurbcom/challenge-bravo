import { Test, TestingModule } from '@nestjs/testing';
import { CambioService } from './cambio.service';

describe('CambioService', () => {
  let service: CambioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CambioService],
    }).compile();

    service = module.get<CambioService>(CambioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
