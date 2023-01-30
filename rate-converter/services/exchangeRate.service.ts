import axios from 'axios';

export async function getExchangeRate(fromCurrency: String, toCurrency: String) {
    const exchangeRateURL = process.env.EXCHANGE_RATE_URL;

  try {
    const response = await axios.get(`${exchangeRateURL}?from=${fromCurrency}&to=${toCurrency}`);
    return response.data.exchangeRate;
  } catch (error: TypeError | any) {
    throw new Error(`Failed to retrieve exchange rate: ${error.message}`);
  }
}
