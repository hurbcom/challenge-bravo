import app from "@core/application";
import request from "supertest";
import sequelize from "@config/database";

describe('exchange integration test suite', () => {

  beforeEach(async () => await sequelize.sync({ force: true }));

  it('should calculate the exchange rate between two given currencies', async () => {

    const response = await request(app.router)
      .get('/exchange?from=USD&to=BTC&amount=1');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ total: 0.00011 });
  });

});