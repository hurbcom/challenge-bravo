//Função para atualização de moedas
//Está função será executada a cada 5 minutos para manter os dados atualizados
const axios = require('axios');
const Currency = require('../../src/models/coinsProd');

const updateValueByInterval = async () => {
  try {

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

    // Bloco de update (somente banco PROD)
    for (const currency of existingCurrencies) {

      if (exchangeRatesFiat.hasOwnProperty(currency.code)) {
      // Validando existencia do codigo da moeda (Exemplo: BRL) dentro da api fiduciárias 

        const filter = { code: currency.code };
        const update = {
          $set: { value: exchangeRatesFiat[currency.code] },
        };
        await Currency.updateOne(filter, update);
        
      } else if (cryptoCurrencies.some(crypto => crypto.symbol.toUpperCase() === currency.code.toUpperCase())) {
      // Validando existencia do codigo da moeda (Exemplo: BTC) dentro da api crypto
      
        const cryptoCurrency = cryptoCurrencies.find(crypto => crypto.symbol.toUpperCase() === currency.code.toUpperCase());
        const filter = { code: currency.code };
        const update = {
          $set: { value: cryptoCurrency.current_price },
        };
        await Currency.updateOne(filter, update);
      }
    }
  } catch (error) {
    console.error('Erro ao obter cotações:', error.message);
  }
}

module.exports = updateValueByInterval;
