'use strict';

// Modules
const Fs = require('fs');
const Path = require('path');
const Sequelize = require('sequelize');

// Interface object
var models = {};

// Sequelize models interface
module.exports = models;

const database_url = process.env.DATABASE_URL;
const sequelize = new Sequelize(database_url, {
    dialect: 'postgres',
    dialectOptions: {
        useUTC: false
    },
    logging: false,
    pool: {
        max: 5,
        idle: 30000,
        acquire: 60000,
    },
    define: {
        timestamps: false,
        paranoid: true,
        underscored: true,
        freezeTableName: true
    },
    timezone: 'America/Sao_Paulo'
});

// Import models
Fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
    var model = sequelize.import(Path.join(__dirname, file));
    models[model.name] = model;
});

// Map relationships (import dependence)
Object.keys(models).forEach(function(name) {
    var model = models[name];
    if (model && model.hasOwnProperty('associate'))
        model.associate(models);
});

// Map scopes (relationships dependence)
Object.keys(models).forEach(function(name) {
    var model = models[name];
    if (model && model.hasOwnProperty('load_scopes'))
        model.load_scopes(models);
});

// Store sequelize references
models.sequelize = sequelize;
models.Sequelize = Sequelize;