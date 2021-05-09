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

module.exports =  {
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dialect: NODE_ENV==="test"?DB_DIALECT_TEST:DB_DIALECT_PROD || "postgres",
    storage: "./__tests__/database.sqlite",
    operatorsAliases: false,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    }
};
