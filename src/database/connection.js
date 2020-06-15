const knex = require('knex');
const path = require('path');

const connection = knex({
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

module.exports = connection;