import { Transaction } from 'knex';
import { Coin } from '../../entities/Coin';
import knex from '../../config/knex';

describe('Convert Coin', () => {
  let trx: Transaction;

  beforeEach((done) => {
    knex.transaction((newTrx) => {
      trx = newTrx;
      done();
    });
  });

  afterEach(async (done) => {
    await trx.rollback();
    done();
  });

  it('should be able to convert new coin', async () => {
    // const data = {
    //   name: 'Real',
    //   acronym: 'BRL',
    // };
    // const coin = new Coin(data);
    // await trx('coins').insert(coin);
    // const list = await trx('coins').where('acronym', data.acronym);
    // expect(list).toEqual(
    //   expect.arrayContaining([
    //     expect.objectContaining({
    //       acronym: data.acronym,
    //     }),
    //   ])
    // );
  });
});
