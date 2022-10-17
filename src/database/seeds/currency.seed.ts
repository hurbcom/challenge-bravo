import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CurrencyEntity } from '../../modules/currency/entities/currency.entity';

export default class CurrencySeeds implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const repository = dataSource.getRepository(CurrencyEntity);
    await repository.insert([
      {
        id: 'c1168fa2-15e0-480d-9ff3-a81c4d18c519',
        code: 'HURB',
        backedCurrencyCode: 'USD',
        unitCost: '500'
      },
    ]);
  }
}