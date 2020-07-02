import app from "@core/application";
import request from 'supertest';
import CurrencyFactory from '@factories/CurrencyFactory';
import sequelize from "@config/database";

describe('currency integration test suite', () => {

  beforeEach(async () => await sequelize.sync({ force: true }));

  it('should find multiple currencies in the database', async () => {
    await CurrencyFactory.createMany('Currency', 3);

    const response = await request(app.router)
      .get('/currency');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

});