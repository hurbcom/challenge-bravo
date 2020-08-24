/** knexfile.js
 * Database's config for using knex
 */
module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE_FILENAME || './dev.sqlite3'
        },
        migrations: {
            tableName: 'currency',
            directory: 'api/currency/infrastructure/knex/migrations'
        },
        useNullAsDefault: true
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE_FILENAME || './test.sqlite3'
        },
        migrations: {
            tableName: 'currency',
            directory: 'api/currency/infrastructure/knex/migrations'
        },
        useNullAsDefault: true
    },
};
