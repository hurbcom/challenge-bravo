import request from 'supertest';
import app from '../../app';
import knex from '../../config/knex';

describe('Delete Coin', () => {
  const path = '/coin';

  it('deveria permitir deletar uma moeda', async (done) => {
    knex.transaction(async (newTrx) => {
      const fakeUID = 'teste';

      request(app)
        .post(`${path}`)
        .send({
          name: 'ATAB9',
          uid: fakeUID,
        })
        .expect(201);

      request(app).delete(`${path}/${fakeUID}`).expect(201);

      done();
    });
  });
});
