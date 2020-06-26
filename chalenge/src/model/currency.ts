import { Sequelize, Model, Op, Dialect, DataTypes } from 'sequelize';

// obtenho a estrutura do ORM para a criação da moeda e para importar o modelo para o banco
export const getCurrencyModel = () => (
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        value: DataTypes.DOUBLE,
        isBase: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // aloco valor default pra não precisar ficar definindo em toda inserção
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }
);
// obtenho dados populados
export const getDefaultCurrencyData = () => (
    [
        {
            name: 'USD', value: 1, isBase: true
        },
        {
            name: 'BRL', value: 5.35// dolar esta custando aproximadamente esse valor mesmo :(
        },
        {
            name: 'EUR', value: 0.89
        },
        {
            name: 'BTC', value: 0.00011
        },
        {
            name: 'ETH', value: 0.0044
        }
    ]
);

const sequelize = new Sequelize({
    database: process.env.ORM_DATABASE,
    dialect: <Dialect>process.env.ORM_DIALECT,
    storage: process.env.ORM_STORAGE
});

class CurrencyModel extends Model { }

CurrencyModel.init(getCurrencyModel(), { sequelize, modelName: process.env.ORM_TABLENAME });

export const createCurrency = async (currency: {
    name: string,
    value: Number
}) => {
    await sequelize.sync();
    const user = await CurrencyModel.create(currency);
    return user;
}

export const existByName = async (name: string) => {
    const result = await CurrencyModel.findOne({ where: { name } });
    return result ? true : false;
}

export const getCurrencies = async (currencies: string[]): Promise<any[]> => {
    const results = await CurrencyModel.findAll({
        raw: true,
        where: { name: { [Op.in]: currencies } }
    });
    return results;
}
