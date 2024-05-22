import axios from 'axios';

export type CurrencyType = 'FIAT' | 'CRYPTO' | 'FICTITIOUS';

interface Currency {
  code: string;
  type: CurrencyType;
  conversionRateToUSD?: number;
}

export interface Rates {
  [key: string]: { code: string; type: CurrencyType; unitToUSD: number };
}

let currencies: Currency[] = [];
let fiatRates: Rates = {};
let cryptoRates: Rates = {};
let symbolToIdMap: { [key: string]: string } = {};

const exchangeRateAPI = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`;
const coinPriceGeckoAPI = `https://api.coingecko.com/api/v3/simple/price?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}`;
const symbolCoinGeckoAPI = `https://api.coingecko.com/api/v3/coins/markets?x_cg_demo_api_key=${process.env.COIN_GECKO_API_KEY}&vs_currency=usd&order=market_cap_desc`;

async function fetchFiatRates(): Promise<Rates> {
  const response = await axios.get(exchangeRateAPI);
  const ratesData = response.data.conversion_rates;
  return Object.keys(ratesData).reduce((acc, code) => {
    acc[code] = { code, type: 'FIAT', unitToUSD: ratesData[code] as number };
    return acc;
  }, {} as Rates);
}

async function fetchSymbolToIdMap(): Promise<{ [key: string]: string }> {
  const response = await axios.get(symbolCoinGeckoAPI);
  const symbolData = response.data;
  return symbolData.reduce((acc: { [key: string]: string }, item: { id: string; symbol: string }) => {
    acc[item.symbol.toUpperCase()] = item.id;
    return acc;
  }, {});
}

async function fetchCryptoRates(symbolToIdMap: { [key: string]: string }): Promise<Rates> {
  const cryptoSymbols = Object.values(symbolToIdMap).join(',');
  const response = await axios.get(`${coinPriceGeckoAPI}&ids=${cryptoSymbols}&vs_currencies=usd`);
  const ratesData = response.data;
  return Object.keys(symbolToIdMap).reduce((acc, symbol) => {
    const id = symbolToIdMap[symbol];
    if (ratesData[id] && ratesData[id].usd !== undefined) {
      acc[symbol] = { code: symbol, type: 'CRYPTO', unitToUSD: ratesData[id].usd };
    }
    return acc;
  }, {} as Rates);
}

export async function initializeRates() {
  try {
    fiatRates = await fetchFiatRates();
    symbolToIdMap = await fetchSymbolToIdMap();
    cryptoRates = await fetchCryptoRates(symbolToIdMap);

    currencies = [
      { code: 'USD', type: 'FIAT' as CurrencyType, conversionRateToUSD: fiatRates['USD']?.unitToUSD },
      { code: 'BRL', type: 'FIAT' as CurrencyType, conversionRateToUSD: fiatRates['BRL']?.unitToUSD },
      { code: 'EUR', type: 'FIAT' as CurrencyType, conversionRateToUSD: fiatRates['EUR']?.unitToUSD },
      { code: 'BTC', type: 'CRYPTO' as CurrencyType, conversionRateToUSD: cryptoRates['BTC']?.unitToUSD },
      { code: 'ETH', type: 'CRYPTO' as CurrencyType, conversionRateToUSD: cryptoRates['ETH']?.unitToUSD }
    ].filter(currency => currency.conversionRateToUSD !== undefined);

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error('Too many requests: Free plan limit reached, please wait 1 minute');
      throw new Error('Too many requests: Free plan limit reached, please wait 1 minute');
    } else {
      console.error('Failed to initialize rates:', error);
      throw new Error('Failed to initialize rates');
    }
  }
}

