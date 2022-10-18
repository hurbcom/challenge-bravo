import { DataSource, EntityRepository } from 'typeorm';

import { RepositoryBase } from '../../../base/repository.base';
import { CurrencyQuoteDto } from '../../_common/dto/currency-quote.dto';
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
        const _currency = await this.findOneOrFail({ where: { id } });
        _currency.code = currency.code;
        _currency.name = currency.name;
        _currency.ratio = currency.ratio;
        return this.save(_currency);
    }

    async updateCurrencyQuotes(quotes: CurrencyQuoteDto[]): Promise<void> {
        await Promise.all(
            quotes.map(async (quote) => {
                if (!quote.code) return;
                let currency = await this.findOne({ where: { code: quote.code } });
                if (!currency) {
                    currency = new CurrencyEntity();
                    currency.code = quote.code;
                    currency.name = quote.code;
                }
                currency.ratio = 1 / Number(quote.ratio);
                await currency.save();
            })
        );
    }
}
