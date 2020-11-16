import { Transaction } from 'knex';
import { Coin } from '../../entities/Coin';
import knex from '../../config/knex';

describe('Create Coin', () => {
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

  it('should be able to create new coin', async () => {
    const data = {
      name: 'BRL',
    };

    const coin = new Coin(data);

    await trx('coins').insert(coin);

    const list = await trx('coins').where('name', data.name);

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: data.name,
        }),
      ])
    );
  });
});
