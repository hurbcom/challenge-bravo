import request from 'superagent';

const baseUrl = 'http://data.fixer.io/api/latest';
const accessKey = '2f8ca6444f47dd6cc3ad727fd5365764';

class ApiExchangeClient {
  public async connectApi() {
    try {
      const response = await request
        .get(`${baseUrl}?access_key=${accessKey}`)
        .send();
      return response.body;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default ApiExchangeClient;
