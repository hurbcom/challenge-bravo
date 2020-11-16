import { ICoinsRespository } from '../ICoinsRepository';
import { Coin } from '../../entities/Coin';
import knex from '../../config/knex';

export class MysqlCoinsRepository implements ICoinsRespository {
  async index(): Promise<Coin[]> {
    const coins: Coin[] = await knex('coins').select('*');

    return coins;
  }

  async findByName(name: string): Promise<Coin> {
    const coin: Coin = await knex('coins').where('name', name).first();

    return coin;
  }

  async verifyAvailableCoin(from: string, to: string): Promise<number> {
    const total: any = await knex('coins')
      .count('name', { as: 'rows' })
      .whereIn('name', [from, to])
      .first();

    return total.rows;
  }

  async save(coin: Coin): Promise<Boolean> {
    const data = await knex('coins').insert(coin);

    if (!data) {
      return false;
    }

    return true;
  }

  async update(coin: Coin): Promise<Boolean> {
    const data = await knex('coins')
      .update({
        name: coin.name,
      })
      .where('uid', coin.uid);

    if (!data) {
      return false;
    }

    return true;
  }

  async delete(uid: string): Promise<Boolean> {
    const data = await knex('coins').where('uid', uid).del();

    if (!data) {
      return false;
    }

    return true;
  }
}
