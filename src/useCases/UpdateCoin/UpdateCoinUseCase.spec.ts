import request from 'supertest';
import app from '../../app';
import knex from '../../config/knex';

describe('Update Coin', () => {
  const path = '/coin';

  it('deveria permitir atualizar uma moeda', async (done) => {
    knex.transaction(async (newTrx) => {
      const fakeUID = 'teste';

      request(app)
        .post(`${path}`)
        .send({
          name: 'ATAB9',
          uid: fakeUID,
        })
        .expect(201);

      request(app)
        .put(`${path}/${fakeUID}`)
        .send({
          name: 'hi',
        })
        .expect(201);

      done();
    });
  });
});
