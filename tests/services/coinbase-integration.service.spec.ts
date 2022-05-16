import axios from 'axios';
import { coinbaseIntegrationService as CoinbaseIntegrationService } from '../../src/services';
import { ICoinbaseIntegrationService } from '../../src/services/coinbase-integration.service';
import currenciesResponse from '../currenciesResponse.json';
import exchangeRatesResponse from '../exchangeRatesResponse.json';

jest.mock('axios');

describe('CoinbaseIntegrationService', () => {
  let coinbaseIntegrationService: ICoinbaseIntegrationService;

  beforeAll(() => {
    coinbaseIntegrationService = CoinbaseIntegrationService;
  });

  describe('when the method "getCurrencies" is called', () => {
    it('should call axios and return data', async () => {
      const spy = jest.spyOn(axios, 'request').mockResolvedValue(currenciesResponse);

      const response = await coinbaseIntegrationService.getCurrencies();

      expect(spy).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });

  describe('when the method "getExchangeRates" is called', () => {
    it('should call axios and return data', async () => {
      const spy = jest.spyOn(axios, 'request').mockResolvedValue(exchangeRatesResponse);

      const response = await coinbaseIntegrationService.getExchangeRates();

      expect(spy).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });
});
