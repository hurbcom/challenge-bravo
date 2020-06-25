import { Sequelize, Model, DataTypes, Dialect } from 'sequelize';
import { getCurrencyModel } from './model/currency';

const sequelize = new Sequelize({
    database: process.env.ORM_DATABASE,
    dialect: <Dialect> process.env.ORM_DIALECT,
    storage: process.env.ORM_STORAGE
});

class CurrencyModel extends Model { }

CurrencyModel.init(getCurrencyModel() ,{ sequelize, modelName: process.env.ORM_TABLENAME });

const create = async (currency: any) => {
    await sequelize.sync();
    const user =  await CurrencyModel.create(currency);
    return user;
}
create({
    name: 'DUMMY_CURRENCY', value: 2000
})
.then(c => console.log(c.toJSON()))