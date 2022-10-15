import { DataSource, EntityRepository } from 'typeorm';

import { RepositoryBase } from '../../../base/repository.base';
import { CurrencyEntity } from '../entities/currency.entity';

@EntityRepository(CurrencyEntity)
export class CurrencyRepository extends RepositoryBase<CurrencyEntity> {
    constructor(private _dataSource: DataSource) {
        super(CurrencyEntity, _dataSource);
    }

    getCurrencies(): Promise<CurrencyEntity[]> {
        return this.find();
    }

    addCurrency(currency: CurrencyEntity): Promise<CurrencyEntity> {
        return this.save(currency);
    }

    async updateCurrency(id: string, currency: CurrencyEntity): Promise<CurrencyEntity> {
        await this.update(id, currency);
        return this.findOne({ where: { id } });
    }
}
