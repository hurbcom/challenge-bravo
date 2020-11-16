import { Transaction } from 'knex';
import { Coin } from '../../entities/Coin';
import knex from '../../config/knex';

describe('Update Coin', () => {
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

  it('should be able to update a coin', async () => {
    const data = {
      name: 'BRL',
    };

    const newData = {
      name: 'USD',
    };

    const coin = new Coin(data);

    await trx('coins').insert(coin);

    await trx('coins').update(newData).where('name', data.name);

    const list = await trx('coins').where('name', newData.name);

    expect(list).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: newData.name,
        }),
      ])
    );
  });
});
