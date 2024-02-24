const Sequelize = require('sequelize');

const { sequelize } = require('./connection');

const CurrencysModel = sequelize.define('currencys', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    currency: {
        type: Sequelize.STRING(10),
        allowNull: false
    },
    ballast_usd: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    crypto: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    imported: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    createdAt: { type: Sequelize.DATE },
    updatedAt: { type: Sequelize.DATE }
}, {
    freezeTableName: true
});

module.exports = {
    CurrencysModel,
    CurrencysRaw: sequelize
};