import { TestBed, inject } from '@angular/core/testing';

import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExchangeRateService]
    });
  });

  it('should be created', inject([ExchangeRateService], (service: ExchangeRateService) => {
    expect(service).toBeTruthy();
  }));
});
