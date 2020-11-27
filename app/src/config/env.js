import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    api: {
        url: process.env.EXCHANGE_RATE_API_URL,
        key: process.env.EXCHANGE_RATE_API_KEY
    },
    mongo: {
        connectionString: process.env.MONGO_URL,
        name: process.env.MONGO_NAME
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
}