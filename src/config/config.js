const pgp = require("pg-promise")();
const config = {
    user: "postgres",
    password: "postgres",
    host: "db",
    port: 5432,
    database: "postgres",
};



const db = pgp(config);


module.exports = db;
