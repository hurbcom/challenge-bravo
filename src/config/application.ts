import dotenv from 'dotenv';

if (process.env['NODE_ENV'] !== 'production') {
  dotenv.config();
}

export const appConfig = {
  NAME: process.env['APP_NAME'] || 'currency-convert-api',
  SERVER_PORT: process.env['PORT'] || 3000,
  API_VERSION: process.env['API_VERSION'] || 'v1',
  BASE_API_PATH: process.env['BASE_API_PATH'] || '/currency-convert',
  EXCHANGE_RATE_API: process.env['EXCHANGE_RATE_API'] || 'https://api.exchangerate-api.com/v4',
  COIN_GECKO_API: process.env['COIN_GECKO_API'] || 'https://api.coingecko.com/api/v3',
};
