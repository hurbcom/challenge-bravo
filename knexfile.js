const path = require('path');

const dev = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    useNullAsDefault: true,
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
};

const test = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, '__tests__', 'databaseTest.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
    },
    useNullAsDefault: true,
    seeds: {
        directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
    },
};

module.exports = process.env.NODE_ENV === 'development' ? dev : test;