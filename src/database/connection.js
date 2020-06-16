require('../bootstrap');
const knex = require('knex');
const path = require('path');

const connectionDev = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 10
    }
});

const connectionTest = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, '..', '..', '__tests__', 'databaseTest.sqlite'),
    },
    useNullAsDefault: true,
    pool: {
        min: 0,
        max: 10
    }
});

module.exports = process.env.NODE_ENV === 'development' ? connectionDev : connectionTest;