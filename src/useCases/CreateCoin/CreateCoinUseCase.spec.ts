import request from 'supertest';
import knex from '../../config/knex';
import app from '../../app';

describe('Create Coin', () => {
  const path = '/coin';

  it('deveria dar erro ao criar uma moeda', async (done) => {
    request(app).post(`${path}`).expect(400, done);
  });

  it('deveria permitir criar uma moeda', async (done) => {
    knex.transaction(async (newTrx) => {
      request(app)
        .post(`${path}`)
        .send({
          name: 'ATAB9',
        })
        .expect(201);

      done();
    });
  });

  it('deveria dar erro criar uma moeda existante', async (done) => {
    request(app)
      .post(`${path}`)
      .send({
        name: 'BTC',
      })
      .expect(400, done);
  });
});
