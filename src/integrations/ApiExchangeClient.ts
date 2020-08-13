import request from 'superagent';
import Cache from './Cache';

const baseUrl = 'http://data.fixer.io/api/latest';
const accessKey = '2f8ca6444f47dd6cc3ad727fd5365764';
const cache = new Cache();

class ApiExchangeClient {
  public async connectApi() {
    try {
      const cached = await cache.get(accessKey);
      if (cached) {
        return cached;
      }
      const response = await request
        .get(`${baseUrl}?access_key=${accessKey}`)
        .send();
      cache.set(accessKey, response.body, 60 * 15);
      return response.body;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default ApiExchangeClient;
