require("dotenv").config({
    path: ".env"
});
const{
    DB_HOST,
    DB_USER,
    DB_PASS,
    DB_NAME,
    DB_DIALECT_PROD,
    DB_DIALECT_TEST,
    NODE_ENV
} = process.env

dbConfig = {
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dialect: DB_DIALECT_TEST || "postgres",
    storage: "./__tests__/database.sqlite",
    operatorsAliases: false,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    }
};

// if(NODE_ENV==="test"){
//     dbConfig = {
//         host: DB_HOST,
//         dialect: DB_DIALECT_TEST || "",
//     }
// }
  module.exports = dbConfig