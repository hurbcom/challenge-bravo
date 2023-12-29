import { Connection, Model } from 'mongoose';
import connection from '../connection';
import CurrencyEntity, { CurrencyEntityProps } from '../../../domain/entities/currency.entity';
import PersistenceError from '../../../domain/errors/persistence.error';
import CurrencyRepository from '../../../domain/repositories/currency.repository';
import CurrencySchema from '../models/currency.schema';

export default class CurrencyRepositoryImpl implements CurrencyRepository {
    private readonly conn: Connection;
    private readonly CurrencyModel: Model<CurrencyEntityProps>;

    constructor(conn?: Connection) {
        this.conn = conn || connection();
        this.CurrencyModel = this.conn.model<CurrencyEntityProps>('currencies', CurrencySchema);
    }

    async findBy(currencyEntityProps: Partial<CurrencyEntityProps>): Promise<CurrencyEntity[] | null> {
        try {
            const currenciesProps = await this.CurrencyModel.find(currencyEntityProps);
            if (!currenciesProps.length) return null;
            const currencies: CurrencyEntity[] = [];

            currenciesProps.forEach((currencyProps) => currencies.push(new CurrencyEntity(currencyProps.toObject())));

            return currencies;
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.findby: ${JSON.stringify(e, null, 4)}`
            );
        }
    }

    async insert(currencyEntity: CurrencyEntity): Promise<CurrencyEntity> {
        try {
            const currency = new this.CurrencyModel(currencyEntity.props);
            await currency.save();
            return new CurrencyEntity(currency.toObject());
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.insert: ${JSON.stringify(e, null, 4)}`
            );
        }
    }

    async update(currencyEntity: CurrencyEntity): Promise<CurrencyEntity> {
        try {
            const { props } = currencyEntity;
            const updatedCurrency = await this.CurrencyModel.findOneAndUpdate(
                { _id: props._id },
                { $set: props },
                { new: true }
            );

            if (!updatedCurrency)
                throw new PersistenceError(`Currency with id ${props._id as string} not found`);

            return new CurrencyEntity(updatedCurrency.toObject());
        } catch (e) {
            throw new PersistenceError(
                `Error on CurrencyRepository.update: ${JSON.stringify(e, null, 4)}`
            );
        }
    }
}
