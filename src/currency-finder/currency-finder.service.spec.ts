import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/common';
import { CurrencyFinderService } from './currency-finder.service';
import { ExtApisService } from '../external-apis/ext-apis.service'

describe('CurrencyFinderService', () => {
  let service: CurrencyFinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CurrencyFinderService, ExtApisService],
    }).compile();

    service = module.get<CurrencyFinderService>(CurrencyFinderService);
  });

  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should be defined', () => {
    expect(service.ListAll('USD')).toBeDefined()
  });


});
