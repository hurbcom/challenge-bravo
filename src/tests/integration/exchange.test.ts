import app from "@core/application";
import request from "supertest";

describe('exchange integration test suite', () => {

  it('should calculate the exchange rate between two given currencies', async () => {

    const response = await request(app.router)
      .get('/exchange?from=USD&to=BTC&amount=1');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ total: 0.00011 });
  });

  it('should return HTTP 400 Status code when invalid or missing params are sent by the client', async () => {
    const missingParamsResponse = await request(app.router)
      .get('/exchange');

    const invalidParams = await request(app.router)
      .get(`/exchange?foo=bar&bar=baz&amount=a&from=john&to=doe`);

    expect(missingParamsResponse.status).toBe(400);
    expect(invalidParams.status).toBe(400);
  });

});