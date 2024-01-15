// mongo-init.js

const axios = require('axios');
const Currency = require('../src/models/coins');

const updateValueByInterval = async () => {
  console.log('Iniciando atualizações de valores');    
  try {
    // Obter todas as moedas da coleção
    const existingCurrencies = await Currency.find();

    // Obter informações sobre moedas fiduciárias
    const responseFiat = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeRatesFiat = responseFiat.data.rates;

    // Obter informações sobre criptomoedas (aumentar o limite para obter mais criptomoedas)
    const responseCrypto = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100, // Ajuste o limite conforme necessário
        page: 1,
        sparkline: false,
      },
    });
    const cryptoCurrencies = responseCrypto.data;

    for (const currency of existingCurrencies) {

      if (exchangeRatesFiat.hasOwnProperty(currency.code)) {
        const filter = { code: currency.code };
        const update = {
          $set: { value: exchangeRatesFiat[currency.code] },
        };
        await Currency.updateOne(filter, update);
        
      } else if (cryptoCurrencies.some(crypto => crypto.symbol.toUpperCase() === currency.code.toUpperCase())) {
        // Verificar se o código da moeda existe na resposta da API de criptomoedas
        const cryptoCurrency = cryptoCurrencies.find(crypto => crypto.symbol.toUpperCase() === currency.code.toUpperCase());
        const filter = { code: currency.code };
        const update = {
          $set: { value: cryptoCurrency.current_price },
        };
        await Currency.updateOne(filter, update);
      } else {
        console.log(`A moeda com o código ${currency.code} não existe nas APIs. Não será atualizada.`);
      }
    }

    console.log('Dados atualizados com sucesso.');
  } catch (error) {
    console.error('Erro ao obter cotações:', error.message);
  }
}

module.exports = updateValueByInterval;
