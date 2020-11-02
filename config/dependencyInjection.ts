import ExchangeController from '../src/controllers/exchange';
import ExchangeService from '../src/services/exchange';
import CurrencyCache from '../src/cache/currencyCache';
import CoinbaseIntegration from '../src/integrations/coinbaseIntegration';
import redis from './redis';

const { EXCHANGE_API_BASEURL = 'https://api.coinbase.com/v2', REDIS_HOST = 'localhost', REDIS_PORT = '6379' } = process.env;

redis.configure({ host: REDIS_HOST, port: Number.parseInt(REDIS_PORT) });

export const coinbaseIntegration = new CoinbaseIntegration(EXCHANGE_API_BASEURL);
export const currencyCache = new CurrencyCache(redis);
export const exchangeService = new ExchangeService(currencyCache, coinbaseIntegration);
export const exchangeController = new ExchangeController(exchangeService);
