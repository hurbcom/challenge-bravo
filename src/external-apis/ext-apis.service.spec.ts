import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { ExtApisService } from './ext-apis.service';



describe('ExtApisService', () => {
  let service: ExtApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExtApisService],
    }).compile();

    service = module.get<ExtApisService>(ExtApisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