export async function updateRates() {
  try {
    const newFiatRates = await fetchFiatRates();
    const newSymbolToIdMap = await fetchSymbolToIdMap();
    const newCryptoRates = await fetchCryptoRates(newSymbolToIdMap);

    fiatRates = newFiatRates;
    symbolToIdMap = newSymbolToIdMap;
    cryptoRates = newCryptoRates;

    currencies = currencies.map(currency => {
      let conversionRateToUSD;

      if (currency.type === 'FIAT') {
        conversionRateToUSD = newFiatRates[currency.code]?.unitToUSD;
      } else if (currency.type === 'CRYPTO') {
        conversionRateToUSD = newCryptoRates[currency.code]?.unitToUSD;
      } else {
        conversionRateToUSD = currency.conversionRateToUSD;
      }

      return {
        ...currency,
        conversionRateToUSD: conversionRateToUSD !== undefined ? conversionRateToUSD : currency.conversionRateToUSD
      };
    });

  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error('Too many requests: Free plan limit reached, please wait 1 minute');
      throw new Error('Too many requests: Free plan limit reached, please wait 1 minute');
    } else {
      console.error('Failed to update rates:', error);
      throw new Error('Failed to update rates');
    }
  }
}


export async function convertCurrency(from: string, to: string, amount: number): Promise<string> {
  await updateRates();
  const fromCurrency = currencies.find(c => c.code === from);
  const toCurrency = currencies.find(c => c.code === to);

  if (!fromCurrency || !toCurrency) {
    throw new Error('Unsupported currency');
  }

  const fromRate = getConversionRate(fromCurrency);
  const toRate = getConversionRate(toCurrency);

  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;

  return convertedAmount >= 1 ? `${convertedAmount.toFixed(2)}` : `${convertedAmount.toFixed(6)}`;
}

function getConversionRate(currency: Currency): number {
  if (currency.type === 'FICTITIOUS') {
    return currency.conversionRateToUSD!;
  } else if (fiatRates[currency.code]) {
    return fiatRates[currency.code].unitToUSD;
  } else {
    return cryptoRates[currency.code].unitToUSD;
  }
}

export async function addCurrency(code: string, type: CurrencyType, conversionRateToUSD?: number) {
  console.log(`Adding currency: ${code}, type: ${type}, conversionRateToUSD: ${conversionRateToUSD}`);

  if (currencies.some(c => c.code === code)) {
    throw new Error('Currency already exists');
  }

  if (type === 'FICTITIOUS') {
    if (!conversionRateToUSD) {
      throw new Error('Conversion rate to USD is required for fictitious currencies');
    }
    currencies.push({ code, type, conversionRateToUSD });
    return;
  }

  if (type === 'FIAT') {
    if (!fiatRates[code]) {
      fiatRates = await fetchFiatRates();
      if (!fiatRates[code]) {
        throw new Error('Unable to find conversion rate for the given FIAT code');
      }
    }
    conversionRateToUSD = fiatRates[code].unitToUSD;
    currencies.push({ code, type, conversionRateToUSD });
    return;
  }

  if (type === 'CRYPTO') {
    if (!cryptoRates[code]) {
      symbolToIdMap = await fetchSymbolToIdMap();
      const cryptoId = symbolToIdMap[code];
      if (!cryptoId) {
        throw new Error('Unable to find ID for the given CRYPTO symbol');
      }
      cryptoRates = await fetchCryptoRates(symbolToIdMap);
      if (!cryptoRates[code]) {
        throw new Error('Unable to find conversion rate for the given CRYPTO code');
      }
    }
    conversionRateToUSD = cryptoRates[code].unitToUSD;
    currencies.push({ code, type, conversionRateToUSD });
  }
}

export function removeCurrency(code: string) {
  const index = currencies.findIndex(c => c.code === code);
  if (index === -1) {
    throw new Error('Currency not found');
  }
  currencies.splice(index, 1);
}

export function clearCurrencies() {
  currencies = [];
}

export async function getCurrency(code: string): Promise<{ code: string; type: CurrencyType; unit: string } | undefined> {
  await updateRates();
  const currency = currencies.find(c => c.code === code);
  if (!currency) {
    return undefined;
  }

  const conversionRateToUSD = getConversionRate(currency);
  return {
    code: currency.code,
    type: currency.type,
    unit: `${conversionRateToUSD.toFixed(2)} USD`
  };
}

export async function getAllCurrencies(): Promise<{ code: string; type: CurrencyType; unit: string }[]> {
  await updateRates();
  return currencies.map(currency => {
    const conversionRateToUSD = getConversionRate(currency);
    return {
      code: currency.code,
      type: currency.type,
      unit: `${conversionRateToUSD.toFixed(2)} USD`
    };
  });
}

initializeRates().catch(error => console.error(error));
