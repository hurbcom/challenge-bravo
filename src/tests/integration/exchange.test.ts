import app from "@core/application";
import request from "supertest";

describe('exchange integration test suite', () => {

  it('should calculate the exchange rate between two given currencies', async (done) => {

    const response = await request(app.router)
      .get('/exchange');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ total: 0.00000001 });

    done();
  });

});