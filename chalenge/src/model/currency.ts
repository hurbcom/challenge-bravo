import { DataTypes } from "sequelize";
// obtenho a estrutura do ORM para a criação da moeda
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
            name: 'USD', value: 1, isbase: true
        },
        {
            name: 'BRL', value: 5.35
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