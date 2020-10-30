import { Redis } from 'ioredis';
import redisClient, { RedisClient } from '../../config/redis';
import initialCurrencies from './initialCurrencies.json';
import Big from 'big.js';

export const SUPPORTED_CURRENCIES_KEY = 'currencies:supported';

class CurrencyCache {

    private redisClient: RedisClient;

    constructor() {
        this.redisClient = redisClient;
    }

    public async getSupportedCurrencies() : Promise<string[]> {
        try{
            return await this.getClient().smembers(SUPPORTED_CURRENCIES_KEY);
        } catch (err) {
            console.error(`An error occurred while trying to obtain the supported currencies. [${err}].`);
            throw err;
        }
    }

    /** This method verifies if there are supported currencies, and, if not, initializes it with {@var initialCurrencies}. */
    public async initializeSupportedCurrencies() : Promise<string[]> {
        const redisClient = this.getClient();

        const currencies = await redisClient.smembers(SUPPORTED_CURRENCIES_KEY);

        if(currencies.length === 0) {
            await redisClient.sadd(SUPPORTED_CURRENCIES_KEY, ...initialCurrencies);
            return initialCurrencies;
        }

        return currencies;
    }

    public async getCurrencyExchangeRate(originalCurrency: string, finalCurrency: string) : Promise<Big | null> {
        try{
            const exchangeRate = await this.getClient().get(this.getCurrencyExchangeRateKey(originalCurrency, finalCurrency));

            if(exchangeRate) {
                return Promise.resolve(Big(exchangeRate));
            }

            return Promise.resolve(null);
        } catch (err) {
            console.error(`An error occurred while trying to obtain the supported currencies. [${err}].`);
            throw err;
        }
    }

    public async setCurrencyExchangeRate(originalCurrency: string, exchangeRates: { [currency: string]: string }) : Promise<void> {
        try{
            for(const finalCurrency of Object.keys(exchangeRates)) {
                await this.getClient().set(this.getCurrencyExchangeRateKey(originalCurrency, finalCurrency), exchangeRates[finalCurrency], 'PX', this.getTTL());
            }
        } catch (err) {
            console.error(`An error occurred while trying to set the currency exchange rate. [${err}].`);
            throw err;
        }
    }

    private getClient() : Redis {
        return this.redisClient.getClient();
    }

    private getCurrencyExchangeRateKey(originalCurrency: string, finalCurrency: string) : string {
        return `currencies:exchange:${originalCurrency}:${finalCurrency}`;
    }

    private getTTL() {
        const now = new Date();

        const utcExchangeRateTime = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes());
        const utcExchangeRateExpirationTime = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes() + 2);

        return utcExchangeRateExpirationTime - utcExchangeRateTime;
    }
}

export default new CurrencyCache();