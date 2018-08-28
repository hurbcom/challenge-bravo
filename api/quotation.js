const axios = require('axios');

/*
 * array com os códigos de todas as moedas disponÍveis na API
 */
const COINS = ['BRL', 'ETH', 'USD', 'EUR', 'BTC'];

/*
 * objeto que contem todas as cotações para as moedas disponÍveis na API
 */
const QUOTATIONS = {
  USD: { quotes: { USD: 1, BRL: 4.09, EUR: 0.8535, BTC: 0.0001418, ETH: 0.003466 } },
  BRL: { quotes: { USD: 0.25, BRL: 1, EUR: 0.21, BTC: 0.000036, ETH: 0.00089 } },
  EUR: { quotes: { USD: 1.17, BRL: 4.8, EUR: 1, BTC: 0.0001661, ETH: 0.004063 } },
  BTC: { quotes: { USD: 7058.31, BRL: 28900, EUR: 6022.88, BTC: 1, ETH: 22.24 } },
  ETH: { quotes: { USD: 288.33, BRL: 1181.43, EUR: 246.06, BTC: 0.04087, ETH: 1 } }
}
/*
 * função que atualiza os valores do objeto de cotações
 */
let updateQuotes = async function () {
  /*
   * aqui é utilizado um 'for' atualizar o objeto de cotações
   */
  for (let idx1 = 0; idx1 < COINS.length; idx1++) {
    if (COINS[idx1] == 'BRL') continue;
    for (let idx2 = 0; idx2 < COINS.length; idx2++) {
      if (COINS[idx1] != COINS[idx2]) {
        try {
          /*
           * aqui é utilizado o axios para fazer uma requição e retornar a cotação 
           * entre duas moedas
           */
          let { data } = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${COINS[idx1]}&tsyms=${COINS[idx2]}`);
          /* objeto de cotações é preenchido com as cotações vindas da requisição */
          QUOTATIONS[COINS[idx1]].quotes[COINS[idx2]] = data[COINS[idx1]][COINS[idx2]];
        } catch (error) {
          console.log('function upadateQuotes: ', error.message);
        }
      } else {
        /*
         * se o valor da prop for igual ao valor do objeto, ex: { USD: quotes: { USD } }
         * a ele sera atribuido o valor '1', isso aumenta a perfomance evitando que outra
         * requisição seja feita
         */
        QUOTATIONS[COINS[idx1]].quotes[COINS[idx2]] = 1;
      }
    }
  }
}

module.exports = {
  QUOTATIONS,
  updateQuotes
}