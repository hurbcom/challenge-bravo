// mongo-init.js

const axios = require('axios');
const Currency = require('../src/models/coins');

const populateDatabase = async () => {
  try {
    // Obter informações sobre moedas fiduciárias
    const responseFiat = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeRatesFiat = responseFiat.data.rates;

    // Obter informações sobre criptomoedas
    const responseCrypto = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 3,
        page: 1,
        sparkline: false,
      },
    });
    const cryptoCurrencies = responseCrypto.data;

    // Combinar informações sobre moedas fiduciárias e criptomoedas
    const currencies = [
      { code: 'USD', name: 'Dolar Americano', value: exchangeRatesFiat.USD },
      { code: 'BRL', name: 'Real Brasileiro', value: exchangeRatesFiat.BRL },
      { code: 'EUR', name: 'Euro', value: exchangeRatesFiat.EUR },
      { code: 'BTC', name: 'Bitcoin', value: cryptoCurrencies[0]?.current_price || 0 },
      { code: 'ETH', name: 'Ethereum', value: cryptoCurrencies[1]?.current_price || 0 },
    ];

    for (const currency of currencies) {
        const filter = { code: currency.code };
        const update = {
          $set: { code: currency.code,name:currency.name, value: currency.value},
        };
  
        await Currency.updateOne(filter, update, { upsert: true });
    }
    console.log('Dados inseridos com sucesso.');
  } catch (error) {
    console.error('Erro ao obter cotações:', error.message);
  }
}

module.exports = populateDatabase;
