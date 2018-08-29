const axios = require('axios');

/*
 * array com os códigos de todas as moedas disponÍveis na API
 */
const COINS = ['ETH', 'USD', 'EUR', 'BTC', 'BRL'];

/*
 * objeto que contem todas as cotações para as moedas disponíveis na API, e que será atualizado
 * periodicamente pela função 'updateQuotes'
 */
const QUOTATIONS = {
  USD: { quotes: { USD: 1, BRL: 4.09, EUR: 0.8535, BTC: 0.0001418, ETH: 0.003466 } },
  BRL: { quotes: { USD: 0.25, BRL: 1, EUR: 0.21, BTC: 0.000036, ETH: 0.00088 } },
  EUR: { quotes: { USD: 1.17, BRL: 4.8, EUR: 1, BTC: 0.0001661, ETH: 0.004063 } },
  BTC: { quotes: { USD: 7058.31, BRL: 28900, EUR: 6022.88, BTC: 1, ETH: 22.24 } },
  ETH: { quotes: { USD: 288.33, BRL: 1181.43, EUR: 246.06, BTC: 0.04087, ETH: 1 } }
}
/*
 * função que atualiza os valores do objeto de cotações
 */
let updateQuotes = async function () {
  /*
   * aqui é utilizado dois 'for' para atualizar o objeto de cotações
   */
  for (let idx1 = 0; idx1 < COINS.length; idx1++) {
    for (let idx2 = 0; idx2 < COINS.length; idx2++) {
      if (COINS[idx1] != COINS[idx2]) {
        /*
         * a API que utilizo para buscar as cotações não tem suporte para a conversão do Real para
         * outras moedas, apenas o inverso. Por isso, quando a 'key' do objeto de cotações é igual 
         * a 'BRL' eu me utilizo das outras cotações para calcular a cotação do Real
         */
        if (COINS[idx1] == 'BRL') {
          QUOTATIONS['BRL'].quotes[COINS[idx2]] = 1 / QUOTATIONS[COINS[idx2]].quotes['BRL'];
        } else {
          try {
            /*
             * aqui é realizada uma requição que retorna a cotação entre duas moedas
             */
            let { data } = await axios.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${COINS[idx1]}&tsyms=${COINS[idx2]}`);
            /*
             * objeto de cotações é preenchido com as cotações vindas da requisição
             */
            QUOTATIONS[COINS[idx1]].quotes[COINS[idx2]] = data[COINS[idx1]][COINS[idx2]];
          } catch (error) {
            console.log('function upadateQuotes: ', error.message);
          }
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