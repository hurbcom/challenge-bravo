import { createClient } from 'redis';
const key = 'coins';

export type Currency = {
    symbol: string;
    type: CurrencyType;
    rate: string;
    scrpprUrl?: string;
    scrpprAmountTag?: string;
    scrpprRateTag?: string;
    scrpprRateAsset?: string;
    scrpprDecimalSymbol?: string;
};

export enum CurrencyType {
    main = 'main',
    scrapper = 'scrapper',
    fiat = 'fiat',
    crypto = 'crypto',
    fixed = 'fixed'
}

class CurrencyModel {

    async addCurrency(coin: string, body: Currency) {
        const client = await createClient({
            url: process.env.REDIS
        }).on('error', err => console.log('Redis Client Error', err))
            .connect();
        await client.hSet(key, coin, JSON.stringify(body));
        await client.disconnect();
        return 'Ok';
    }

    async addCurrencies(coins: Currency[]) {
        const client = await createClient({
            url: process.env.REDIS
        }).on('error', err => console.log('Redis Client Error', err))
            .connect();
        for (let i = 0; i < coins.length; i++) {
            await client.hSet(key, coins[i].symbol, JSON.stringify(coins[i]));
        }
        await client.disconnect();
        return 'Ok';
    }

    async deleteCurrency(coin: string) {
        const client = await createClient({
            url: process.env.REDIS
        }).on('error', err => console.log('Redis Client Error', err))
            .connect();
        await client.hDel(key, coin);
        await client.disconnect();
        return 'Ok';
    }

    async getCurrencies() {
        const client = await createClient({
            url: process.env.REDIS
        }).on('error', err => console.log('Redis Client Error', err))
            .connect();
        const value = await client.hVals(key);
        await client.disconnect();
        return value.map((item) => {
            return JSON.parse(item);
        })
    }

    async getCurrency(coin: string) {
        const client = await createClient({
            url: process.env.REDIS
        }).on('error', err => console.log('Redis Client Error', err))
            .connect();
        const value = await client.hGet(key, coin);
        await client.disconnect();
        return value ? JSON.parse(value) : null;
    }

}

export const currencyModel = new CurrencyModel();

