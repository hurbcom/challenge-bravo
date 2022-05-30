import { Sequelize } from 'sequelize-typescript';
import { Currency } from './currencyDb/currency.entity';

export const databaseProviders = [{
    provide: 'SEQUELIZE',
    useFactory: async () => {
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite'
        });
        sequelize.addModels([Currency]);
        await sequelize.sync();
        return sequelize;
    },
}];