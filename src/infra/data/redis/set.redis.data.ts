import { CurrencyEntityProps } from "../../../domain/entities/currency.entity";
import { RedisProvider } from "./redis.provider";

const getRedisData = async (code: string): Promise<any> => {
    const redisProvider = new RedisProvider()
        const currency =  await redisProvider.get(code);
        redisProvider.disconnect()
        return currency;
};
    
const setRedisData = async (
    currencies: CurrencyEntityProps[]
    ): Promise<void> => {
        const redisProvider = new RedisProvider()
        for (const i in currencies) {
            const { code, bid } = currencies[i]
            await redisProvider.set(code, bid, 'EX', 8280);
        }
    redisProvider.disconnect();
};

export {
    getRedisData,
    setRedisData
}