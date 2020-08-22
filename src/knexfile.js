// Update with your config settings.

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: process.env.SQLITE_FILENAME || './dev.sqlite3'
        },
        migrations: {
            tableName: 'currency',
            directory: 'api/currency/infrastructure/knex/migrations'
        }
    },
};
