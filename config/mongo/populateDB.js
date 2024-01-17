//Função de Populate do banco de dados
//Executada no start da api

const axios = require('axios');
const CurrencyProd = require('../../src/models/coinsProd');
const CurrencyTest = require('../../src/models/coinsTest');

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
    const currenciesProd = [
      { code: 'USD', name: 'Dolar Americano', value: exchangeRatesFiat.USD },
      { code: 'BRL', name: 'Real Brasileiro', value: exchangeRatesFiat.BRL },
      { code: 'EUR', name: 'Euro', value: exchangeRatesFiat.EUR },
      { code: 'BTC', name: 'Bitcoin', value: cryptoCurrencies[0]?.current_price || 0 },
      { code: 'ETH', name: 'Ethereum', value: cryptoCurrencies[1]?.current_price || 0 },
    ];
    // Criando informações de moedas teste
    const currenciesTest = [
      { code: 'EDIESCB', name: 'Eurodoláres', value: 4.20 },
      { code: 'BELLYONEPICE', name: 'Belly', value: 1.80 },
    ];    

    //Bloco de populate banco PROD
    for (const currency of currenciesProd) {
        const filter = { code: currency.code };
        const update = {
          $set: { code: currency.code,name:currency.name, value: currency.value},
        };
  
        await CurrencyProd.updateOne(filter, update, { upsert: true });
    }

    //Bloco de populate banco TEST
    for (const currency of currenciesTest) {
      const filter = { code: currency.code };
      const update = {
        $set: { code: currency.code,name:currency.name, value: currency.value},
      };

      await CurrencyTest.updateOne(filter, update, { upsert: true });
    }
  
    console.log("Coleção prod populada");
    console.log("Coleção test populada");    
    
  } catch (error) {
    console.error('Erro ao obter cotações:', error.message);
  }
}

module.exports = populateDatabase;
