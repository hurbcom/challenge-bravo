import axios from 'axios';

export async function getExchangeRate(fromCurrency: string, toCurrency: string) {
    const exchangeRateURL = process.env.EXCHANGE_RATE_URL;

  try {
    const response = await axios.get(`${exchangeRateURL}/rates?from=${fromCurrency}&to=${toCurrency}`);
    return response.data.rate;
  } catch (error: TypeError | any) {
    throw new Error(`Failed to retrieve exchange rate: ${error.message}`);
  }
}
