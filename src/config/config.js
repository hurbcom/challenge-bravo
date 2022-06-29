const pgp = require("pg-promise")();
const config = {
    user: "postgres",
    password: "admin",
    host: "localhost",
    port: 5432,
    database: "hurb_currency_db",
};

const db = pgp(config);

module.exports = db;
