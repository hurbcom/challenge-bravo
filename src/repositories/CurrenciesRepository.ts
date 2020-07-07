import { Repository, EntityRepository } from 'typeorm';

import Currency from '../models/Currency';

@EntityRepository(Currency)
class CurrenciesRepository extends Repository<Currency> {
    public async findAllCurrencies(): Promise<Currency[]> {
        const currencies = await this.find();

        return currencies;
    }

    public async createCurrency(name: string): Promise<Currency> {
        const newCurrency = this.create({ name });

        await this.save(newCurrency);

        return newCurrency;
    }

    public async findByName(name: string): Promise<Currency | undefined> {
        const findCurrency = await this.findOne({
            where: { name },
        });
        return findCurrency;
    }
}

export default CurrenciesRepository;
