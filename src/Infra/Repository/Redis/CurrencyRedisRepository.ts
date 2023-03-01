import debug from "debug";
import { injectable } from "inversify";
import { createClient, type RedisClientType } from "redis";
import { type Currency } from "../../../Entities/Currency.interface";
import CurrencySeed from "../../DB/Seeds/CurrencySeed";
import { type ICurrencyRepository } from "../types/CurrencyRepo.interface";

@injectable()
export class CurrencyRedisRepository implements ICurrencyRepository {
    private readonly logger = debug("app:CurrencyRedisRepository");
    private readonly client: RedisClientType;
    constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL,
        });
        this.init().finally(() => {
            this.logger("Connected to redis");
        });
    }

    async reset() {
        await this.client.flushDb();
        await this.init();
    }

    async init(): Promise<void> {
        try {
            await this.client.connect();
        } catch (error) {}
        await this.client.MSET(CurrencySeed);
    }

    async getCurrency(currencyId: string): Promise<Currency | null> {
        const data = await this.client.get(`currency:${currencyId}`);
        return data !== null ? JSON.parse(data) : null;
    }

    async setCurrency(value: Currency) {
        await this.client.set(`currency:${value.id}`, JSON.stringify(value));
    }

    async getDollarRate(currencyId: string): Promise<number | null> {
        const data = await this.client.get(`dollar-rate:${currencyId}`);
        return data !== null ? Number(data) : null;
    }

    async setDollarRate(currencyId: string, value: number) {
        await this.client.setEx(
            `dollar-rate:${currencyId}`,
            60 * 10,
            value.toString()
        );
    }

    async close() {
        await this.client.disconnect();
    }
}
