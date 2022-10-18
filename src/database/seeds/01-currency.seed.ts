import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { CurrencyEntity } from '../../modules/currency/entities/currency.entity';
import { CurrencyRepository } from '../../modules/currency/repositories/currency.repository';

export default class Currencies implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(CurrencyEntity);
        await repository.insert([
            {
                name: 'Dólar',
                code: 'USD',
                ratio: 1,
            },
            {
                name: 'Real',
                code: 'BRL',
                ratio: 0,
            },
            {
                name: 'Euro',
                code: 'EUR',
                ratio: 0,
            },
            {
                name: 'Bitcoin',
                code: 'BTC',
                ratio: 0,
            },
            {
                name: 'Ethereum',
                code: 'ETH',
                ratio: 0,
            },
        ]);
    }
}
