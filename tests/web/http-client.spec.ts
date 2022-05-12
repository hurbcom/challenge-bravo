import axios from 'axios';
import { HttpClient } from '../../src/web/http-client';
import { httpClient } from '../../src/web';

// jest.mock('axios');

describe('HttpClient', () => {
  let clientHttp: HttpClient;

  beforeAll(() => {
    clientHttp = httpClient;
  });

  describe('when the method "makeRequest" is called', () => {
    it('should call axios and return the response', async () => {
      const data = 'test';
      const spy = jest.spyOn(axios, 'request').mockResolvedValue(data);

      const response = await clientHttp.makeRequest({ method: 'GET', url: 'test-url' });

      expect(spy).toHaveBeenCalled();
      expect(response).toBe(data);
    });
  });
});
