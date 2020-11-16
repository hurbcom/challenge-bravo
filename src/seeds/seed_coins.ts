import knex from 'knex';
import { v4 as uuidv4 } from 'uuid';

export async function seed(Knex: knex): Promise<void> {
  // Deletes ALL existing entries
  await Knex('coins').del();

  // Inserts seed entries
  await Knex('coins').insert([
    { uid: uuidv4(), name: 'USD' },
    { uid: uuidv4(), name: 'BRL' },
    { uid: uuidv4(), name: 'EUR' },
    { uid: uuidv4(), name: 'BTC' },
    { uid: uuidv4(), name: 'ETH' },
  ]);
}
