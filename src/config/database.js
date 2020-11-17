require('dotenv/config');
const logger = require('../utils/logger').default;

module.exports = {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    migrationStorageTableName: 'sequelize_meta',
    logging: logger.debug.bind(logger),
    pool: {
        max: 30
    },
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    },
    dialectOptions: { decimalNumbers: true }
};
