import { createClient } from "redis";
import env from "../config/envConfig";

const redis = createClient({
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
    },
});

export default redis;
