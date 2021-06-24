export default {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    max: +process.env.DB_POOL_CONNECTIONS
};