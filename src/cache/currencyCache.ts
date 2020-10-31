import { Redis } from 'ioredis';
import redisClient, { RedisClient } from '../../config/redis';
import initialCurrencies from './initialCurrencies.json';
import Big from 'big.js';

export const AVAILABLE_CURRENCIES_KEY = 'currencies:available';
export const SUPPORTED_CURRENCIES_KEY = 'currencies:supported';

class CurrencyCache {

    private redisClient: RedisClient;

    constructor() {
        this.redisClient = redisClient;
    }

    public async getAvailableCurrencies() : Promise<string[]> {
        try{
            return await this.getClient().smembers(AVAILABLE_CURRENCIES_KEY);
        } catch (err) {
            console.error(`An error occurred while trying to obtain the available currencies. [${err}].`);
            throw err;
        }
    }

    public async setAvailableCurrencies(currencies: string[]) : Promise<void> {
        try{
            const client = this.getClient();
            await client.sadd(AVAILABLE_CURRENCIES_KEY, currencies);
            await client.expire(AVAILABLE_CURRENCIES_KEY, this.getAvailableCurrenciesTTL());
        } catch (err) {
            console.error(`An error occurred while trying to set the available currencies. [${err}].`);
            throw err;
        }
    }

    public async getSupportedCurrencies() : Promise<string[]> {
        try{
            return await this.getClient().smembers(SUPPORTED_CURRENCIES_KEY);
        } catch (err) {
            console.error(`An error occurred while trying to obtain the supported currencies. [${err}].`);
            throw err;
        }
    }

    public async addSupportedCurrencies(currencies: string[]) : Promise<void> {
        try{
            await this.getClient().sadd(SUPPORTED_CURRENCIES_KEY, currencies);
        } catch (err) {
            console.error(`An error occurred while trying to add new currencies the supported currencies. [${err}].`);
            throw err;
        }
    }

    public async removeSupportedCurrencies(currencies: string[]) : Promise<void> {
        try{
            await this.getClient().srem(SUPPORTED_CURRENCIES_KEY, currencies);
        } catch (err) {
            console.error(`An error occurred while trying to remove some of the supported currencies. [${err}].`);
            throw err;
        }
    }

    /** This method verifies if there are supported currencies, and, if not, initializes it with {@link initialCurrencies}. */
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
            const supportedCurrencies = await this.getSupportedCurrencies();

            for(const finalCurrency of Object.keys(exchangeRates)) {
                if(supportedCurrencies.includes(finalCurrency)) {
                    await this.getClient().set(this.getCurrencyExchangeRateKey(originalCurrency, finalCurrency), exchangeRates[finalCurrency], 'PX', this.getCurrencyExchangeRateTTL());

                    console.info(`The exchange rate from ${originalCurrency} to ${finalCurrency} was added on cache.`);
                }
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

    private getCurrencyExchangeRateTTL() : number {
        const now = new Date();

        const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes(), now.getSeconds());
        const utcExchangeRateExpirationTime = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes() + 5);

        return utcExchangeRateExpirationTime - nowUTC;
    }

    private getAvailableCurrenciesTTL() : number {
        const now = new Date();

        const nowUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes(), now.getSeconds());
        const utcAvailableCurrenciesExpirationTime = Date.UTC(now.getFullYear(), now.getMonth() + 1);

        return (utcAvailableCurrenciesExpirationTime - nowUTC) / 1000;
    }
}

export default new CurrencyCache();