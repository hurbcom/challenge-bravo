import dotenv from 'dotenv';

dotenv.config();

const HTTP_SERVER_PORT = Number(process.env.HTTP_SERVER_PORT || 3000);
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}
const CURRENCYAPI_API_KEY = process.env.CURRENCYAPI_API_KEY;
if (!CURRENCYAPI_API_KEY) {
  throw new Error('CURRENCYAPI_API_KEY is not set');
}

export const env = {
  HTTP_SERVER_PORT,
  DATABASE_URL,
  CURRENCYAPI_API_KEY,
};

export default env;
