'use strict';

// Model interface
module.exports = function(sequelize, DataTypes) {
    var Moeda = sequelize.define(
        'Moeda',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
            nome: { type: DataTypes.STRING, allowNull: false },
            moeda_lastro: { type: DataTypes.STRING, allowNull: false }
        },
        {
            schema: 'public',
            tableName: 'moeda',
            timestamps: false
        }
    );
    
    Moeda.associate = function(models) {}

    Moeda.load_scopes = function(models) {}

    return Moeda;
};